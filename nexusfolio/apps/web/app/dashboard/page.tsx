import { auth0 } from "../../lib/auth0";
import { Button } from "@workspace/ui/components/button";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";

export default async function Dashboard() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  // Automatically redirect to stocks page as the default dashboard view
  redirect("/dashboard/stocks");
}
