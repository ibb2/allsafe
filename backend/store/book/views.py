from django.http import JsonResponse
from django.db import connection
from .models import ScamSMS
# from .models import HistoricalScam
# from django.db.models import Count
# import random
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json
import os
import json
import pandas as pd
import numpy as np
import xgboost as xgb
import re
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.db import connection

def random_scam_sms(request):
    # # Get the total count of rows in the table
    # count = ScamSMS.objects.count()

    # # Generate a list of random indexes
    # random_indexes = random.sample(range(1, count+1), min(100, count))

    indexes = [259, 375, 834, 1688, 1765, 2645, 4571, 5028, 530, 895, 
      935, 1102, 1482, 1694, 2052, 2460, 3296, 3546, 5199, 5400]
    # indexes_plus_one = [i - 1 for i in indexes]

    # Fetch rows using the indexes
    data = list(ScamSMS.objects.filter(id__in=indexes).values())

    return JsonResponse(data, safe=False)

def all_historical_scam(request):
    with connection.cursor() as cursor:
        # Execute raw SQL to fetch filtered data from 'historical_scam' table
        cursor.execute(
            "SELECT * FROM historical_scam WHERE age IN ('18 - 24', '25 - 34')"
        )
        columns = [col[0] for col in cursor.description]  # Get column names
        data = [
            dict(zip(columns, row))
            for row in cursor.fetchall()
        ]  # Combine column names and row values into a dictionary

    return JsonResponse(data, safe=False)

# Precompile the regular expressions for efficiency
pattern_potential_url = re.compile(r'(https?://)?([\w\-]+\.)+[a-zA-Z]{2,}(/[^\s]*)?')
pattern_phone = re.compile(r'(\+?\d{1,2}[\s-]?)?(\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4}')
pattern_email = re.compile(r'((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$')
pattern_bsb = re.compile(r'^\d{6}$')
pattern_account = re.compile(r'^\d{8}$')
pattern_nonstandard_space = re.compile(r'[\u00A0\u200B]+')
pattern_extra_spaces = re.compile(r'\s+')

def text_analysis(text):
    # Initialize flags
    check_url = check_phone = check_email = bank_bsb = bank_account = check_bank = sus_url = False

    # Replace non-standard spaces and multiple spaces with a single space
    text = pattern_extra_spaces.sub(' ', pattern_nonstandard_space.sub(' ', text))

    # Split and clean words from input text
    cleaned_words = [re.sub(r'[.,!?;:]+$', '', word) for word in text.split(" ")]

    # Extract potential URLs from the input text
    potential_urls = [word for word in cleaned_words if pattern_potential_url.match(word)]

    # Optimize the SQL query for suspicious URLs directly using a single IN clause
    if potential_urls:
        placeholders = ', '.join(['%s'] * len(potential_urls))
        query = f"SELECT COUNT(*) FROM scam_url WHERE label = 1 AND url IN ({placeholders})"
        with connection.cursor() as cursor:
            cursor.execute(query, potential_urls)  # Use parameterized queries for better performance and security
            result = cursor.fetchone()
            if result and result[0] > 0:
                sus_url = True

    # Check each word with different patterns in a single loop
    for word in cleaned_words:
        # 1. Check if potential web link exists
        if pattern_potential_url.match(word):
            check_url = True

        # 2. Check if potential phone number is valid
        if pattern_phone.match(word):
            check_phone = True

        # 3. Check if potential email is valid
        if pattern_email.match(word):
            check_email = True

        # 4. Check if potential bank account exists
        if pattern_bsb.match(word):
            bank_bsb = True
        elif pattern_account.match(word):
            bank_account = True

    # Final check if a potential bank account exists or not
    check_bank = bank_bsb and bank_account

    # Prepare the result dictionary with the new sus_url flag
    result_dict = {
        'link': check_url,
        'phone': check_phone,
        'email': check_email,
        'bank_account': check_bank,
        'sus_url': sus_url  # New flag for suspicious URL
    }

    return result_dict

@csrf_exempt
@require_POST
def predict(request):
    try:
        # Parse the request body
        data = json.loads(request.body)
        scam_text = data.get("text", "")

        # Run text analysis to check for URLs, phone numbers, emails, and bank account information
        analysis_result = text_analysis(scam_text)

        # Combine the prediction and text analysis results
        response = {**analysis_result}

        return JsonResponse(response)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)

# Load the XGBoost model and scaling parameters once during startup
xgb_model = xgb.Booster()
model_path = os.path.join(os.path.dirname(__file__), "models/best_xgb_model.json")
scaling_params_path = os.path.join(os.path.dirname(__file__), "models/scaling_params.json")

xgb_model.load_model(model_path)

# Load scaling parameters
with open(scaling_params_path, "r") as f:
    scaling_params = json.load(f)

# Extract scaling parameters
min_vals = np.array(scaling_params["min"])
max_vals = np.array(scaling_params["max"])
feature_columns = scaling_params["columns"]

def scale_input_data(input_data, min_vals, max_vals, feature_columns):
    # Ensure the input data columns are in the same order as the training data
    input_data = input_data[feature_columns]

    # Convert to numpy array and apply min-max scaling formula
    scaled_data = (input_data.values - min_vals) / (max_vals - min_vals)
    return pd.DataFrame(scaled_data, columns=input_data.columns)

def predict_xgboost(input_data, model, min_vals, max_vals, feature_columns):
    # Manually scale the input data using min and max values
    scaled_data = scale_input_data(input_data, min_vals, max_vals, feature_columns)

    # Convert scaled data to DMatrix format for XGBoost
    dmatrix = xgb.DMatrix(scaled_data)

    # Get predictions from XGBoost
    predictions = model.predict(dmatrix)

    # Convert numpy types to Python native types for JSON serialization
    results = []
    for pred in predictions:
        label = "Fake" if pred > 0.5 else "Normal"  # Label as "Fake" or "Normal"
        confidence = round(pred if label == "Fake" else (1 - pred), 4)  # Round confidence to 4 decimal places
        results.append({"label": label, "confidence": confidence})

    return results

@csrf_exempt
@require_POST
def insta(request):
    try:
        # Parse the request body
        data = json.loads(request.body)

        # Convert the incoming JSON data to a DataFrame for prediction
        input_df = pd.DataFrame([data])  # Create a single-row DataFrame

        # Use the XGBoost model to make a prediction
        prediction_result = predict_xgboost(input_df, xgb_model, min_vals, max_vals, feature_columns)

        # Convert numpy.float32 or numpy.int32 types to native Python types
        for result in prediction_result:
            result["confidence"] = float(result["confidence"])  # Convert confidence to Python float

        # Return the prediction result
        return JsonResponse({"prediction": prediction_result})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)
