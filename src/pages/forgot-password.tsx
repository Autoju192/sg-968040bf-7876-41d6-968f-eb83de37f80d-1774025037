import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Zap, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { SEO } from "@/components/SEO";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setSuccess(true);
    } catch (err: any) {
      console.error("Error sending reset email:", err);
      setError(err.message || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SEO title="Forgot Password - TenderFlow AI" description="Reset your password" />
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Zap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-heading font-bold text-2xl">TenderFlow AI</span>
          </div>

          <Card className="shadow-medium border-border/50">
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-2xl">Forgot Password?</CardTitle>
              <CardDescription>
                Enter your email and we&apos;ll send you a link to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="space-y-4">
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Password reset email sent! Check your inbox for instructions.
                    </AlertDescription>
                  </Alert>

                  <div className="text-center space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Didn&apos;t receive the email? Check your spam folder or try again.
                    </p>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => setSuccess(false)}
                    >
                      Try Another Email
                    </Button>
                    <Link href="/login">
                      <Button variant="ghost" className="w-full">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Login
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </Button>

                  <Link href="/login">
                    <Button variant="ghost" className="w-full" type="button">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Login
                    </Button>
                  </Link>
                </form>
              )}
            </CardContent>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Remember your password?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}