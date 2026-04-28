import { redirect } from "next/navigation";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isLoggedIn = true; // replace auth check

  if (!isLoggedIn) {
    redirect("/auth");
  }

  return <>{children}</>;
}