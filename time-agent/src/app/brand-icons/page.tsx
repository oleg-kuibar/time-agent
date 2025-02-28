import { redirect } from "next/navigation";
import { getServerAuthSession } from "~/server/auth";
import PageLayout from "~/components/layouts/PageLayout";
import PageHeader from "~/components/layouts/PageHeader";
import { BrandIconsGrid } from "~/components/ui/brand-icons-grid";

export const metadata = {
  title: "Brand Icons - Time Agent",
  description: "Browse all available brand icons for use in Time Agent",
};

export default async function BrandIconsPage() {
  const session = await getServerAuthSession();
  
  // Redirect to sign-in if not authenticated
  if (!session) {
    redirect("/auth/signin");
  }
  
  // Page header
  const header = (
    <PageHeader
      title="Brand Icons"
      description="Browse all available brand icons from Simple Icons"
    />
  );
  
  return (
    <PageLayout header={header}>
      <div className="space-y-6">
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-lg font-medium mb-2">Usage</h2>
          <p className="text-sm text-muted-foreground mb-4">
            To use these icons in your components, import the BrandIcon component and specify the brand name:
          </p>
          <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
            <code>{`import { BrandIcon } from "~/components/ui/brand-icon";\n\n<BrandIcon brand="GitHub" size={24} />`}</code>
          </pre>
        </div>
        
        <BrandIconsGrid />
      </div>
    </PageLayout>
  );
} 