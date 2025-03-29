
import Link from "next/link";
import SignIn from "./signin";

const SignInPage = () => {
  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center space-x-2 mb-10">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-vexon-lightPurple to-vexon-purple flex items-center justify-center">
              <span className="text-white font-bold">V</span>
            </div>
            <span className="font-bold text-xl">Vexon AI</span>
          </Link>
          
          <SignIn />
        </div>
      </div>
    
      <div className="hidden lg:block lg:w-1/2 relative bg-[#1A1F2C]">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#1A1F2C] to-black/0 opacity-90"></div>
        
        <div className="absolute inset-0 flex flex-col justify-center px-12 text-white">
          <div className="max-w-md">
            <h2 className="text-3xl font-bold mb-4">Analyze Your GitHub Repository With AI</h2>
            <p className="text-white/80 mb-8">
              Understand code changes, get insights, and answer questions about your repository instantly with Vexon AI.
            </p>
            
            <div className="code-block rounded-lg text-sm">
              <div className="p-4">
                <p className="text-[#9b87f5] mb-2"># Ask Vexon about your repo</p>
                <p className="text-white/80">$ vexon ask "What changes were made last week?"</p>
                <p className="text-white/90 mt-2 pl-4 border-l-2 border-[#9b87f5]">
                  7 commits were made last week that improved API performance by 35% and fixed 3 critical bugs in the authentication system.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;