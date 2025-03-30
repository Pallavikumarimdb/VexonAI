'use client'
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import Link from "next/link";

export default function SignUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()
  const { toast } = useToast();;

  interface ErrorResponse {
    message: string;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!firstName || !lastName || !emailAddress || !password) {
      toast({
        title: "Invalid input",
        description: "Please fill in all fields.",
      });
      return;
    }
  
    if (!agreedToTerms) {
      toast({
        title: "Terms agreement required",
        description: "Please agree to the terms and conditions.",
      });
      return;
    }
  
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, emailAddress, password }),
      });
  
      if (res.ok) {
        router.push("/signin");
      } else {
        const error: ErrorResponse = await res.json(); 
        toast({ title: "Signup failed", description: error.message });
      }
    } catch (err) {
      toast({ title: "Network Error", description: "Please try again later." });
    }
  };


  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col space-y-2 text-center mb-8">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-foreground/60 text-sm">
          Enter your information to get started with Vexon AI
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">First Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="h-11"
            />
            <Label htmlFor="name">Last Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={emailAddress}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-11 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/60 hover:text-foreground transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-foreground/60 mt-1">
              Password must be at least 8 characters.
            </p>
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox 
              id="terms" 
              checked={agreedToTerms}
              onCheckedChange={(checked) => {
                setAgreedToTerms(checked as boolean);
              }}
              className="mt-1"
            />
            <label
              htmlFor="terms"
              className="text-sm text-foreground/80"
            >
              By creating an account, you agree to our{" "}
              <Link href="/terms" className="text-vexon-purple hover:text-vexon-purple/80 transition-colors">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-vexon-purple hover:text-vexon-purple/80 transition-colors">
                Privacy Policy
              </Link>
              .
            </label>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-11 bg-vexon-purple hover:bg-vexon-purple/90"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating your account...
            </>
          ) : (
            "Sign Up"
          )}
        </Button>

        <p className="text-center text-sm text-foreground/70">
          Already have an account?{" "}
          <Link href="/signin" className="text-vexon-purple hover:text-vexon-purple/80 font-medium">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};
