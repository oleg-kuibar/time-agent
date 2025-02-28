import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import PageLayout from "~/components/layouts/PageLayout";
import PageHeader from "~/components/layouts/PageHeader";
import { ClockIcon, PlusIcon } from "~/components/ui/icons";

export default async function Activities() {
  const session = await getServerAuthSession();
  
  // Redirect to sign-in if not authenticated
  if (!session) {
    redirect("/auth/signin");
  }
  
  // Page header with actions
  const header = (
    <PageHeader
      title="Activities"
      description="Track and manage your development activities"
      actions={
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          New Activity
        </Button>
      }
    />
  );
  
  return (
    <PageLayout header={header}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Your most recent time tracking entries
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Empty state */}
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-4">
                  <ClockIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">No activities yet</h3>
                <p className="text-sm text-muted-foreground mb-4 max-w-md">
                  Start tracking your development time to see your activities here.
                </p>
                <Button>
                  <ClockIcon className="mr-2 h-4 w-4" />
                  Start Tracking
                </Button>
              </div>
              
              {/* Activity list template (hidden for now) */}
              <div className="hidden">
                <div className="border rounded-md divide-y">
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium">Activity Title</h4>
                        <p className="text-xs text-muted-foreground mt-1">Project Name</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">1h 30m</span>
                        <p className="text-xs text-muted-foreground mt-1">Today, 10:00 AM - 11:30 AM</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium">Activity Title</h4>
                        <p className="text-xs text-muted-foreground mt-1">Project Name</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-medium">45m</span>
                        <p className="text-xs text-muted-foreground mt-1">Today, 8:15 AM - 9:00 AM</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Activity Calendar</CardTitle>
              <CardDescription>
                View your activities by date
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-60 flex items-center justify-center border border-dashed rounded-md">
                <p className="text-muted-foreground">Calendar view will be available soon</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Activity Stats</CardTitle>
              <CardDescription>
                Summary of your tracked time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                  <span className="text-sm font-medium">Today</span>
                  <span className="font-medium">0h 00m</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                  <span className="text-sm font-medium">This Week</span>
                  <span className="font-medium">0h 00m</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-muted rounded-md">
                  <span className="text-sm font-medium">This Month</span>
                  <span className="font-medium">0h 00m</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
} 