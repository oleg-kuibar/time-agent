import React from "react";
import Navbar from "~/components/Navbar";

interface PageLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  fullWidth?: boolean;
}

export default function PageLayout({
  children,
  header,
  sidebar,
  fullWidth = false,
}: PageLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1 py-6">
        <div className={fullWidth ? "px-4 sm:px-6 lg:px-8" : "container px-4 sm:px-6 lg:px-8 mx-auto"}>
          {header && (
            <div className="mb-6">
              {header}
            </div>
          )}
          
          <div className="flex flex-col md:flex-row gap-6">
            {sidebar && (
              <div className="w-full md:w-64 flex-shrink-0">
                {sidebar}
              </div>
            )}
            
            <div className={`flex-1 ${sidebar ? "md:max-w-[calc(100%-16rem)]" : "w-full"}`}>
              {children}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Time Agent. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <span className="text-sm text-muted-foreground">
                Intelligent time tracking for developers
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
} 