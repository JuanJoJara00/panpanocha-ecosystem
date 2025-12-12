'use client'
// Force refresh

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ModuleTabs from '@/components/ui/ModuleTabs'
import Select from '@/components/ui/Select'
import { Calendar, Store, Eye, X, FileText } from 'lucide-react'

// Types
type BaseClosing = {
    id: string
    created_at: string
    shift: string
    base_cash: number
    sales_cash: number
    sales_card: number
    sales_transfer: number
    expenses_total: number
    tips_total: number
    cash_audit_count: number
    notes: string
    branch_id: string
    branch: { name: string }
}

type UnifiedClosing = {
    id: string
    date: string
    shift: string
    branch_name: string
    branch_id: string
    mys?: BaseClosing
    siigo?: BaseClosing
}

// Helpers
const formatCurrency = (value: number) => new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value)
const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('es-CO', { dateStyle: 'medium' })

// Generate last 12 months for filter
const getPeriodOptions = () => {
    const options = []
    const today = new Date()
    for (let i = 0; i < 12; i++) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1)
        const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        const label = d.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' })
        options.push({ value, label: label.charAt(0).toUpperCase() + label.slice(1) })
    }
    return options
}

export default function ClosingHistory() {
    const [unifiedClosings, setUnifiedClosings] = useState<UnifiedClosing[]>([])
    const [branches, setBranches] = useState<{ id: string, name: string }[]>([])

    // Filters
    const [selectedBranch, setSelectedBranch] = useState<string>('all')
    const [selectedPeriod, setSelectedPeriod] = useState<string>(new Date().toISOString().slice(0, 7)) // YYYY-MM

    const [loading, setLoading] = useState(true)
    const [selectedUnified, setSelectedUnified] = useState<UnifiedClosing | null>(null)

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)

            // 1. Fetch Branches
            const { data: branchData } = await supabase.from('branches').select('id, name').order('name')
            if (branchData) setBranches(branchData)

            // Calculate Period Range
            const [year, month] = selectedPeriod.split('-').map(Number)
            const startDate = new Date(year, month - 1, 1).toISOString()
            const endDate = new Date(year, month, 0, 23, 59, 59).toISOString()

            // 2. Fetch Mys Closings (Filtered by Date)
            const { data: mysData } = await supabase
                .from('mys_closings')
                .select('*, branch:branches(name)')
                .gte('created_at', startDate)
                .lte('created_at', endDate)
                .order('created_at', { ascending: false })

            // 3. Fetch Siigo Closings (Filtered by Date)
            const { data: siigoData } = await supabase
                .from('siigo_closings')
                .select('*, branch:branches(name)')
                .gte('created_at', startDate)
                .lte('created_at', endDate)
                .order('created_at', { ascending: false })

            // 4. Grouping Logic
            const groups: Record<string, UnifiedClosing> = {}

            const generateKey = (date: string, shift: string, branchId: string) => {
                const day = new Date(date).toISOString().split('T')[0]
                return `${day}_${shift}_${branchId}`
            }

            // Process Mys
            mysData?.forEach((c: any) => {
                const key = generateKey(c.created_at, c.shift, c.branch_id)
                if (!groups[key]) {
                    groups[key] = {
                        id: key,
                        date: c.created_at,
                        shift: c.shift,
                        branch_id: c.branch_id,
                        branch_name: c.branch?.name || 'Sede Desconocida',
                        mys: c
                    }
                } else {
                    groups[key].mys = c
                }
            })

            // Process Siigo
            siigoData?.forEach((c: any) => {
                const key = generateKey(c.created_at, c.shift, c.branch_id)
                if (!groups[key]) {
                    groups[key] = {
                        id: key,
                        date: c.created_at,
                        shift: c.shift,
                        branch_id: c.branch_id,
                        branch_name: c.branch?.name || 'Sede Desconocida',
                        siigo: c
                    }
                } else {
                    groups[key].siigo = c // Merge into existing group
                }
            })

            // Sort by date desc
            const sorted = Object.values(groups).sort((a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            )

            setUnifiedClosings(sorted)
            setLoading(false)
        }
        fetchData()
    }, [selectedPeriod]) // Re-fetch when date changes

    // Generate Tab Options from Branches
    const tabOptions = branches.map(b => ({ id: b.id, label: b.name }))

    // Client-side branch filtering
    const filteredClosings = selectedBranch === 'all'
        ? unifiedClosings
        : unifiedClosings.filter(c => c.branch_id === selectedBranch)

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="font-bold text-gray-700 text-lg">Historial de Cierres (Unificado)</h3>

                {/* Date Filter */}
                <div className="w-full md:w-48">
                    <Select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        options={getPeriodOptions()}
                        fullWidth
                    />
                </div>
            </div>

            {/* Reusable ModuleTabs for Branch Filtering */}
            <ModuleTabs
                tabs={tabOptions}
                activeTabId={selectedBranch}
                onTabChange={setSelectedBranch}
                labelAll="Todas las Sedes"
            />

            {/* Closings Grid */}
            {loading ? (
                <div className="text-center py-10 text-gray-400">Cargando historial unificado...</div>
            ) : filteredClosings.length === 0 ? (
                <div className="text-center py-10 text-gray-400 bg-gray-50 rounded-xl border border-dashed">
                    No hay cierres registrados para este periodo.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredClosings.map(unified => {
                        const mysTotal = unified.mys ? (unified.mys.sales_cash + unified.mys.sales_card + unified.mys.sales_transfer) : 0
                        const siigoTotal = unified.siigo ? (unified.siigo.sales_cash + unified.siigo.sales_card + unified.siigo.sales_transfer) : 0
                        const combinedTotal = mysTotal + siigoTotal

                        // Cash to Deliver Calculation
                        const mysCashDeliver = unified.mys ? (unified.mys.cash_audit_count - unified.mys.base_cash) : 0
                        const siigoCashDeliver = unified.siigo ? (unified.siigo.cash_audit_count - unified.siigo.base_cash) : 0
                        const totalCashDeliver = mysCashDeliver + siigoCashDeliver

                        const isComplete = unified.mys && unified.siigo
                        const hasConflict = unified.mys && unified.siigo && Math.abs(mysTotal - siigoTotal) > 1000 // Flag diff > $1000

                        return (
                            <Card key={unified.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer group border-l-4"
                                onClick={() => setSelectedUnified(unified)}
                                style={{ borderLeftColor: isComplete ? (hasConflict ? '#f59e0b' : '#10b981') : unified.mys ? '#d97706' : '#2563eb' }}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <p className="font-bold text-gray-800 text-sm flex items-center gap-1">
                                            <Store className="w-3 h-3 text-gray-400" />
                                            {unified.branch_name}
                                            <span className="text-gray-300">|</span>
                                            <span className="capitalize">{unified.shift}</span>
                                        </p>
                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                            <Calendar className="w-3 h-3" />
                                            {formatDate(unified.date)}
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        {unified.mys && <span className="bg-orange-100 text-orange-800 text-[10px] px-2 py-0.5 rounded-full font-bold">MYS</span>}
                                        {unified.siigo && <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full font-bold">SIIGO</span>}
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4 border-t border-b border-gray-100 py-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Ventas Turno Total</span>
                                        <span className="font-bold text-gray-800">{formatCurrency(combinedTotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Efectivo a Entregar</span>
                                        <span className="font-bold text-green-700">{formatCurrency(totalCashDeliver)}</span>
                                    </div>
                                </div>

                                <Button size="sm" variant="outline" className="w-full text-xs group-hover:bg-gray-50">
                                    <Eye className="w-3 h-3 mr-2" /> Ver Detalle
                                </Button>
                            </Card>
                        )
                    })}
                </div>
            )}

            {/* DETAIL MODAL */}
            {selectedUnified && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-10">
                            <div>
                                <h3 className="text-xl font-bold text-gray-800">Cierre Unificado del Turno</h3>
                                <p className="text-sm text-gray-500">{formatDate(selectedUnified.date)} - {selectedUnified.branch_name} ({selectedUnified.shift})</p>
                            </div>
                            <button onClick={() => setSelectedUnified(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* MYS SIDE */}
                            <div className={`p-4 rounded-2xl border-2 ${selectedUnified.mys ? 'border-orange-100 bg-orange-50/30' : 'border-gray-100 bg-gray-50 opacity-50'}`}>
                                <div className="flex items-center gap-2 mb-4 border-b pb-2 border-orange-200/50">
                                    <span className="bg-orange-100 p-1.5 rounded-lg text-orange-600"><Store className="w-4 h-4" /></span>
                                    <h4 className="font-bold text-gray-800">Cierre Mys (Operativo)</h4>
                                </div>

                                {selectedUnified.mys ? (
                                    <div className="space-y-4 text-sm">
                                        <div className="bg-white p-3 rounded-xl shadow-sm space-y-2">
                                            <div className="flex justify-between"><span className="text-gray-500">Base</span> <span className="font-medium">{formatCurrency(selectedUnified.mys.base_cash)}</span></div>
                                            <div className="flex justify-between"><span className="text-gray-500">V. Efectivo</span> <span className="font-medium">{formatCurrency(selectedUnified.mys.sales_cash)}</span></div>
                                            <div className="flex justify-between"><span className="text-gray-500">Gastos</span> <span className="font-medium text-red-500">-{formatCurrency(selectedUnified.mys.expenses_total)}</span></div>
                                            <div className="flex justify-between"><span className="text-gray-500">Propinas</span> <span className="font-medium text-red-500">-{formatCurrency(selectedUnified.mys.tips_total)}</span></div>
                                            <div className="border-t pt-2 flex justify-between font-bold text-orange-800 mt-2">
                                                <span>A Entregar:</span>
                                                <span>{formatCurrency(selectedUnified.mys.cash_audit_count - selectedUnified.mys.base_cash)}</span>
                                            </div>
                                        </div>

                                        <div className="bg-white p-3 rounded-xl shadow-sm space-y-2">
                                            <h5 className="font-bold text-xs uppercase text-gray-400">Total Ventas Mys</h5>
                                            <div className="flex justify-between"><span className="text-gray-500">Total</span> <span className="font-bold">{formatCurrency((selectedUnified.mys.sales_cash || 0) + (selectedUnified.mys.sales_card || 0) + (selectedUnified.mys.sales_transfer || 0))}</span></div>
                                        </div>

                                        <div className="bg-white p-3 rounded-xl shadow-sm text-xs text-gray-500 whitespace-pre-wrap">
                                            <p className="font-bold mb-1">Notas / Soportes:</p>
                                            {selectedUnified.mys.notes}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-center">
                                        <p>No se ha registrado cierre Mys para este turno.</p>
                                    </div>
                                )}
                            </div>

                            {/* SIIGO SIDE */}
                            <div className={`p-4 rounded-2xl border-2 ${selectedUnified.siigo ? 'border-blue-100 bg-blue-50/30' : 'border-gray-100 bg-gray-50 opacity-50'}`}>
                                <div className="flex items-center gap-2 mb-4 border-b pb-2 border-blue-200/50">
                                    <span className="bg-blue-100 p-1.5 rounded-lg text-blue-600"><FileText className="w-4 h-4" /></span>
                                    <h4 className="font-bold text-gray-800">Cierre Siigo (Contable)</h4>
                                </div>

                                {selectedUnified.siigo ? (
                                    <div className="space-y-4 text-sm">
                                        <div className="bg-white p-3 rounded-xl shadow-sm space-y-2">
                                            <div className="flex justify-between"><span className="text-gray-500">Base</span> <span className="font-medium">{formatCurrency(selectedUnified.siigo.base_cash)}</span></div>
                                            <div className="flex justify-between"><span className="text-gray-500">V. Efectivo</span> <span className="font-medium">{formatCurrency(selectedUnified.siigo.sales_cash)}</span></div>
                                            <div className="flex justify-between"><span className="text-gray-500">Gastos</span> <span className="font-medium text-red-500">-{formatCurrency(selectedUnified.siigo.expenses_total)}</span></div>
                                            <div className="flex justify-between"><span className="text-gray-500">Propinas</span> <span className="font-medium text-red-500">-{formatCurrency(selectedUnified.siigo.tips_total)}</span></div>
                                            <div className="border-t pt-2 flex justify-between font-bold text-blue-800 mt-2">
                                                <span>A Entregar:</span>
                                                <span>{formatCurrency(selectedUnified.siigo.cash_audit_count - selectedUnified.siigo.base_cash)}</span>
                                            </div>
                                        </div>

                                        <div className="bg-white p-3 rounded-xl shadow-sm space-y-2">
                                            <h5 className="font-bold text-xs uppercase text-gray-400">Total Ventas Siigo</h5>
                                            <div className="flex justify-between"><span className="text-gray-500">Total</span> <span className="font-bold">{formatCurrency((selectedUnified.siigo.sales_cash || 0) + (selectedUnified.siigo.sales_card || 0) + (selectedUnified.siigo.sales_transfer || 0))}</span></div>
                                        </div>

                                        <div className="bg-white p-3 rounded-xl shadow-sm text-xs text-gray-500 whitespace-pre-wrap">
                                            <p className="font-bold mb-1">Notas / Soportes:</p>
                                            {selectedUnified.siigo.notes}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-40 text-gray-400 text-center">
                                        <p>No se ha registrado cierre Siigo para este turno.</p>
                                    </div>
                                )}
                            </div>

                        </div>

                        {/* TOTALS SUMMARY */}
                        {(selectedUnified.mys && selectedUnified.siigo) && (
                            <div className="bg-gray-900 text-white p-6 mx-6 mb-6 rounded-xl flex flex-col md:flex-row justify-between items-center gap-4">
                                <div>
                                    <h4 className="font-bold text-lg">Total del Turno (Mys + Siigo)</h4>
                                    <p className="text-gray-400 text-sm">Suma de ambas cajas</p>
                                </div>
                                <div className="flex gap-8 text-right">
                                    <div>
                                        <p className="text-xs uppercase tracking-wider font-bold text-gray-500">Total Ventas</p>
                                        <p className="text-2xl font-bold">
                                            {formatCurrency(
                                                ((selectedUnified.mys?.sales_cash || 0) + (selectedUnified.mys?.sales_card || 0) + (selectedUnified.mys?.sales_transfer || 0)) +
                                                ((selectedUnified.siigo?.sales_cash || 0) + (selectedUnified.siigo?.sales_card || 0) + (selectedUnified.siigo?.sales_transfer || 0))
                                            )}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wider font-bold text-gray-500">Total a Entregar</p>
                                        <p className="text-2xl font-bold text-green-400">
                                            {formatCurrency(
                                                (selectedUnified.mys?.cash_audit_count - selectedUnified.mys?.base_cash) +
                                                (selectedUnified.siigo?.cash_audit_count - selectedUnified.siigo?.base_cash)
                                            )}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="p-6 border-t bg-gray-50 rounded-b-2xl">
                            <Button onClick={() => setSelectedUnified(null)} className="w-full">Cerrar Detalle</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
