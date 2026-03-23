import Link from "next/link";

export default function HakkindaPage() {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <section className="mx-auto max-w-4xl rounded-lg bg-white p-6 shadow-lg">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Hakkında</h1>
          <p className="text-gray-700">
            Bu uygulama, arıza bildirimlerini standart formatta oluşturup QR kod ile
            saha ekiplerine hızlı şekilde aktarabilmek için geliştirilmiştir.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
          aria-label="Ana sayfaya dön"
        >
          Ana Sayfaya Dön
        </Link>
      </section>
    </main>
  );
}
