import { useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AdminPanel from "@/components/admin-panel";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function Admin() {
  const [, setLocation] = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setLocation("/admin-login");
    }
  }, [setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    setLocation("/admin-login");
  };

  const token = localStorage.getItem("admin_token");
  if (!token) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div className="text-center flex-1">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Admin Panel</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Manage submissions, moderate content, and view analytics.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center text-red-600 hover:text-red-700"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>

            <AdminPanel />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
