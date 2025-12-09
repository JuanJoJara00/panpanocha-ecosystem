import { User, Phone, MapPin, DollarSign, Package, FileText, X, Edit2, Calendar } from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useState } from 'react'

interface Delivery {
    id: string
    customer_name: string
    customer_phone: string
    customer_address: string
    product_details: string
    delivery_fee: number
    status: 'pending' | 'dispatched' | 'delivered' | 'cancelled'
    client_payment_proof_url?: string
    delivery_receipt_url?: string
    created_at: string
    branch_id?: string
    assigned_driver?: string
}

interface DeliveryDetailProps {
    delivery: Delivery
    onEdit: () => void
    onClose: () => void
}

export default function DeliveryDetail({ delivery, onEdit, onClose }: DeliveryDetailProps) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount)
    }

    const getStatusLabel = (status: string) => {
        const map: Record<string, string> = {
            'pending': 'Pendiente',
            'dispatched': 'Despachado',
            'delivered': 'Entregado',
            'cancelled': 'Cancelado'
        }
        return map[status] || status
    }

    const getStatusVariant = (status: string) => {
        const map: Record<string, any> = {
            'pending': 'warning',
            'dispatched': 'info',
            'delivered': 'success',
            'cancelled': 'error'
        }
        return map[status] || 'neutral'
    }

    return (
        <div className="flex flex-col h-full max-h-[85vh]">
            {/* Header - Fixed */}
            <div className="flex justify-between items-start p-6 border-b border-gray-100 bg-white rounded-t-2xl shrink-0">
                <div className="flex gap-4 items-start">
                    <div className="h-14 w-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 shrink-0">
                        <User className="h-7 w-7" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 font-display uppercase tracking-tight">{delivery.customer_name}</h2>
                        <a href={`tel:${delivery.customer_phone}`} className="text-sm text-gray-500 font-sans mt-0.5 flex items-center gap-1 hover:text-blue-600 transition-colors">
                            <Phone className="h-3 w-3" />
                            {delivery.customer_phone}
                        </a>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                    <X className="h-6 w-6" />
                </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Estado</p>
                        <Badge variant={getStatusVariant(delivery.status)}>
                            {getStatusLabel(delivery.status)}
                        </Badge>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Fecha</p>
                        <p className="font-medium text-gray-900 flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {new Date(delivery.created_at).toLocaleDateString()}
                        </p>
                    </div>

                    <div className="col-span-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Dirección de Entrega</p>
                        <p className="font-medium text-gray-900 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-red-500" />
                            {delivery.customer_address}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Domiciliario</p>
                        <p className="font-medium text-gray-900">{delivery.assigned_driver || 'Sin asignar'}</p>
                    </div>

                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Costo Domicilio</p>
                        <p className="font-bold text-gray-900">{formatCurrency(delivery.delivery_fee)}</p>
                    </div>
                </div>

                {/* Product/Order Details Section */}
                <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                    <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                        <Package className="h-4 w-4" />
                        Detalle del Pedido
                    </h3>
                    <p className="text-gray-600 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                        {delivery.product_details}
                    </p>
                </div>

                {/* Attachments Section - "Styled like Stock per Sede" */}
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Comprobantes y Anexos
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Client Payment Proof */}
                        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center text-center gap-3 hover:border-blue-300 transition-colors group relative overflow-hidden">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest z-10">Pago del Cliente</p>
                            {delivery.client_payment_proof_url ? (
                                <a
                                    href={delivery.client_payment_proof_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="z-10 w-full"
                                >
                                    <div className="h-24 w-full bg-gray-100 rounded-lg flex items-center justify-center mb-2 overflow-hidden border border-gray-100">
                                        <img src={delivery.client_payment_proof_url} alt="Pago Cliente" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-xs font-bold text-blue-600 underline">Ver Comprobante</span>
                                </a>
                            ) : (
                                <div className="z-10 py-6">
                                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-2">
                                        <X className="h-5 w-5" />
                                    </div>
                                    <p className="text-xs text-gray-400 italic">No adjuntado</p>
                                </div>
                            )}
                        </div>

                        {/* Domiciliario Receipt */}
                        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col items-center justify-center text-center gap-3 hover:border-pp-gold transition-colors group relative overflow-hidden">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest z-10">Recibo Caja Menor</p>
                            {delivery.delivery_receipt_url ? (
                                <a
                                    href={delivery.delivery_receipt_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="z-10 w-full"
                                >
                                    <div className="h-24 w-full bg-gray-100 rounded-lg flex items-center justify-center mb-2 overflow-hidden border border-gray-100">
                                        <img src={delivery.delivery_receipt_url} alt="Recibo Domiciliario" className="w-full h-full object-cover" />
                                    </div>
                                    <span className="text-xs font-bold text-pp-brown underline">Ver Recibo</span>
                                </a>
                            ) : (
                                <div className="z-10 py-6">
                                    <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-2">
                                        <X className="h-5 w-5" />
                                    </div>
                                    <p className="text-xs text-gray-400 italic">No adjuntado</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Lower Actions Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3 shrink-0">
                <Button
                    onClick={() => {
                        onClose();
                        onEdit();
                    }}
                    className="bg-pp-gold hover:bg-pp-gold/80 text-pp-brown border-transparent shadow-sm"
                    startIcon={<Edit2 className="h-4 w-4" />}
                >
                    Editar Pedido
                </Button>
            </div>
        </div>
    )
}
