import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import PageLayout from "~/components/layouts/PageLayout";
import PageHeader from "~/components/layouts/PageHeader";
import { FolderIcon, PlusIcon } from "~/components/ui/icons";

export default async function Projects() {
  const session = await getServerAuthSession();
  
  // Redirect to sign-in if not authenticated
  if (!session) {
    redirect("/auth/signin");
  }
  
  // Page header with actions
  const header = (
    <PageHeader
      title="Projects"
      description="Manage your development projects"
      actions={
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          New Project
        </Button>
      }
    />
  );
  
  return (
    <PageLayout header={header}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Empty state */}
          <Card className="col-span-full flex flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <FolderIcon className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No projects yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Create your first project to start tracking time against it.
            </p>
            <Button>
              <PlusIcon className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </Card>
          
          {/* Project card template (hidden for now) */}
          <div className="hidden">
            <Card>
              <CardHeader>
                <CardTitle>Project Name</CardTitle>
                <CardDescription>
                  Project description goes here
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total time</span>
                    <span className="font-medium">0h 00m</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Tasks</span>
                    <span className="font-medium">0</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Last activity</span>
                    <span className="font-medium">Never</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">View Details</Button>
                <Button size="sm">Track Time</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
} 