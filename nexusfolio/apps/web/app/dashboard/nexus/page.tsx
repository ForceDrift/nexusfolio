import { auth0 } from "../../../lib/auth0";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import NexusClient from "./nexus-client";

export default async function NexusPage() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar user={session.user} />
      <NexusClient />
    </div>
  );
}
