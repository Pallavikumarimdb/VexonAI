
'use client'
import { Github, Twitter, Linkedin, Mail } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-white/20 rounded-xl lg:mx-16 py-12 md:py-16 border border-vexon-purple/30">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-vexon-lightPurple to-vexon-purple flex items-center justify-center">
                <span className="text-white font-bold">V</span>
              </div>
              <span className="font-bold text-xl">Vexon AI</span>
            </Link>
            <p className="text-foreground/70 text-sm">
              Understand your code repository in seconds with AI-powered summaries and intelligent Q&A.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-foreground/60 hover:text-foreground transition-colors">
                <Github size={20} />
              </a>
              <a href="#" className="text-foreground/60 hover:text-foreground transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-foreground/60 hover:text-foreground transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="text-foreground/60 hover:text-foreground transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/features" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                  Integrations
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                  Changelog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                  Roadmap
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/docs" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                  API Reference
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                  Tutorials
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="#" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-foreground/70 hover:text-foreground transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/30 text-center text-sm text-foreground/60">
          <p>© {new Date().getFullYear()} Vexon AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;