
import Link from "next/link";
import SignUp from "./signup";

const SignupPage = () => {
  return (
    <div className="min-h-screen flex">
      {/* Left panel with form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center space-x-2 mb-10">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-vexon-lightPurple to-vexon-purple flex items-center justify-center">
              <span className="text-white font-bold">V</span>
            </div>
            <span className="font-bold text-xl">Vexon AI</span>
          </Link>
          
          <SignUp />
        </div>
      </div>
      
      {/* Right panel with background - visible on lg and above */}
      <div className="hidden lg:block lg:w-1/2 relative bg-vexon-purple">
        <div className="absolute inset-0 bg-gradient-to-br from-vexon-purple via-vexon-purple to-vexon-darkPurple opacity-90"></div>
        
        <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold mb-4">Join the Vexon AI Community</h2>
            <p className="text-white/80 mb-6">
              Join thousands of developers who have transformed how they understand and navigate their code repositories.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-white/90 font-medium mb-2">Quick Repository Summaries</div>
                <p className="text-white/70 text-sm">Get instant insights about what's happening in your codebase.</p>
              </div>
              
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-white/90 font-medium mb-2">AI-Powered Q&A</div>
                <p className="text-white/70 text-sm">Ask questions about your code and get immediate answers.</p>
              </div>
              
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-white/90 font-medium mb-2">Knowledge Repository</div>
                <p className="text-white/70 text-sm">Build a searchable knowledge base from your git history.</p>
              </div>
              
              <div className="bg-white/10 p-4 rounded-lg">
                <div className="text-white/90 font-medium mb-2">Team Collaboration</div>
                <p className="text-white/70 text-sm">Share insights and improve communication across teams.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;