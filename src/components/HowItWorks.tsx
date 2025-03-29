
'use client'
import { useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, GitCommit, MessageSquare, Search, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    id: 1,
    title: "Connect Your Repository",
    description: "Link your GitHub repository to Vexon AI in seconds with OAuth or manual integration.",
    icon: <GitBranch className="h-6 w-6" />,
    code: `// Repository integration
await vexon.connect({
  provider: "github",
  repoUrl: "https://github.com/username/project"
});

✓ Connection established
✓ Repository structure detected
✓ Starting initial scan...`,
    preview: "/workflow-1.png",
  },
  {
    id: 2,
    title: "Analyze Code History",
    description: "Our AI engine processes your commits, branches, and pull requests to build a knowledge graph.",
    icon: <GitCommit className="h-6 w-6" />,
    code: `// Deep repository analysis
const analysis = await vexon.analyze({
  depth: "complete",
  includeBranches: ["main", "develop"],
  excludePaths: ["node_modules/**"]
});

✓ 427 commits processed across 8 branches
✓ 186 pull requests analyzed
✓ Language composition detected:
  - TypeScript: 68%
  - Python: 22%
  - Shell: 10%`,
    preview: "/workflow-2.png",
  },
  {
    id: 3,
    title: "Ask Anything",
    description: "Query your repository with natural language and get detailed, context-aware answers.",
    icon: <MessageSquare className="h-6 w-6" />,
    code: `// Natural language querying
const answer = await vexon.query({
  question: "How did we implement authentication?",
  timeRange: "last 3 months",
  includeCode: true
});

> Authentication system implemented through:
> 1. JWT tokens for API authentication
> 2. OAuth providers (GitHub, Google)
> 3. Role-based access control model
>
> Relevant files:
> - src/auth/AuthProvider.tsx
> - api/middleware/auth.ts
> - models/User.ts`,
    preview: "/workflow-3.png",
  },
  {
    id: 4,
    title: "Gain Actionable Insights",
    description: "Receive automatic alerts, analytics, and suggestions to improve your codebase.",
    icon: <Search className="h-6 w-6" />,
    code: `// Automatic insights generation
const insights = await vexon.insights.generate({
  type: "weekly",
  focusAreas: ["performance", "security"]
});

✓ Weekly insights report created
✓ Detected 3 potential security issues
✓ Performance bottleneck identified:
  - API response time increased by 42% in 
    /api/users/search endpoint
✓ Code duplication found in:
  - utils/formatting.ts
  - helpers/strings.ts`,
    preview: "/workflow-4.png",
  },
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(1);

  return (
    <section className="py-20 md:py-32 bg-vexon-dark-purple/5 mt-10 mx-16 rounded-xl relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-64 bg-gradient-to-r from-vexon-purple/10 via-vexon-light-purple/20 to-vexon-purple/10 rounded-full blur-3xl"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-vexon-purple/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-vexon-light-purple/10 rounded-full blur-3xl"></div>
      
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
            Effortless Integration
          </motion.p>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold tracking-tight hero-gradient"
          >
            How Vexon AI Works
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg md:text-xl text-foreground/70 max-w-2xl"
          >
            Start understanding your codebase in minutes with a simple, powerful workflow
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center max-w-7xl mx-auto">
          <div className="md:col-span-5 space-y-6">
            {steps.map((step) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: step.id * 0.1 }}
                viewport={{ once: true }}
                className={cn(
                  "flex cursor-pointer p-4 rounded-xl transition-all duration-300 border",
                  activeStep === step.id
                    ? "bg-white/10 dark:bg-vexon-dark-purple/20 border-vexon-purple/30 shadow-lg shadow-vexon-purple/5"
                    : "hover:bg-white/5 dark:hover:bg-vexon-dark-purple/10 border-transparent"
                )}
                onClick={() => setActiveStep(step.id)}
              >
                <div
                  className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center shrink-0 mr-4 transition-all duration-300",
                    activeStep === step.id
                      ? "bg-vexon-purple text-white"
                      : "bg-secondary/80 text-vexon-purple"
                  )}
                >
                  {step.icon}
                </div>
                <div className="text-left">
                  <h3 className={cn(
                    "font-bold text-lg transition-colors duration-300",
                    activeStep === step.id ? "text-vexon-purple" : ""
                  )}>
                    {step.title}
                  </h3>
                  <p className="text-foreground/70 text-sm mt-1">{step.description}</p>
                </div>
                {activeStep === step.id && (
                  <div className="ml-auto flex items-center text-vexon-purple">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            key={activeStep}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="md:col-span-7 p-5 rounded-2xl overflow-hidden relative shadow-2xl bg-vexon-dark-purple/90 shadow-vexon-purple/10"
          >
            <div className="flex items-center justify-between bg-vexon-dark-purple/90 p-3 rounded-t-xl border-b border-white/10">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded-full bg-red-500"></div>
                <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
              <div className="text-xs text-white/70">vexon-ai</div>
              <div></div>
            </div>
            

            <div className="p-6 font-mono text-sm bg-vexon-dark-purple/90 rounded-b-xl overflow-auto max-h-[400px] h-full">
              {steps.find(step => step.id === activeStep)?.code.split('\n').map((line, idx) => (
                line.startsWith('>') ? (
                  <p key={idx} className="text-vexon-light-purple my-1">{line}</p>
                ) : line.startsWith('✓') ? (
                  <p key={idx} className="text-green-400 my-1">{line}</p>
                ) : line.startsWith('const') || line.startsWith('await') || line.startsWith('//') ? (
                  <p key={idx} className="text-blue-400 my-1">{line}</p>
                ) : (
                  <p key={idx} className="text-white/90 my-1">{line}</p>
                )
              ))}
              
              <div className="h-4 w-2 bg-white/70 inline-block animate-pulse"></div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;