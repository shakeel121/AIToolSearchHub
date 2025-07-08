import Header from "@/components/header";
import Footer from "@/components/footer";
import SubmissionForm from "@/components/submission-form";

export default function Submit() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        <section className="py-20 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Submit Your AI Tool</h1>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Share your AI tool, product, or agent with the world. Join thousands of innovators on AISearch.
              </p>
            </div>

            <SubmissionForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
