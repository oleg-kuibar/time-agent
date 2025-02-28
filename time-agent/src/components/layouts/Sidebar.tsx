import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";

interface SidebarProps {
  items: {
    title: string;
    href: string;
    icon?: React.ReactNode;
  }[];
  title?: string;
}

export default function Sidebar({ items, title }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {title && (
        <div className="px-3 py-2">
          <h3 className="text-sm font-medium text-muted-foreground mb-2">{title}</h3>
        </div>
      )}
      <nav className="space-y-1">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center px-3 py-2 text-sm rounded-md group",
              pathname === item.href
                ? "bg-primary text-primary-foreground"
                : "text-foreground hover:bg-muted"
            )}
          >
            {item.icon && <span className="mr-3">{item.icon}</span>}
            <span>{item.title}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
} 