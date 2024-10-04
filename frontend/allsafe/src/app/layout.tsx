import { Inter } from 'next/font/google'
import './globals.css'
import './style.css'
import NavBar from '@/components/navbar/NavBar'
import Top from '@/components/helper/top'
import { cn } from '@/libs/utils'
import FooterWrapper from '@/components/footer/footer-wrapper'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script'

import ScrollDown from '@/components/helper/scroll-down'

const inter = Inter({ subsets: ['latin'] })

// export const metadata: Metadata = {
//     title: 'Create Next App',
//     description: 'Generated by create next app',
// }

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <head>
                <meta
                    http-equiv="Content-Security-Policy"
                    content="upgrade-insecure-requests"
                />
                <meta name="viewport" content="user-scalable=yes" />
                <Script src="https://d3js.org/d3.v7.min.js"></Script>
                <Script src="https://unpkg.com/d3fc"></Script>
            </head>
            <body
                className={cn(
                    inter.className,
                    'flex flex-col justify-between min-h-screen w-full overflow-y-auto snap-y snap-mandatory'
                )}
            >
                <NavBar />
                <main className="flex flex-col justify-center items-center min-h-screen">
                    {children}
                    <SpeedInsights />
                    <Analytics />
                </main>
                <FooterWrapper />
                <ScrollDown />
                <Top />
            </body>
        </html>
    )
}
