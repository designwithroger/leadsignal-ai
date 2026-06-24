import { Suspense } from "react";
import { AuthForm } from "@/components/app/auth-form";
import { LanguageSelector } from "@/components/app/language-selector";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dictionary, getLanguage } from "@/lib/i18n";

export default async function SignupPage() {
  const language = await getLanguage();
  const copy = dictionary[language];

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="mb-2 flex justify-end">
            <LanguageSelector language={language} copy={copy.common} />
          </div>
          <CardTitle>{copy.auth.signupTitle}</CardTitle>
          <CardDescription>{copy.auth.signupDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="h-40 animate-pulse rounded-md bg-muted" />}>
            <AuthForm mode="signup" copy={copy.auth} commonCopy={copy.common} />
          </Suspense>
        </CardContent>
      </Card>
    </main>
  );
}
