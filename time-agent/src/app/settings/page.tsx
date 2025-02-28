import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import PageLayout from "~/components/layouts/PageLayout";
import PageHeader from "~/components/layouts/PageHeader";
import Sidebar from "~/components/layouts/Sidebar";
import { SettingsIcon } from "~/components/ui/icons";
import { BrandIcon } from "~/components/ui/brand-icon";

export default async function Settings() {
  const session = await getServerAuthSession();
  
  // Redirect to sign-in if not authenticated
  if (!session) {
    redirect("/auth/signin");
  }
  
  // Page header
  const header = (
    <PageHeader
      title="Settings"
      description="Manage your account and preferences"
    />
  );
  
  // Settings sidebar items
  const settingsSections = [
    { title: "Profile", href: "/settings" },
    { title: "Account", href: "/settings/account" },
    { title: "Notifications", href: "/settings/notifications" },
    { title: "Integrations", href: "/settings/integrations" },
    { title: "Appearance", href: "/settings/appearance" },
  ];
  
  // Settings sidebar
  const sidebar = (
    <Sidebar items={settingsSections} title="Settings" />
  );
  
  return (
    <PageLayout header={header} sidebar={sidebar}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>
              Manage your personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                  value={session.user.name || ""}
                  readOnly
                />
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <input
                  id="email"
                  className="flex h-10 w-full rounded-md border px-3 py-2 text-sm"
                  value={session.user.email || ""}
                  readOnly
                />
              </div>
              
              <div className="flex flex-col space-y-1.5">
                <label className="text-sm font-medium">
                  Profile Image
                </label>
                <div className="flex items-center space-x-4">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="h-16 w-16 rounded-full"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl">
                      {session.user.name?.charAt(0).toUpperCase() || session.user.email?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <Button variant="outline" disabled>
                    Change Image
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Connected Accounts</CardTitle>
            <CardDescription>
              Manage your connected accounts and services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-muted p-2">
                    <BrandIcon brand="GitHub" className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">GitHub</h4>
                    <p className="text-xs text-muted-foreground">Connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Disconnect</Button>
              </div>
              
              <div className="flex items-center justify-between p-4 border rounded-md">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-muted p-2">
                    <BrandIcon brand="GitLab" className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">GitLab</h4>
                    <p className="text-xs text-muted-foreground">Connected</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Disconnect</Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
            <CardDescription>
              Irreversible account actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 border border-destructive/20 rounded-md bg-destructive/5">
              <div>
                <h4 className="text-sm font-medium">Delete Account</h4>
                <p className="text-xs text-muted-foreground">
                  Permanently delete your account and all your data
                </p>
              </div>
              <Button variant="destructive" size="sm">Delete Account</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
} 