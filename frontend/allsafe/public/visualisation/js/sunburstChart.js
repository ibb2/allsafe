// Create sunburst chart
export function createSunburstChart(data, containerId, selectedLevel2Category) {
    console.log("Filtered data passed to Sunburst Chart:", data);  // Log the filtered data

    // Check if data is empty after filtering
    if (data.length === 0) {
        console.log("No data available for the selected year");
        d3.select(`#${containerId}`).append("text")
            .attr("x", 100)
            .attr("y", 100)
            .text("No data available for the selected year")
            .style("font-size", "16px")
            .style("color", "red");
        return;
    }
    // Create a tooltip
    const tooltip = d3.select("#tooltip-sunburst")
                        .style("position", "absolute")
                        .style("padding", "12px")
                        .style("text-align", "center")
                        .style("font-size", "16px")
                        .style("border", "1px solid #ddd")
                        .style("border-radius", "3px")
                        .style("transform", "translateX(15px)")
                        .style("box-shadow", "0 0 5px rgba(0,0,0,0.2)");
    

    // Set up container and dimensions of the graph
    const container = document.getElementById(containerId);
    
    function getDimensions() {
        const { width: containerWidth, height: containerHeight } = container.getBoundingClientRect();
        return {
            width: containerWidth,
            height: containerHeight > 400 ? containerHeight : 400 // Minimum height
        };
    }
    
    // Get dimension
    let { width, height } = getDimensions();

    const radius = Math.min(width, height) / 6;

    // Get the Data
    // Get the Data
    // Step 1: Group the data by category_level2 and sum up the values
    const level2Totals = Array.from(d3.rollup(data, 
        v => v.length, 
        d => d.category_level2
    )).map(([key, value]) => ({ key, value }));
    console.log("Total values for each level 2 category:", level2Totals);

    // Step 2: Sort level2 categories by the total values in descending order
    // Exclude the "Other" category and get the next top 5 categories
    const topLevel2Categories = level2Totals
        .filter(category => category.key !== "Other")  // Exclude "Other"
        .sort((a, b) => b.value - a.value)  // Sort descending by value
        .slice(0, 5);  // Get the top 5 categories excluding "Other"
    console.log("Top 5 Level 2 categories (excluding 'Other'):", topLevel2Categories);

    // Step 3: Filter the original data to only include these top 5 level2 categories
    const filteredData = data.filter(d => 
        topLevel2Categories.some(category => category.key === d.category_level2)
    );
    console.log("Filtered data for top 5 Level 2 categories:", filteredData);

    // Step 4: Group the filtered data by category_level2 and category_level3
    const groupedData = Array.from(d3.group(filteredData, d => d.category_level2, d => d.category_level3), ([key, value]) => ({
        key,
        values: Array.from(value, ([subKey, subValue]) => ({
            key: subKey,
            report: d3.sum(subValue, d => d.no_of_reports)
        }))
    }));
    
    console.log("Grouped Data for Top 5:", groupedData);

    // Step 5: Convert the grouped data into a hierarchical structure
    const hierarchicalData = {
        name: "root",
        children: groupedData.map(level2 => ({
            name: level2.key,  // Level 2 category
            children: level2.values.map(level3 => ({
                name: level3.key,  // Level 3 category
                value: level3.report  // Count of occurrences
            }))
        }))
    };

    console.log("Top 5 Hierarchical Data:", hierarchicalData);

    //--------------------------------------- END OF DATA ---------------------------------------
    
    // Create the color scale.
    // Create the color scale.
    const color = d3.scaleOrdinal(d3.quantize(d3.interpolateRainbow, topLevel2Categories.length + 1)); // Use topLevel2Categories.length

    // Compute the layout.
    const hierarchy = d3.hierarchy(hierarchicalData)
        .sum(d => d.value)
        .sort((a, b) => b.value - a.value);
    const root = d3.partition()
        .size([2 * Math.PI, hierarchy.height + 1])
        (hierarchy);
    root.each(d => d.current = d);

    // Create the arc generator.
    const arc = d3.arc()
        .startAngle(d => d.x0)
        .endAngle(d => d.x1)
        .padAngle(0.01)  // Increase padding between sectors
        .padRadius(radius * 1.5)
        .innerRadius(d => d.y0 * radius)
        .outerRadius(d => Math.max(d.y0 * radius, d.y1 * radius - 1));


    // Create the SVG container.
    const svg = d3.select(`#${containerId}`).append("svg")
    .attr("viewBox", `-${width / 2} -${height / 3} ${width} ${height / 1.5}`)
    .attr("width", "100%")  // Ensure SVG takes full width of the container
    .attr("height", "100%") // Ensure SVG takes full height of the container
    .style("font", "10px sans-serif");


    // Update report number format
    const formatNumber = new Intl.NumberFormat();

    // Append the arcs.
    // Append the arcs and add the tooltip interaction
    // Append the arcs and add the tooltip interaction
    const path = svg.append("g")
    .selectAll("path")
    .data(root.descendants().slice(1))  // Exclude the root node
    .join("path")
    .attr("fill", d => { 
        while (d.depth > 1) d = d.parent; 
        return color(d.data.name); 
    })
    .attr("fill-opacity", d => arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0)
    .attr("pointer-events", d => arcVisible(d.current) ? "auto" : "none")
    .attr("d", d => arc(d.current))

    // Tooltip interaction
    .on("mouseover", (event, d) => {
        // Calculate the percentage based on the parent node
        const parentValue = d.parent ? d.parent.value : root.value;  // If there's a parent, use its value, else use root
        const percentage = ((d.value / parentValue) * 100).toFixed(2);  // 2 decimal places

        tooltip.classed("hidden", false)
            .style("visibility", "visible")
            .html(`Scam Type: ${d.data.name}<br>Report Number: ${formatNumber.format(d.value)}<br>Percentage: ${percentage}%`)
            .style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 28) + "px");
    })
    .on("mousemove", (event) => {
        tooltip.style("left", (event.pageX + 15) + "px")
            .style("top", (event.pageY - 28) + "px");
    })
    .on("mouseout", () => 
        tooltip.classed("hidden", true)
            .style("visibility", "hidden"))
            
    // Add the click event handler
    .on("click", clicked);  // Attach the click event


    // Make them clickable if they have children.
    path.filter(d => d.children)
        .style("cursor", "pointer")
        .on("click", clicked);

        const label = svg.append("g")
        .attr("pointer-events", "none")
        .attr("text-anchor", "middle")
        .style("user-select", "none")
        .selectAll("text")
        .data(root.descendants().slice(1))
        .join("text")
        .attr("dy", "0.35em")
        .attr("fill-opacity", d => +labelVisible(d.current))
        .attr("transform", d => labelTransform(d.current))
        .attr("font-size", d => {
            const sectorWidth = (d.x1 - d.x0) * radius;  // Calculate the width of the sector
            return sectorWidth < 50 ? "8px" : "10px";  // Adjust font size based on sector width
        })
        .text(d => d.data.name);
    
    // Add the text wrapping after label creation
    label.call(wrapText, radius);

    // Function to wrap text inside the arcs
    function wrapText(text, radius) {

        const containerWidth = container.getBoundingClientRect().width;
        const responsiveScaleFactor = containerWidth / 1200; // Assume 1200px as the base design size

        text.each(function() {
            const text = d3.select(this),
                  words = text.text().split(/\s+/).reverse(),
                  lineHeight = 1.1,  // ems
                  y = text.attr("y"),
                  dy = parseFloat(text.attr("dy")) || 0;
    
            let word,
                line = [],
                lineNumber = 0,
                tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
    
            while (word = words.pop()) {
                line.push(word);
                tspan.text(line.join(" "));
                const tspanWidth = tspan.node().getComputedTextLength();
                const maxWidth = radius * 0.5;  // Adjust this based on sector size
    
                if (tspanWidth > maxWidth) {
                    line.pop();
                    tspan.text(line.join(" "));
                    line = [word];
                    tspan = text.append("tspan")
                                .attr("x", 0)
                                .attr("y", y)
                                .attr("dy", ++lineNumber * lineHeight + dy + "em")
                                .text(word);
                }
            }
    
            const totalLines = lineNumber + 1;
            const adjustY = -(totalLines - 1) * lineHeight / 2;
            text.selectAll("tspan")
                .attr("dy", (d, i) => i === 0 ? `${adjustY + dy}em` : `${lineHeight}em`);
        });
    }

    // Listen for window resize events and adjust font size and layout accordingly
    window.addEventListener("resize", function() {
        const containerWidth = container.getBoundingClientRect().width;  // Get the current container width

        // Adjust font size and radius based on the container width (for responsiveness)
        if (containerWidth < 400) {  // For mobile screens
            label.attr("font-size", "8px");  // Reduce font size
            label.call(wrapText, radius * 0.8);  // Reduce radius for better fit
        } else {
            label.attr("font-size", "10px");  // Default font size for larger screens
            label.call(wrapText, radius);  // Normal radius for larger screens
        }
    });
    
    // Add hover effect for the parent circle (center of the chart)
    const parent = svg.append("circle")
    .datum(root)
    .attr("r", radius)
    .attr("fill", "white")  // Make the center white
    .attr("pointer-events", "all")
    .style("cursor", "pointer")  // Change cursor to pointer to indicate it's clickable
    .on("click", clicked)
    .on("mouseover", function() {
        returnText.style("font-size", "16px");  // Increase text size on hover
    })
    .on("mouseout", function() {
        returnText.style("font-size", "14px");  // Reset text size
    });

    // Add hover effect for the "Return" text in the center
    const returnText = svg.append("text")
    .attr("text-anchor", "middle")
    .attr("dy", "0.35em")
    .attr("pointer-events", "none")
    .style("font-size", "14px")
    .style("fill", "black")
    .style("cursor", "pointer")  // Ensure cursor is a pointer
    .text("Return")
    .on("click", clicked)
    .on("mouseover", function() {
        d3.select(parent).style("cursor", "pointer");  // Ensure both text and parent show pointer cursor
        d3.select(this).style("font-size", "16px");  // Increase text size
    })
    .on("mouseout", function() {
        d3.select(this).style("font-size", "14px");  // Reset text size
    });

    // Handle zoom on click.
    function clicked(event, p) {
        console.log("Sunburst sector clicked!", selectedLevel2Category);

        // Only allow clicks on level 2 categories (depth === 1)
        if (p.depth === 2) {
            // Ignore clicks on level 3 categories
            console.log("Level 3 category clicked, interaction prevented.");
            return;
        }

        parent.datum(p.parent || root);
        
        // If p is the root, this means we're resetting to the original state
        if (p === root) {
            console.log("Resetting the sunburst chart to initial state");
            // Dispatch the custom event to reset the bar chart
            const resetBarChartEvent = new CustomEvent('resetBarChart');
            console.log('Dispatching resetBarChart event');  // Log the event dispatch
            window.dispatchEvent(resetBarChartEvent);  // Dispatch the event globally
        } else if (p.depth === 1) {
            // Dispatch the custom event for Level 2 category click if it exists
            selectedLevel2Category = p.data.name;
            console.log("Sunburst Clicked, Level 2 Category:", selectedLevel2Category);
    
            // Dispatch the custom event to notify the bar chart
            const sunburstClickEvent = new CustomEvent('sunburstClick', {
                detail: { level2Id: selectedLevel2Category }
            });
            console.log('Dispatching sunburstClick event with level2Id:', selectedLevel2Category);  // Log this
            window.dispatchEvent(sunburstClickEvent);  // Dispatch the event globally
        }
    
        root.each(d => d.target = {
            x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
            y0: Math.max(0, d.y0 - p.depth),
            y1: Math.max(0, d.y1 - p.depth)
        });
    
        const t = svg.transition().duration(750);
    
        path.transition(t)
            .tween("data", d => {
                const i = d3.interpolate(d.current, d.target);
                return t => d.current = i(t);
            })
            .filter(function(d) {
                return +this.getAttribute("fill-opacity") || arcVisible(d.target);
            })
            .attr("fill-opacity", d => arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0)
            .attr("pointer-events", d => arcVisible(d.target) ? "auto" : "none")
            .attrTween("d", d => () => arc(d.current));
    
        label.filter(function(d) {
            return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        }).transition(t)
            .attr("fill-opacity", d => +labelVisible(d.target))
            .attrTween("transform", d => () => labelTransform(d.current));
    }
    
    // Receive the click command
    window.addEventListener('barClick', function(event) {
        const { level2Id } = event.detail;
        console.log('Sunburst Received Bar Click Event, level2Id:', level2Id);  // Log the received event
        
        // Find the corresponding section in the sunburst chart
        const targetSection = root.descendants().find(d => d.depth === 1 && d.data.name === level2Id);
        
        if (targetSection) {
            console.log('Highlighting Sunburst Section for:', targetSection.data.name);  // Log the section
            clicked(null, targetSection);  // Simulate a click on the corresponding section
        } else {
            console.log('No matching section found in sunburst for:', level2Id);
        }
    });

    // Event listener for resetting the sunburst
    window.addEventListener('resetSunburst', function() {
        console.log('Sunburst received reset event, returning to root.');
        
        // Reset the sunburst to its initial state (root view)
        clicked(null, root);  // Simulate a click on the root to reset the sunburst
    });

    // Adjust the visibility of labels based on the sector's size
    function labelVisible(d) {
        const labelThreshold = 0.2;  // A more restrictive threshold (increase if needed)
        const minArcLength = 10; // Minimum arc length in pixels (adjust as necessary)
        const sectorArea = (d.y1 - d.y0) * (d.x1 - d.x0);  // Calculate sector area
        const arcLength = (d.x1 - d.x0) * radius;  // Calculate the length of the arc
    
        // Only show the label if the area of the sector is larger than the threshold and arc length is sufficient
        return d.y1 <= 3 && d.y0 >= 1 && sectorArea > labelThreshold && arcLength > minArcLength;
    }
    
    function arcVisible(d) {
        return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }

    function labelTransform(d) {
        const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;  // Center the text in the sector
        const y = (d.y0 + d.y1) / 2 * radius;
    
        // Detect narrow sectors and adjust position slightly to center text better
        const sectorWidth = d.x1 - d.x0;
        const offset = sectorWidth < 0.15 ? 5 : 0;  // Adjust for narrow sectors (adjust the threshold as needed)
    
        return `rotate(${x - 90 + offset}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    }
    
}
