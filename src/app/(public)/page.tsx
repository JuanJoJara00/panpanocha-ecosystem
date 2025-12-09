
import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-pp-cream text-center px-4">
      <div className="max-w-3xl space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold text-pp-brown font-display uppercase tracking-widest drop-shadow-sm">
          PanPanocha
        </h1>
        <p className="text-xl md:text-2xl text-pp-brown/80 italic font-sans font-medium">
          Sabor artesanal, corazón urbano.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto mt-8">
          <button className="bg-pp-gold hover:bg-pp-gold/80 text-pp-brown font-bold py-3 px-6 rounded-full shadow-lg transform transition hover:scale-105 font-display uppercase tracking-wide">
            Pedir por Rappi
          </button>
          <Link href="/portal/login" className="bg-white hover:bg-gray-50 text-pp-brown border-2 border-pp-gold/50 font-bold py-3 px-6 rounded-full shadow-sm transform transition hover:scale-105 font-display uppercase tracking-wide">
            Portal Empleados
          </Link>
        </div>

        <div className="mt-12 p-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-pp-gold/10">
          <p className="text-gray-500 font-sans">
            Estamos construyendo nuestro nuevo ecosistema digital.
            <br />Pronto más novedades.
          </p>
        </div>
      </div>
    </div>
  )
}
