'use client'

import { useState } from 'react'
import PageHeader from '@/components/ui/PageHeader'
import SupplierList from '@/components/business/suppliers/SupplierList'
import SupplierPaymentHistory from '@/components/business/suppliers/SupplierPaymentHistory'
import { Users, DollarSign } from 'lucide-react'

export default function ProveedoresPage() {
    const [activeTab, setActiveTab] = useState<'suppliers' | 'history'>('suppliers')

    return (
        <div className="space-y-6">
            <PageHeader title="Proveedores" subtitle="Gestión de aliados comerciales" />


            {/* Tabs */}
            <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('suppliers')}
                        className={`py-4 px-1 border-b-2 font-bold font-display text-sm flex items-center gap-2 transition-colors ${activeTab === 'suppliers'
                            ? 'border-pp-gold text-pp-brown'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <Users className="h-4 w-4" />
                        Proveedores
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`py-4 px-1 border-b-2 font-bold font-display text-sm flex items-center gap-2 transition-colors ${activeTab === 'history'
                            ? 'border-pp-gold text-pp-brown'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        <DollarSign className="h-4 w-4" />
                        Historial de Pagos
                    </button>
                </nav>
            </div>

            {/* Content */}
            {activeTab === 'suppliers' ? (
                <SupplierList />
            ) : (
                <SupplierPaymentHistory />
            )}
        </div>
    )
}
