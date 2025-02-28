import { type Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - Time Agent",
  description: "Sign in to your Time Agent account",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
} 