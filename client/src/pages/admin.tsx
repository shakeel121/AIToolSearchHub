import Header from "@/components/header";
import Footer from "@/components/footer";
import AdminPanel from "@/components/admin-panel";

export default function Admin() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Admin Panel</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Manage submissions, moderate content, and view analytics.
              </p>
            </div>

            <AdminPanel />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
