'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Search, Truck, MapPin, Calendar, Clock, DollarSign, User } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import Modal from '@/components/ui/Modal'
import ModuleHeader from '@/components/ui/ModuleHeader'
import PageHeader from '@/components/ui/PageHeader'
import Badge from '@/components/ui/Badge'
import DeliveryDetail from './DeliveryDetail'
import DeliveryForm from './DeliveryForm'

export default function DeliveryList() {
    const [deliveries, setDeliveries] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    // Modal States
    const [selectedDelivery, setSelectedDelivery] = useState<any | null>(null)
    const [isDetailOpen, setIsDetailOpen] = useState(false)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingDelivery, setEditingDelivery] = useState<any | null>(null)

    useEffect(() => {
        fetchDeliveries()
    }, [])

    const fetchDeliveries = async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('deliveries')
            .select('*')
            .order('created_at', { ascending: false })

        if (data) setDeliveries(data)
        setLoading(false)
    }

    const handleViewDetail = (delivery: any) => {
        setSelectedDelivery(delivery)
        setIsDetailOpen(true)
    }

    const handleEdit = (delivery?: any) => {
        setEditingDelivery(delivery)
        setIsFormOpen(true)
    }

    const handleSuccess = () => {
        fetchDeliveries()
        setIsFormOpen(false)
        setEditingDelivery(null)
    }

    const filteredDeliveries = deliveries.filter(d =>
        d.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.customer_address?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getStatusVariant = (status: string) => {
        const map: Record<string, any> = {
            'pending': 'warning',
            'dispatched': 'info',
            'delivered': 'success',
            'cancelled': 'error'
        }
        return map[status] || 'neutral'
    }

    const getStatusLabel = (status: string) => {
        const map: Record<string, string> = {
            'pending': 'Pendiente',
            'dispatched': 'Despachado',
            'delivered': 'Entregado',
        }
        return map[status] || status
    }

    return (
        <div className="space-y-6">
            <PageHeader title="Domicilios" subtitle="Gestión de despachos" />
            <ModuleHeader
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Buscar por cliente, dirección..."
                actions={
                    <Button
                        onClick={() => handleEdit(null)}
                        startIcon={<Plus className="h-4 w-4" />}
                    >
                        Nuevo Domicilio
                    </Button>
                }
            />

            {/* List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDeliveries.map(delivery => (
                    <Card
                        key={delivery.id}
                        hover
                        className="flex flex-col h-full bg-white p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all cursor-pointer group relative overflow-hidden"
                        onClick={() => handleViewDetail(delivery)
                        }
                    >
                        {/* Status Badge */}
                        < div className="absolute top-4 right-4" >
                            <Badge variant={getStatusVariant(delivery.status)}>
                                {getStatusLabel(delivery.status)}
                            </Badge>
                        </div >

                        {/* Customer Info */}
                        < div className="flex items-start gap-4 mb-4" >
                            <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 shrink-0">
                                <User className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 font-display leading-tight">{delivery.customer_name}</h3>
                                <p className="text-sm text-gray-500 font-sans mt-0.5">{new Date(delivery.created_at).toLocaleDateString()}</p>
                            </div>
                        </div >

                        {/* Details */}
                        < div className="space-y-3 mt-2 mb-4" >
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="h-4 w-4 text-gray-400" />
                                <span className="truncate">{delivery.customer_address}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Truck className="h-4 w-4 text-gray-400" />
                                <span>{delivery.assigned_driver ? delivery.assigned_driver : 'Sin asignar'}</span>
                            </div>
                        </div >

                        {/* Footer (Price) */}
                        < div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center" >
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Costo Envío</span>
                            <span className="font-bold text-gray-900 font-mono">
                                {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(delivery.delivery_fee)}
                            </span>
                        </div >

                        {/* Hover Actions */}
                        < div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none" >
                            <div className="bg-white px-4 py-2 rounded-full shadow-lg text-sm font-bold text-gray-700 pointer-events-auto transform scale-95 group-hover:scale-100 transition-transform">
                                Ver Detalle
                            </div>
                        </div >
                    </Card >
                ))}
            </div >

            {/* Detail Modal */}
            < Modal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                title=""
                maxWidth="max-w-2xl"
                hideHeader={true}
            >
                {selectedDelivery && (
                    <DeliveryDetail
                        delivery={selectedDelivery}
                        onClose={() => setIsDetailOpen(false)}
                        onEdit={() => {
                            setIsDetailOpen(false)
                            handleEdit(selectedDelivery)
                        }}
                    />
                )}
            </Modal >

            {/* Form Modal (Placeholder for now) */}
            < Modal
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                title={editingDelivery ? "Editar Domicilio" : "Nuevo Domicilio"}
            >
                <DeliveryForm
                    initialData={editingDelivery}
                    onSuccess={handleSuccess}
                    onCancel={() => setIsFormOpen(false)}
                />
            </Modal >
        </div >
    )
}
