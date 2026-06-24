import { Suspense } from "react";
import { AuthForm } from "@/components/app/auth-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Open your LeadSignal AI dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="h-40 animate-pulse rounded-md bg-muted" />}>
            <AuthForm mode="login" />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
