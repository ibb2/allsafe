import { gameData } from '@/data/gameData'
import React, { useState, useRef, useEffect } from 'react'
import { Button } from '../ui/button'
import { Card, CardHeader, CardDescription, CardContent } from '../ui/card'
import gifImg from '@/components/assets/Isometric Bar Snowing.gif'
import Image from 'next/image'
import Link from 'next/link'

const BranchingNarrativeComponent = ({
    scenarios,
    scenario,
}: {
    scenarios: any
    scenario: number
}) => {
    const [gameBegan, setGameBegan] = useState(false)
    const [currentQuestion, setCurrentQuestion] = useState('q0')
    const [navAnswer, setNavAnswer] = useState(false)
    const choice = gameData[scenario - 1]

    const handleAnswerClick = (link: React.SetStateAction<string>) => {
        if (choice[currentQuestion as keyof typeof choice]) {
            setCurrentQuestion(link)
            setNavAnswer(false)
            setGameBegan(true)
        } else {
            console.error(`Question with link "${link}" not found in gameData.`)
        }
    }

    const currentQuestionData = choice[currentQuestion as keyof typeof choice]

    if (!currentQuestionData && gameBegan) {
        return (
            <div className="flex flex-col justify-center items-center w-full">
                <p>Game over</p>
                <p>Play again?</p>
                <div className="flex">
                    <Link href="/game" passHref>
                        <Button
                            className="m-6 self-end"
                            variant="ghost"
                            onClick={() => setNavAnswer(true)}
                        >
                            Yes
                        </Button>
                    </Link>
                    <Link href="/app" passHref>
                        <Button
                            className="m-6 self-end"
                            variant="ghost"
                            onClick={() => setNavAnswer(true)}
                        >
                            No
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    if (!currentQuestionData) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex flex-col justify-end items-end gap-y-6 w-full">
            <Image
                src="/background/Retro Gaming Pixel 8.gif"
                alt={'background gif'}
                layout="fill"
                objectFit="cover"
                priority={true} // Ensures the GIF is prioritized for loading
                className="absolute top-0 left-0 w-full h-full z-0" // Positions the GIF correctly as a background
            />

            {/* Character portrait positioned outside the Card */}
            {/*<div
                className="relative z-20"
                style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'flex-end',
                }}
            >
                <Image
                    src="/character/Bridget_normal.png" // Ensure this path is correct
                    alt="Character Portrait"
                    width={400}
                    height={400}
                    priority={true}
                    style={{ marginBottom: '-24px' }} // Positioned on the left-hand side of the text box
                />
            </div>*/}

            <Card className="flex flex-col h-50 overflow-y-scroll w-full justify-between z-10 relative">
                <CardHeader>
                    <CardDescription>{scenarios[scenario]}</CardDescription>
                </CardHeader>

                {/* Question/Answer Section */}
                <CardContent className="flex flex-col items-center gap-4">
                    <div className="flex flex-col w-full text-center">
                        {!navAnswer && <h2>{currentQuestionData.question}</h2>}
                        {navAnswer && (
                            <div className="flex flex-col gap-y-4 w-full">
                                {currentQuestionData.answers.map(
                                    (
                                        answer: {
                                            link: any
                                            text:
                                                | string
                                                | number
                                                | bigint
                                                | boolean
                                                | React.ReactElement<
                                                      any,
                                                      | string
                                                      | React.JSXElementConstructor<any>
                                                  >
                                                | Iterable<React.ReactNode>
                                                | React.ReactPortal
                                                | Promise<React.AwaitedReactNode>
                                                | null
                                                | undefined
                                        },
                                        index: React.Key | null | undefined
                                    ) => (
                                        <Button
                                            variant="secondary"
                                            key={index}
                                            onClick={() =>
                                                handleAnswerClick(answer.link)
                                            }
                                        >
                                            {answer.text}
                                        </Button>
                                    )
                                )}
                                {/* Pixelated Textbox */}
                                <textarea className="pixel-textbox"></textarea>
                            </div>
                        )}
                    </div>
                </CardContent>

                {!navAnswer && (
                    <Button
                        className="m-6 self-end"
                        variant="ghost"
                        onClick={() => setNavAnswer(true)}
                    >
                        Continue
                    </Button>
                )}
            </Card>
        </div>
    )
}

export default BranchingNarrativeComponent
