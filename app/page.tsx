import FormComponent from "@/components/FormComponent";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Arıza & İş Emri Oluşturucu
            </h1>
            <p className="text-gray-600">
              Arıza bildirimlerini standart formatta oluşturup QR kod ile aktarın
            </p>
            <div className="mt-4">
              <Link
                href="/hakkinda"
                className="inline-flex rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                aria-label="Hakkında sayfasına git"
              >
                Hakkında
              </Link>
            </div>
          </div>
          <FormComponent />
        </div>
      </div>
    </main>
  );
}
