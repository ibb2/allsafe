'use client'

import Image from 'next/image'
import Footer from '@/components/footer/footer-four'
import ScamMenu from '@/components/assets/ScamMenu'
import Link from 'next/link'
import Header from '@/components/hero/header-two'
import buySell from '@/components/assets/scam-photo/buy-sell.webp'
import personalInfo from '@/components/assets/scam-photo/personal-info.webp'
import investment from '@/components/assets/scam-photo/investment.webp'
import employment from '@/components/assets/scam-photo/employment.webp'
import dating from '@/components/assets/scam-photo/dating.webp'
import NavBar from '@/components/navbar/NavBar'
import { Button } from '@/components/ui/button'

export default function ScamInfo() {
    return (
        <div className="flex flex-col gap-32">
            <div>
                <Header
                    title="Scams"
                    subtitle="A collection of the top 5 most common scam types."
                    textClassName="p-0"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                    <div className="row-span-1 max-w-lg">
                        <ScamMenu
                            imageSrc={buySell}
                            altText="Placeholder Image"
                            heading="Buying or Selling"
                            description="This happens when having transactions, either you are a buyer or a seller, via social media to a website, marketplace, or just pretending to be a business with a fake invoice."
                            link="/scams/buying-or-selling"
                        />
                    </div>

                    <div className="row-span-1 max-w-lg">
                        <ScamMenu
                            imageSrc={personalInfo}
                            altText="Placeholder Image"
                            heading="Gain Personal Information"
                            description="Scammers will attempt to get your personal details and bank account or try to hack or phishing you. Your personal information may be used in various situations, which may ultimately lead to your money loss."
                            link="/scams/gain-personal-information"
                        />
                    </div>

                    <div className="row-span-1 max-w-lg">
                        <ScamMenu
                            imageSrc={investment}
                            altText="Placeholder Image"
                            heading="Investment"
                            description="Scammers usually build up trust with you by chatting unrelated to investment from the beginning. They often offer the opportunity with high returns within a short period."
                            link="/scams/investment"
                        />
                    </div>

                    <div className="row-span-1 max-w-lg">
                        <ScamMenu
                            imageSrc={employment}
                            altText="Placeholder Image"
                            heading="Jobs and Employment"
                            description="It can be related to gaining personal information or money. Scammers offer jobs with high salaries with low effort or unrealistic hourly rates; it sometimes also requires you to pay first to earn the money."
                            link="/scams/job-and-employment-opportunities"
                        />
                    </div>

                    <div className="row-span-1 max-w-lg">
                        <ScamMenu
                            imageSrc={dating}
                            altText="Placeholder Image"
                            heading="Dating and Romance"
                            description="Scammers usually build up trust with you through dating, romance or friend relationships. After building up the trust, they will use the emotional connection with you to trick you for money."
                            link="/scams/dating-and-romance"
                        />
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-center gap-1 text-center mb-16">
                <Header
                    title="Let's test what you have learn!"
                    subtitle="Test Your Ability to Identify Online Scams and Stay Safe in the Digital World"
                />
                <Link href="/quiz" passHref>
                    <Button className="mt-4 pr-4">Go to quiz {'->'}</Button>
                </Link>
            </div>
        </div>
    )
}
