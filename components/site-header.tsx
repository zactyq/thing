import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const SiteHeader = () => {
  const pathname = usePathname();

  return (
    <div className="flex items-center space-x-4">
      <Link
        href="/sandbox"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/sandbox"
            ? "text-primary"
            : "text-muted-foreground"
        )}
      >
        Sandbox
      </Link>
      <Link
        href="/teams"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/teams"
            ? "text-primary"
            : "text-muted-foreground"
        )}
      >
        Teams
      </Link>
    </div>
  );
};

export default SiteHeader; 