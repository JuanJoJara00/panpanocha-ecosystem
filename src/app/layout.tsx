import type { Metadata } from 'next'
import { Nunito, Lato } from 'next/font/google'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

const lato = Lato({
  weight: ['400', '700', '900'],
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'PanPanocha Ecosystem',
  description: 'Ecosistema Digital PanPanocha',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${nunito.variable} ${lato.variable} font-sans antialiased text-gray-900 bg-gray-50`}>
        {children}
      </body>
    </html>
  )
}
