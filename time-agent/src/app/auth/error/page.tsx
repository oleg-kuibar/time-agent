"use client";

import { useSearchParams } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { AlertTriangle, ShieldAlert, HelpCircle } from "lucide-react";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errorMessages: Record<string, string> = {
    default: "An error occurred during authentication.",
    configuration: "There is a problem with the server configuration. Please check your database connection and environment variables.",
    accessdenied: "You do not have permission to sign in.",
    verification: "The verification link may have expired or already been used.",
    oauthsignin: "Error in the OAuth sign-in process. Please try again.",
    oauthcallback: "Error in the OAuth callback process. This could be due to incorrect client ID or secret.",
    oauthcreateaccount: "Could not create an OAuth provider account. The database might be unavailable.",
    emailcreateaccount: "Could not create an email provider account. The database might be unavailable.",
    callback: "Error in the callback handler. This could be due to database connection issues.",
    oauthaccountnotlinked: "This account is already linked to another user.",
    emailsignin: "Error sending the email verification link. Check your email server configuration.",
    credentialssignin: "The sign-in credentials are invalid.",
    sessionrequired: "You must be signed in to access this page.",
    databaseconnection: "Could not connect to the database. Please check your database configuration.",
  };

  const errorMessage = error && errorMessages[error] ? errorMessages[error] : errorMessages.default;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Time Agent</h1>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="mx-auto bg-destructive/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
            <ShieldAlert className="h-6 w-6 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Authentication Error
          </CardTitle>
          <CardDescription className="text-center">
            There was a problem signing you in.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Alert variant="destructive" className="text-sm">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <AlertTitle>Error Details</AlertTitle>
            <AlertDescription>
              <p>{errorMessage}</p>
              {error && <p className="mt-1 text-xs opacity-70">Error code: {error}</p>}
            </AlertDescription>
          </Alert>
          
          {process.env.NODE_ENV === "development" && (
            <Alert className="text-sm bg-yellow-50 border-yellow-200">
              <HelpCircle className="h-4 w-4 mr-2 text-yellow-800" />
              <AlertTitle className="text-yellow-800">Development Tips</AlertTitle>
              <AlertDescription className="text-yellow-700">
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li>Make sure Docker is running and the database is accessible</li>
                  <li>Check that you've run <code>pnpm db:push</code> to set up the database schema</li>
                  <li>Verify your OAuth credentials in <code>.env.local</code></li>
                  <li>Check the server logs for more detailed error information</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <Button onClick={() => window.location.href = "/auth/signin"}>
            Try Again
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 