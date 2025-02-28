import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import PageLayout from "~/components/layouts/PageLayout";
import PageHeader from "~/components/layouts/PageHeader";
import Sidebar from "~/components/layouts/Sidebar";
import { ClockIcon, ChartIcon, FolderIcon, HomeIcon, SettingsIcon } from "~/components/ui/icons";

export default async function Dashboard() {
  const session = await getServerAuthSession();
  
  // Redirect to sign-in if not authenticated
  if (!session) {
    redirect("/auth/signin");
  }
  
  const user = {
    id: session.user.id,
    name: session.user.name || session.user.email?.split('@')[0] || 'User',
    email: session.user.email,
    image: session.user.image || null,
  };

  // Sidebar navigation items
  const sidebarItems = [
    { title: "Dashboard", href: "/dashboard", icon: <HomeIcon /> },
    { title: "Activities", href: "/activities", icon: <ClockIcon /> },
    { title: "Projects", href: "/projects", icon: <FolderIcon /> },
    { title: "Reports", href: "/reports", icon: <ChartIcon /> },
    { title: "Settings", href: "/settings", icon: <SettingsIcon /> },
  ];
  
  // Page header with actions
  const header = (
    <PageHeader
      title="Dashboard"
      description="Welcome back to your Time Agent dashboard"
      actions={
        <Button>
          <ClockIcon className="mr-2 h-4 w-4" />
          Start Tracking
        </Button>
      }
    />
  );

  // Sidebar component
  const sidebar = (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            {user.image ? (
              <img 
                src={user.image} 
                alt={user.name} 
                className="h-10 w-10 rounded-full"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-sm font-medium">
                {user.name}
              </h3>
              <p className="text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Sidebar items={sidebarItems} title="Navigation" />
    </div>
  );
  
  return (
    <PageLayout header={header} sidebar={sidebar}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Summary</CardTitle>
            <CardDescription>
              Your activity overview for today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex flex-col p-4 rounded-lg bg-muted">
                <span className="text-sm font-medium text-muted-foreground">Total Time</span>
                <span className="text-2xl font-bold">0h 00m</span>
              </div>
              <div className="flex flex-col p-4 rounded-lg bg-muted">
                <span className="text-sm font-medium text-muted-foreground">Active Projects</span>
                <span className="text-2xl font-bold">0</span>
              </div>
              <div className="flex flex-col p-4 rounded-lg bg-muted">
                <span className="text-sm font-medium text-muted-foreground">Completed Tasks</span>
                <span className="text-2xl font-bold">0</span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                Your latest tracked time entries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-40 flex items-center justify-center border border-dashed rounded-md">
                <p className="text-muted-foreground">No activity recorded today</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">View All Activities</Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>
                Your active development projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-40 flex items-center justify-center border border-dashed rounded-md">
                <p className="text-muted-foreground">No projects created yet</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm">Manage Projects</Button>
            </CardFooter>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Weekly Report</CardTitle>
            <CardDescription>
              Your time distribution for the past week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-60 flex items-center justify-center border border-dashed rounded-md">
              <p className="text-muted-foreground">Not enough data to generate reports</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">View Detailed Reports</Button>
          </CardFooter>
        </Card>
      </div>
    </PageLayout>
  );
} 