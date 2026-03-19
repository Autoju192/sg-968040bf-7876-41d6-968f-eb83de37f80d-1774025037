import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "@/services/authService";
import { SEO } from "@/components/SEO";
import { AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    organisationName: "",
    role: "bid_manager" as "admin" | "bid_manager" | "contributor",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (!formData.email || !formData.password || !formData.fullName) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.organisationName) {
      setError("Please enter your organization name");
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.signUp(
        formData.email,
        formData.password,
        formData.fullName,
        formData.organisationName,
        formData.role
      );

      if (result.error) {
        // Handle specific Supabase errors
        if (result.error.message.includes("rate limit") || result.error.message.includes("40 seconds")) {
          setError("Too many signup attempts. Please wait 40 seconds and try again.");
        } else if (result.error.message.includes("already registered")) {
          setError("This email is already registered. Please use a different email or try logging in.");
        } else if (result.error.message.includes("Invalid email")) {
          setError("Please enter a valid email address.");
        } else {
          setError(result.error.message || "Failed to create account. Please try again.");
        }
        setIsLoading(false);
        return;
      }

      // Success
      setSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/login?signup=success");
      }, 2000);

    } catch (err) {
      console.error("Signup error:", err);
      setError("An unexpected error occurred. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO 
        title="Sign Up - TenderFlow AI"
        description="Create your account and start managing tenders with AI-powered insights"
      />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
        <div className="w-full max-w-md">
          <Card className="border-slate-200 dark:border-slate-800 shadow-xl">
            <CardHeader className="space-y-1">
              <div className="flex items-center justify-center mb-4">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  TF
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-center">Create your account</CardTitle>
              <CardDescription className="text-center">
                Join TenderFlow AI and start winning more tenders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {success && (
                <Alert className="mb-4 border-green-500 bg-green-50 dark:bg-green-950">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-600 dark:text-green-400">
                    Account created successfully! Redirecting to login...
                  </AlertDescription>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="John Smith"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    disabled={isLoading || success}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={isLoading || success}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organisationName">Organization Name *</Label>
                  <Input
                    id="organisationName"
                    placeholder="Your Care Company Ltd"
                    value={formData.organisationName}
                    onChange={(e) => setFormData({ ...formData, organisationName: e.target.value })}
                    disabled={isLoading || success}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Your Role *</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: "admin" | "bid_manager" | "contributor") =>
                      setFormData({ ...formData, role: value })
                    }
                    disabled={isLoading || success}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="bid_manager">Bid Manager</SelectItem>
                      <SelectItem value="contributor">Contributor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    disabled={isLoading || success}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Re-enter your password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    disabled={isLoading || success}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800" 
                  disabled={isLoading || success}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Account created!
                    </>
                  ) : (
                    "Sign Up"
                  )}
                </Button>

                <div className="text-center text-sm text-slate-600 dark:text-slate-400">
                  Already have an account?{" "}
                  <Link href="/login" className="text-purple-600 hover:text-purple-700 font-semibold">
                    Sign in
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
    </>
  );
}