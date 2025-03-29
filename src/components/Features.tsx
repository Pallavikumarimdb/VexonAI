
'use client'
import { Check, GitBranch, GitCommit, Book, Clock, Search, Brain, MessageSquare, BrainCircuit } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const FeatureCard = ({
  index,
  icon,
  title,
  description,
  benefits
}: {
  index: number;
  icon: React.ReactNode;
  title: string;
  description: string;
  benefits: string[];
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={cn(
        "relative overflow-hidden bg-vexon-dark-purple/50 dark:bg-vexon-dark-purple/10 backdrop-blur-lg",
        "border border-vexon-purple dark:border-vexon-purple/10",
        "rounded-2xl p-6 group hover:border-vexon-purple/30 transition-all duration-300",
        "hover:shadow-[0_0_30px_0px_rgba(155,135,245,0.15)]"
      )}
    >
      <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-vexon-purple/5 blur-3xl group-hover:bg-vexon-purple/10 transition-all duration-700"></div>

      <div className="h-12 w-12 rounded-xl bg-vexon-dark-purple flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>

      <h3 className="text-xl font-bold mb-3 text-white/80 transition-colors duration-300">{title}</h3>

      <p className="text-slate-300 mb-5">{description}</p>

      <div className="space-y-3">
        {benefits.map((benefit, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 + 0.2 }}
            viewport={{ once: true }}
            className="flex items-start"
          >
            <Check className="h-5 w-5 text-green-500 shrink-0 mr-2 mt-0.5" />
            <span className="text-sm text-slate-400">{benefit}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

const Features = () => {
  const features = [
    {
      icon: <GitCommit className="h-6 w-6 text-white" />,
      title: "Smart Commit Analysis",
      description: "Get AI-generated summaries that extract the key insights from your commit history.",
      benefits: [
        "Understand complex changes at a glance",
        "Track development progress visually",
        "Identify critical updates easily"
      ]
    },
    {
      icon: <BrainCircuit className="h-6 w-6 text-white" />,
      title: "Repository Intelligence",
      description: "Ask questions about your codebase in plain English and get accurate, contextual answers.",
      benefits: [
        "Natural language understanding of your code",
        "Contextual answers from your entire repository",
        "Reduce documentation search time by 85%"
      ]
    },
    {
      icon: <Book className="h-6 w-6 text-white" />,
      title: "Knowledge Repository",
      description: "Build an evolving knowledge base that grows smarter with every commit and question.",
      benefits: [
        "Automatically indexed repository memory",
        "Search across all historical data",
        "Self-improving understanding of your code"
      ]
    },
    {
      icon: <Clock className="h-6 w-6 text-white" />,
      title: "Developer Time Savings",
      description: "Eliminate hours spent reading through PRs, commit logs, and outdated documentation.",
      benefits: [
        "Cut onboarding time by up to 73%",
        "Save 8+ hours per week for each developer",
        "Reduce context switching disruptions"
      ]
    },
  ];

  return (
    <section className="rounded-xl mx-16 relative py-10 md:py-10 overflow-hidden">
      <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-t from-vexon-dark-purple/90 via-vexon-purple/70 to-vexon-light-purple/30 pointer-events-none"></div>
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-vexon-purple/20 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-vexon-purple/10 rounded-full blur-3xl"></div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-4 mb-12 md:mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-sm bg-white/5 backdrop-blur-md border border-vexon-purple px-3 py-1 rounded-full text-vexon-purple font-semibold tracking-wider uppercase flex items-center space-x-2"
          >
            <span className="h-3 w-3 mr-2 bg-vexon-purple rounded-full border border-vexon-light-purple shadow-[0_0_8px_rgba(100,50,180,1)] inline-block"></span>
            Powerful AI Features
          </motion.p>


          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight hero-gradient max-w-4xl"
          >
            Understand your codebase like never before
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-foreground/70 max-w-2xl"
          >
            Vexon AI transforms complex repositories into accessible knowledge, saving your team countless hours and accelerating development.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              index={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              benefits={feature.benefits}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;