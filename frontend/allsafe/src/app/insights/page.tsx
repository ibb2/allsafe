'use client'

import { useEffect } from 'react'

import '../style.css' // Assuming your CSS is in the src/styles folder
import { cn } from '@/lib/utils'
import { TypographyH2 } from '@/typography/h2'
import { TypographyLead } from '@/typography/lead'
import { TypographyH1 } from '@/typography/h1'
import Image from 'next/image'
import Link from 'next/link'

const Insights = () => {
    useEffect(() => {
        // This will run after the component mounts
        const script = document.createElement('script')
        script.src = '/src/script.js'
        script.type = 'module'
        document.body.appendChild(script)

        return () => {
            // Clean up the script when the component unmounts
            document.body.removeChild(script)
        }
    }, [])

    return (
        <div className="flex flex-col w-full p-6 gap-y-24 max-w-full">
            <section
                id="scam-trend-section"
                className="flex flex-col flex-wrap w-full min-h-screen justify-around items-center bg-gray-50 py-16"
            >
                {/* Header with margin for spacing */}
                <TypographyH1 className="text-4xl font-bold text-center mb-8">
                    Do you know how fast the scam growth in the past few years?
                </TypographyH1>

                <div className="relative flex flex-col sm:flex-row w-full justify-center items-center">
                    {/* Line chart container with padding and border for emphasis */}
                    <div
                        id="line-chart-container"
                        className="w-11/12 sm:w-1/2 p-6 bg-white shadow-lg rounded-lg"
                    >
                        <div id="scam-line-chart" className="chart"></div>
                    </div>

                    {/* Text description with padding and margin for better readability */}
                    <p className="text-left sm:w-1/3 text-lg leading-relaxed p-4 sm:ml-8 mt-8 sm:mt-0 bg-white shadow-md rounded-lg">
                        From January 2020 to July 2024, there have been 18,714
                        reported social media scams affecting young adults in
                        Australia. Comparing the whole year of 2023 and 2022,
                        reported scams increased by about 21%. The scam reported
                        peak is in January 2023, with 621 scams reported in just
                        a month.
                        <br />
                        <br />
                        Although the number of scam reports gradually decreased
                        from then, the monthly reported scams in 2024 are still
                        around 300.
                        <br />
                        <br />
                        If the scam is an unexploded boom without a trend for us
                        to prevent, how will scams influence the digital era if
                        we don’t have related knowledge to take proper action?
                        <br />
                        <br />
                        <span className="font-bold text-blue-600">
                            User Guide:
                        </span>{' '}
                        Scroll to the left to discover the trend of social media
                        scams that have occurred with young adults since 2020;
                        hover over the graph to find the number of scams in each
                        month and throughout the whole period.
                    </p>
                </div>
            </section>

            <section
                id="word-cloud-section"
                className="flex flex-col flex-wrap w-full min-h-screen justify-around items-center"
            >
                <TypographyH2 className="text-center border-0">
                    Have you ever received this kind of message?
                </TypographyH2>
                <div className="flex flex-col justify-around items-center sm:flex-row w-full">
                    <div id="word-cloud" className="sm:w-5/12 pb-8">
                        {/* <Image
                            src={'/wordcloud.png'}
                            alt="Word Cloud Image"
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{ width: 'auto', height: '100%' }} // optional
                        /> */}
                        <Image
                            src="/wordcloud.png"
                            alt="Word Cloud Image"
                            width="0"
                            height="0"
                            sizes="100vw"
                            className="w-full h-auto"
                        ></Image>
                    </div>
                    <p className="sm:w-1/3">
                        This word cloud highlights the most common words
                        scammers use to make their messages sound personal,
                        urgent, or convincing. These words are designed to trick
                        you into responding or taking action based on false
                        promises.
                        <br />
                        <br />
                        Have you ever received a message that seemed too good to
                        be true? Did it make you pause and wonder if you might
                        get easy money, or did it leave you feeling unsure?
                        Scammers use these tricks to either get you to pay for
                        something or steal your personal information.
                        <br />
                        <br />
                        Take a look at the word cloud. Can you spot the types of
                        scams that appear most often?
                    </p>
                </div>
            </section>

            <section className="min-h-screen max-w-full">
                <section
                    id="scam-category-section"
                    className="flex flex-col justify-around min-h-screen max-w-full"
                >
                    <div className="flex flex-col w-full justify-center items-center">
                        <TypographyH2 className="border-0">
                            Do you know what are the top 5 scams in number of
                            reports?
                        </TypographyH2>
                        <TypographyLead className="text-center">
                            Click inside each section to discover more.
                        </TypographyLead>
                        <section
                            id="year-filter-section"
                            className="flex items-center justify-between"
                        >
                            <p>Filter by year</p>
                            <select
                                id="year-dropdown"
                                className="dropdown"
                                defaultValue="2024"
                            >
                                <option value="all">All years</option>
                                <option value="2024">2024</option>
                            </select>
                        </section>
                    </div>
                    <div className="flex flex-col sm:flex-row w-full">
                        <div
                            id="scam-sunbrust-chart"
                            className={cn('chart', 'w-1/3')}
                        ></div>
                        <p className="text-left sm:w-2/3">
                            The sunburst chart shows the top 5 scams by the
                            number of reports, with each section showing their
                            percentage and sub-types.
                            <br />
                            <br />
                            <strong>Buying or Selling</strong> scams are the
                            most common, making up over 44% of the total and
                            over 427 reports within 2024.
                            <strong>Online Shopping Scams</strong> being the
                            largest sub-type at around 41% and having 1369
                            reports over the years.
                            <br />
                            <br />
                            Meanwhile, The smallest section,{' '}
                            <strong>Mobile Premium Service Scams,</strong> only
                            contributes about 1% which also among the{' '}
                            <strong>Buying or Selling</strong>.{' '}
                            <strong>Personal Information</strong> scams are the
                            second-largest, with 1643 reports all over the year.{' '}
                            <strong>Investment Scams</strong> in the same time
                            treated as the main sub-type.
                            <br />
                            <br />
                            This highlights how common online shopping scams and
                            personal data fraud are becoming.
                        </p>
                    </div>
                </section>
            </section>

            <section
                id="scam-reports-money-section"
                className="flex flex-col min-h-screen justify-around items-center max-w-full"
            >
                <div className="flex flex-col w-full justify-center items-center">
                    <TypographyH2 className="border-0">
                        Does the money lost follow a similar pattern as the
                        number of reports?
                    </TypographyH2>
                    <TypographyLead className="text-center">
                        {' '}
                        User Guide: Click on the bars to explore more detailed
                        information about money lost among the 5 scam types.
                    </TypographyLead>
                </div>
                <div className="flex flex-col sm:flex-row w-full">
                    <div
                        id="money-bar-chart"
                        className={cn('chart', 'w-1/2 ')}
                    ></div>
                    <p className="text-left sm:w-2/3">
                        While the top 5 most frequent scams align with the top 5
                        scams causing the most financial loss, their patterns
                        have some differences.
                        <br />
                        <br />
                        In 2024, the top 5 scams alone accounted for
                        approximately AUD 3,003,916 in losses, representing
                        about 94.74% of the total amount lost on social media
                        scams with young adults. Among these years, investment
                        scams have the highest financial impact, making up 50.4%
                        of the total losses, followed by dating and romance
                        scams, which account for around 17.4%.
                        <br />
                        <br />
                        The different patterns from the number of reports and
                        money loss indicate that no matter which type of scam
                        you are facing, the potential loss can accumulate into a
                        vast amount and continuously influence our daily lives.
                        <br />
                        <br />
                    </p>
                </div>
            </section>

            <div id="tooltip"></div>

            <section className="flex flex-col justify-center items-center w-full gap-y-8 py-6">
                <TypographyH1>
                    Explore More with Our Scam Simulation Game!
                </TypographyH1>
                <TypographyLead>
                    Dive deeper into the world of scams and test your knowledge
                    with our interactive game!
                    {/* Why Play? Sort and Analyze: */}
                    {/* <br />
                    Sort scenarios based on different scam categories and
                    amounts lost.
                    <br />
                    Test Your Skills: Challenge yourself to identify and
                    understand various scam types.
                    <br />
                    Learn & Protect: Gain valuable insights that can help you
                    recognize and avoid scams in real life. */}
                </TypographyLead>
                <Link href="/game" className="underline">
                    Play the Scam Simulation Game
                </Link>
            </section>
        </div>
    )
}

export default Insights
