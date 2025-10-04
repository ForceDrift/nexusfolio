import { auth0 } from "../../lib/auth0";
import { Button } from "@workspace/ui/components/button";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth0.getSession();

  if (!session) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {session.user.name}</span>
              <a href="/auth/logout">
                <Button variant="outline" size="sm">
                  Logout
                </Button>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Protected Dashboard</h2>
              <p className="text-gray-600 mb-6">
                This is a protected page that only authenticated users can access.
              </p>
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg shadow">
                  <h3 className="font-semibold mb-2">User Information:</h3>
                  <p><strong>Name:</strong> {session.user.name}</p>
                  <p><strong>Email:</strong> {session.user.email}</p>
                  <p><strong>User ID:</strong> {session.user.sub}</p>
                </div>
                <a href="/auth/logout">
                  <Button variant="destructive">
                    Logout
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
