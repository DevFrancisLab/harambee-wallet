import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Home, PlusCircle, BookOpen, User } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/dashboard", icon: Home, label: "Home" },
  { to: "/create", icon: PlusCircle, label: "Create" },
  { to: "/ledger", icon: BookOpen, label: "Ledger" },
  { to: "/profile", icon: User, label: "Profile" },
];

const AppLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border p-6 fixed h-full">
        <div className="mb-10">
          <h1 className="text-2xl font-800 text-primary">🤝 Harambee</h1>
          <p className="text-sm text-muted-foreground mt-1">Raise Together. Help Faster.</p>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-base font-semibold transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-background"
                )
              }
            >
              <item.icon size={20} />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 md:ml-64 pb-24 md:pb-6">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex justify-around py-2 px-2 z-50">
        {navItems.map((item) => {
          const isActive = location.pathname.startsWith(item.to);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center gap-1 py-1 px-3 rounded-xl text-xs font-semibold transition-colors min-w-[60px]",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default AppLayout;
