'use client'

import React from 'react'
import PageHeader from '@/components/ui/PageHeader'
import { ShoppingBag } from 'lucide-react'

export default function RappiPage() {
    return (
        <div className="space-y-6">
            <PageHeader title="Dashboard Rappi" subtitle="Ventas y gastos de Rappi" />

            <div className="bg-white p-12 rounded-xl border border-gray-200 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pp-gold/10 mb-4">
                    <ShoppingBag className="h-8 w-8 text-pp-brown" />
                </div>
                <h2 className="text-xl font-bold text-gray-800 font-display mb-2">Módulo en Construcción</h2>
                <p className="text-gray-500 max-w-md mx-auto">
                    Próximamente podrás gestionar aquí toda la información relacionada con Rappi, incluyendo ventas, conciliaciones y reportes.
                </p>
            </div>
        </div>
    )
}
