'use client'

import React, { useState } from 'react'
import PageHeader from '@/components/ui/PageHeader'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { DollarSign, FileText, CheckCircle2, TrendingUp, AlertTriangle, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import ClosingHistory from '@/components/business/cash/ClosingHistory'

export default function CashClosingHub() {
    const router = useRouter()

    // Placeholder stats - in real imp these would come from DB
    const stats = {
        lastMysClosing: 'Hoy, 14:30',
        lastSiigoClosing: 'Pendiente',
        pendingConciliations: 1
    }

    return (
        <div className="space-y-8">
            <PageHeader
                title="Cierre de Caja y Conciliación"
                subtitle="Gestión de efectivo operativo y contable"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Module 1: Mys Inventarios (Operativo) */}
                <Card className="p-6 flex flex-col h-full border-l-4 border-l-pp-gold hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-pp-gold/10 rounded-xl text-pp-brown">
                            <DollarSign className="w-8 h-8" />
                        </div>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                            ACTIVO
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 font-display">Cierre MysInventarios</h3>
                    <p className="text-gray-500 text-sm mb-6 flex-grow">
                        Realiza el conteo de efectivo físico, registra base inicial, gastos y propinas.
                    </p>

                    <div className="space-y-3 mt-auto">
                        <div className="text-xs text-gray-400 font-medium">
                            Último cierre: <span className="text-gray-700">{stats.lastMysClosing}</span>
                        </div>
                        <Button
                            className="w-full justify-between group"
                            onClick={() => router.push('/portal/cierre-mys')}
                        >
                            Gestionar Cierre
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </Card>

                {/* Module 2: Siigo (Contable) */}
                <Card className="p-6 flex flex-col h-full border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                        <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                            <FileText className="w-8 h-8" />
                        </div>
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                            ACTIVO
                        </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 font-display">Cierre Siigo</h3>
                    <p className="text-gray-500 text-sm mb-6 flex-grow">
                        Ingresa los totales reportados por Siigo P.O.S. para compararlos con la realidad física.
                    </p>

                    <div className="space-y-3 mt-auto">
                        <div className="text-xs text-gray-400 font-medium">
                            Último cierre: <span className="text-gray-700">{stats.lastSiigoClosing === 'Pendiente' ? 'Hoy, Pendiente' : stats.lastSiigoClosing}</span>
                        </div>
                        <Button
                            className="w-full justify-between group bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={() => router.push('/portal/cierre-siigo')}
                        >
                            Gestionar Cierre
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </div>
                </Card>

            </div>

            {/* Recent Activity */}
            <ClosingHistory />
        </div>
    )
}
