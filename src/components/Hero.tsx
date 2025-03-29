
'use client'
import { Button } from "@/components/ui/button";
import { ArrowRight, Github, Sparkles, GitBranch, Zap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const Hero = () => {

    const [displayedText, setDisplayedText] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const questions = [
        " What are the main dependencies in this project?",
        " Explain the authentication flow",
        " How does the caching system work?",
        " What changes were made in the last release?"
    ];


    useEffect(() => {
        setDisplayedText("");
        setIsTyping(true);

        let i = 0;
        const interval = setInterval(() => {
            if (i < (questions[currentQuestionIndex]?.length ?? 0)) {
                setDisplayedText((prev) => prev + (questions[currentQuestionIndex]?.[i] ?? ""));
                i++;
            } else {
                clearInterval(interval);
                setIsTyping(false);

                setTimeout(() => {
                    setCurrentQuestionIndex((prevIndex) => (prevIndex + 1) % questions.length);
                }, 2000);
            }
        }, 80);

        return () => clearInterval(interval);
    }, [currentQuestionIndex]);

    return (
        <section className="py-20 md:py-28 overflow-hidden relative px-16">
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-20 left-1/4 w-72 h-72 bg-vexon-purple/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-vexon-light-purple/20 rounded-full blur-[120px]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-vexon-purple/10 rounded-full blur-[80px]"></div>
            </div>

            <div className="container px-4 md:px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="flex flex-col space-y-8 text-left">
                        <div className="inline-flex items-center self-start space-x-2 bg-vexon-purple/10 px-3 py-1 rounded-full text-sm font-medium text-vexon-purple fade-in">
                            <Sparkles size={16} className="text-vexon-light-purple" />
                            <span>AI-Powered Repository Intelligence</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight md:leading-tight bg-gradient-to-br from-vexon-light-purple via-vexon-purple to-vexon-dark-purple bg-clip-text text-transparent max-w-xl fade-in-slow">
                            Understand Your Code in <span className="relative inline-block bg-gradient-to-br from-vexon-purple to-vexon-dark-purple bg-clip-text text-transparent">
                                Seconds
                                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M3 9C59.5 3.5 147.3 2.66667 291.5 3.5" stroke="#9b87f5" strokeWidth="5" strokeLinecap="round" />
                                </svg>
                            </span>
                        </h1>

                        <p className="text-lg md:text-xl text-foreground/70 max-w-lg animate-fade-in-delay">
                            Vexon AI analyzes your GitHub repositories, summarizes code changes, and answers any questions about your codebase using advanced AI.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-delay-2">
                            <Link href="/signup">
                                <Button className="bg-vexon-purple hover:bg-vexon-purple/90 text-white px-8 py-2 rounded-lg h-auto text-base font-semibold w-full sm:w-auto">
                                    Get Started Free
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                                <Button variant="outline" className="px-8 py-2 rounded-lg h-auto text-base border-vexon-purple/20 hover:bg-vexon-purple/5 w-full sm:w-auto">
                                    <Github className="mr-2 h-4 w-4" />
                                    Star on GitHub
                                </Button>
                            </a>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-foreground/60 pt-2">
                            <Zap size={14} className="text-vexon-light-purple" />
                            <span>No credit card required · 5 free repositories</span>
                        </div>
                    </div>

                    <div className="lg:pl-10 xl:pl-20">
                        <div className="relative">
                            <div className="absolute -top-6 -left-6 w-32 h-32 bg-gradient-to-br from-vexon-purple/30 to-vexon-light-purple/30 rounded-full blur-xl -z-10"></div>
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-vexon-purple/20 to-vexon-light-purple/20 rounded-full blur-xl -z-10"></div>

                            <div className="rounded-xl shadow-2xl overflow-hidden border border-white/20 backdrop-blur-sm bg-black/90">
                                <div className="flex items-center justify-between bg-vexon-dark-purple p-3 border-b border-white/10">
                                    <div className="flex items-center space-x-2">
                                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                        <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                    </div>
                                    <div className="text-xs text-white/70 flex items-center">
                                        <GitBranch size={12} className="mr-1" />
                                        vexon-ai/dashboard
                                    </div>
                                    <div></div>
                                </div>

                                <div className="p-6 text-left overflow-hidden">
                                    <div className="mb-6">
                                        <label className="text-sm text-vexon-light-purple font-medium mb-2 block">Repository URL</label>
                                        <div className="flex gap-2">
                                            <Input
                                                type="text"
                                                placeholder="https://github.com/username/repository"
                                                className="flex-grow bg-white/5 border-vexon-purple/20 focus-visible:ring-vexon-purple/30 text-white placeholder-gray-500 "
                                            />
                                            <Button className="bg-vexon-purple hover:bg-vexon-purple/90 text-white shrink-0">
                                                Analyze
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        {/* Repository insights */}
                                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                            <h3 className="text-vexon-light-purple text-sm font-semibold mb-3 flex items-center">
                                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M18 14V17C18 18.1046 17.1046 19 16 19H8C6.89543 19 6 18.1046 6 17V14M8 8L12 4M12 4L16 8M12 4V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Recent Activity
                                            </h3>
                                            <div className="space-y-2 text-sm">
                                                <div className="flex items-start">
                                                    <div className="h-5 w-5 rounded-full bg-vexon-purple/20 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                                                        <span className="text-xs text-vexon-light-purple">+</span>
                                                    </div>
                                                    <p className="text-white/90">New authentication system with JWT tokens</p>
                                                </div>
                                                <div className="flex items-start">
                                                    <div className="h-5 w-5 rounded-full bg-vexon-purple/20 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                                                        <span className="text-xs text-vexon-light-purple">✓</span>
                                                    </div>
                                                    <p className="text-white/90">Fixed pagination bug in repository view</p>
                                                </div>
                                                <div className="flex items-start">
                                                    <div className="h-5 w-5 rounded-full bg-vexon-purple/20 flex items-center justify-center mt-0.5 mr-2 flex-shrink-0">
                                                        <span className="text-xs text-vexon-light-purple">↑</span>
                                                    </div>
                                                    <p className="text-white/90">API response time optimized by 43%</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* AI Q&A */}
                                        <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                                            <h3 className="text-vexon-light-purple text-sm font-semibold mb-3 flex items-center">
                                                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M8 12H8.01M12 12H12.01M16 12H16.01M21 12C21 16.4183 16.9706 20 12 20C10.4607 20 9.01172 19.6565 7.74467 19.0511L3 20L4.39499 16.28C3.51156 15.0423 3 13.5743 3 12C3 7.58172 7.02944 4 12 4C16.9706 4 21 7.58172 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                                Ask About Your Repository
                                            </h3>
                                            <div className="bg-black/30 p-3 rounded text-white/90 text-sm">
                                                <p className="font-mono flex items-center">
                                                    <span className="text-vexon-purple mr-2">&gt;</span>
                                                    {isTyping ? (
                                                        <span className="inline-flex items-center">
                                                            {displayedText}
                                                            <span className="ml-1 h-4 w-2 bg-vexon-purple animate-pulse"></span>
                                                        </span>
                                                    ) : (
                                                        displayedText
                                                    )}
                                                </p>
                                                <div className="mt-3 font-mono text-vexon-light-purple border-l-2 border-vexon-light-purple pl-3">
                                                    <p className="text-sm leading-relaxed">
                                                        The main dependencies for this project are React, TypeScript,
                                                        TailwindCSS, Tanstack Query, and Supabase for backend services.
                                                        The project also uses Vitest for testing.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating badges */}
                            <motion.div
                                className="absolute -right-4 -top-4 bg-white/5 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs text-white/90 shadow-xl flex items-center"
                                animate={{ y: [0, -3, 0] }} // Small floating motion
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} // Slower and smoother
                            >
                                <svg
                                    className="mr-1 h-3 w-3 text-green-700"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M5 13L9 17L19 7"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                Smart Insights
                            </motion.div>
                            <motion.div
                                className="absolute -left-2 -bottom-2 bg-white/5 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-xs text-white/90 shadow-xl flex items-center"
                                animate={{ y: [0, -3, 0] }} // Small floating motion
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} // Slow and smooth animation
                            >
                                <svg
                                    className="mr-1 h-3 w-3 text-vexon-dark-purple"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M9.13478 20.7733L10.1348 20.7733C10.6871 20.7733 11.1348 20.3256 11.1348 19.7733L11.1348 11.7733L14.7348 11.7733C15.5122 11.7733 15.9168 10.8745 15.4158 10.2911L8.81577 2.69108C8.37905 2.18427 7.58809 2.18427 7.15137 2.69109L0.55137 10.2911C0.0503826 10.8745 0.455021 11.7733 1.23242 11.7733L4.83242 11.7733L4.83242 19.7733C4.83242 20.3256 5.28014 20.7733 5.83242 20.7733L6.83242 20.7733"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    />
                                </svg>
                                43% Faster
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;