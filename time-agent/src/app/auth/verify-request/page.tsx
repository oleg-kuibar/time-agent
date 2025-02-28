"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { CheckCircle, Mail } from "lucide-react";

export default function VerifyRequest() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Time Agent</h1>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="mx-auto bg-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            Check your email
          </CardTitle>
          <CardDescription className="text-center">
            A sign-in link has been sent to your email address.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Alert className="text-sm bg-primary/10 text-primary border-primary/20">
            <CheckCircle className="h-4 w-4 mr-2" />
            <AlertTitle>Instructions</AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Check your email inbox for a message from Time Agent</li>
                <li>Click the sign-in link in the email</li>
                <li>You'll be redirected back to the application</li>
                <li>The link is valid for 24 hours</li>
              </ul>
            </AlertDescription>
          </Alert>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>Didn't receive an email? Check your spam folder or try again.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 