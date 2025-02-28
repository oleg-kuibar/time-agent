import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import PageLayout from "~/components/layouts/PageLayout";
import PageHeader from "~/components/layouts/PageHeader";
import { ChartIcon } from "~/components/ui/icons";

export default async function Reports() {
  const session = await getServerAuthSession();
  
  // Redirect to sign-in if not authenticated
  if (!session) {
    redirect("/auth/signin");
  }
  
  // Page header with actions
  const header = (
    <PageHeader
      title="Reports"
      description="Analyze your development time and productivity"
      actions={
        <Button variant="outline">
          Export Data
        </Button>
      }
    />
  );
  
  return (
    <PageLayout header={header}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Daily Average</CardTitle>
              <CardDescription>
                Average time tracked per day
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-24">
                <span className="text-3xl font-bold">0h 00m</span>
                <span className="text-sm text-muted-foreground">No data available</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Weekly Total</CardTitle>
              <CardDescription>
                Total time tracked this week
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-24">
                <span className="text-3xl font-bold">0h 00m</span>
                <span className="text-sm text-muted-foreground">No data available</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Monthly Total</CardTitle>
              <CardDescription>
                Total time tracked this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center h-24">
                <span className="text-3xl font-bold">0h 00m</span>
                <span className="text-sm text-muted-foreground">No data available</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Time Distribution</CardTitle>
            <CardDescription>
              How your time is distributed across projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center h-60">
              <div className="rounded-full bg-muted p-3 mb-4">
                <ChartIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No data available</h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Start tracking your time to generate reports and insights about your development activities.
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
            <CardDescription>
              Your activity over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-60 flex items-center justify-center border border-dashed rounded-md">
                <p className="text-muted-foreground">Not enough data to generate timeline</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
} 