
'use client'
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Users } from "lucide-react";
import Link from "next/link";

const CTA = () => {
  return (
    <section className="py-20 md:py-32 rounded-xl mx-16 my-10 relative overflow-hidden">

      <div className="container px-4 md:px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight hero-gradient mb-6">
                Ready to unlock your repository&apos;s full potential?
              </h2>
              
              <p className="text-xl text-foreground/70 mb-8 leading-relaxed">
                Join thousands of engineering teams who use Vexon AI to enhance collaboration, accelerate onboarding, and make better technical decisions.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-vexon-purple/10 flex items-center justify-center mt-0.5 mr-3">
                    <Zap className="h-3.5 w-3.5 text-vexon-purple" />
                  </div>
                  <p className="text-foreground/80">
                    <span className="font-medium">Free plan</span> includes 5 repository analyses per month
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-vexon-purple/10 flex items-center justify-center mt-0.5 mr-3">
                    <Shield className="h-3.5 w-3.5 text-vexon-purple" />
                  </div>
                  <p className="text-foreground/80">
                    <span className="font-medium">Enterprise-grade security</span> with private repository support
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-vexon-purple/10 flex items-center justify-center mt-0.5 mr-3">
                    <Users className="h-3.5 w-3.5 text-vexon-purple" />
                  </div>
                  <p className="text-foreground/80">
                    <span className="font-medium">Team collaboration features</span> included on all plans
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link href="/signup">
                  <Button className="w-full sm:w-auto bg-vexon-purple hover:bg-vexon-purple/90 text-white px-8 py-2 rounded-xl h-auto text-base font-medium group">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                
                <Link href="/docs">
                  <Button variant="outline" className="w-full sm:w-auto border-vexon-purple/30 text-vexon-purple hover:bg-vexon-purple/5 px-8 py-2 rounded-xl h-auto text-base">
                    View Documentation
                  </Button>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-white/20 dark:bg-vexon-darkPurple/20 backdrop-blur-sm border border-vexon-purple/20 rounded-2xl p-8 shadow-xl shadow-vexon-purple/5 relative z-20">
                <h3 className="text-2xl font-bold mb-6 text-center text-vexon-purple/90">Real Results, Real Teams</h3>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="text-center p-4 bg-white/50 dark:bg-vexon-darkPurple/10 rounded-xl">
                    <div className="text-4xl font-bold text-vexon-purple">78%</div>
                    <p className="text-foreground/70 text-sm">Faster Onboarding</p>
                  </div>
                  
                  <div className="text-center p-4 bg-white/50 dark:bg-vexon-darkPurple/10 rounded-xl">
                    <div className="text-4xl font-bold text-vexon-purple">63%</div>
                    <p className="text-foreground/70 text-sm">Fewer Technical Debates</p>
                  </div>
                  
                  <div className="text-center p-4 bg-white/50 dark:bg-vexon-darkPurple/10 rounded-xl">
                    <div className="text-4xl font-bold text-vexon-purple">12h</div>
                    <p className="text-foreground/70 text-sm">Weekly Time Saved</p>
                  </div>
                  
                  <div className="text-center p-4 bg-white/50 dark:bg-vexon-darkPurple/10 rounded-xl">
                    <div className="text-4xl font-bold text-vexon-purple">92%</div>
                    <p className="text-foreground/70 text-sm">Team Satisfaction</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-vexon-purple/10 text-vexon-purple text-sm font-medium mb-2">
                    Join 500+ companies already using Vexon AI
                  </div>
                  <p className="text-foreground/60 text-sm">
                    Trusted by individuals, startups, and enterprises
                  </p>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 h-32 w-32 bg-vexon-purple/30 rounded-full blur-2xl z-0"></div>
              <div className="absolute -bottom-8 -left-8 h-40 w-40 bg-vexon-lightPurple/20 rounded-full blur-2xl z-0"></div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;