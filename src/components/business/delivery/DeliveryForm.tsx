'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { X, Upload, FileText, Image as ImageIcon } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useEffect } from 'react'

interface DeliveryFormProps {
    initialData?: any
    onSuccess: () => void
    onCancel: () => void
}

export default function DeliveryForm({ initialData, onSuccess, onCancel }: DeliveryFormProps) {
    const [loading, setLoading] = useState(false)
    const [branches, setBranches] = useState<any[]>([])

    // File States
    const [clientProof, setClientProof] = useState<File | null>(null)
    const [receiptProof, setReceiptProof] = useState<File | null>(null)

    // Preview States
    const [clientProofUrl, setClientProofUrl] = useState(initialData?.client_payment_proof_url || '')
    const [receiptProofUrl, setReceiptProofUrl] = useState(initialData?.delivery_receipt_url || '')

    const [formData, setFormData] = useState({
        customer_name: initialData?.customer_name || '',
        customer_phone: initialData?.customer_phone || '',
        customer_address: initialData?.customer_address || '',
        product_details: initialData?.product_details || '',
        delivery_fee: initialData?.delivery_fee || 0,
        branch_id: initialData?.branch_id || '',
        assigned_driver: initialData?.assigned_driver || '',
        status: initialData?.status || 'pending',
    })

    useEffect(() => {
        fetchBranches()
    }, [])

    const fetchBranches = async () => {
        const { data } = await supabase.from('branches').select('id, name').eq('is_active', true)
        if (data) setBranches(data)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'client' | 'receipt') => {
        const file = e.target.files?.[0]
        if (file) {
            if (type === 'client') {
                setClientProof(file)
                setClientProofUrl(URL.createObjectURL(file))
            } else {
                setReceiptProof(file)
                setReceiptProofUrl(URL.createObjectURL(file))
            }
        }
    }

    const uploadFile = async (file: File, path: string) => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
        const filePath = `${path}/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('payment_proofs') // Reusing existing bucket
            .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
            .from('payment_proofs')
            .getPublicUrl(filePath)

        return publicUrl
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            let clientUrl = clientProofUrl
            let receiptUrl = receiptProofUrl

            // Upload new files if present
            if (clientProof) {
                clientUrl = await uploadFile(clientProof, 'delivery_client_payments')
            }
            if (receiptProof) {
                receiptUrl = await uploadFile(receiptProof, 'delivery_receipts')
            }

            const dataToSave = {
                ...formData,
                client_payment_proof_url: clientUrl,
                delivery_receipt_url: receiptUrl
            }

            if (initialData?.id) {
                const { error } = await supabase
                    .from('deliveries')
                    .update(dataToSave)
                    .eq('id', initialData.id)
                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('deliveries')
                    .insert([dataToSave])
                if (error) throw error
            }
            onSuccess()
        } catch (error: any) {
            console.error('Error saving delivery:', error)
            alert('Error al guardar: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    const inputClassName = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pp-gold focus:border-pp-gold outline-none transition-all font-sans"
    const labelClassName = "block text-sm font-bold text-gray-700 mb-1 font-display uppercase tracking-wide"

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <label className={labelClassName}>Cliente *</label>
                    <input
                        type="text"
                        required
                        value={formData.customer_name}
                        onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                        className={inputClassName}
                        placeholder="Nombre completo"
                    />
                </div>

                <div>
                    <label className={labelClassName}>Teléfono *</label>
                    <input
                        type="tel"
                        required
                        value={formData.customer_phone}
                        onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                        className={inputClassName}
                    />
                </div>
                <div>
                    <label className={labelClassName}>Sede de Salida</label>
                    <select
                        value={formData.branch_id}
                        onChange={(e) => setFormData({ ...formData, branch_id: e.target.value })}
                        className={inputClassName}
                    >
                        <option value="">Seleccionar Sede</option>
                        {branches.map(b => (
                            <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className={labelClassName}>Dirección de Entrega *</label>
                    <input
                        type="text"
                        required
                        value={formData.customer_address}
                        onChange={(e) => setFormData({ ...formData, customer_address: e.target.value })}
                        className={inputClassName}
                        placeholder="Dirección completa"
                    />
                </div>
            </div>

            {/* Order Details */}
            <div>
                <label className={labelClassName}>Detalle del Pedido *</label>
                <textarea
                    required
                    rows={4}
                    value={formData.product_details}
                    onChange={(e) => setFormData({ ...formData, product_details: e.target.value })}
                    className={inputClassName}
                    placeholder="Lista de productos, especificaciones..."
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className={labelClassName}>Domiciliario</label>
                    <input
                        type="text"
                        value={formData.assigned_driver}
                        onChange={(e) => setFormData({ ...formData, assigned_driver: e.target.value })}
                        className={inputClassName}
                        placeholder="Nombre del repartidor"
                    />
                </div>
                <div>
                    <label className={labelClassName}>Costo Domicilio (COP) *</label>
                    <input
                        type="number"
                        required
                        min="0"
                        step="100"
                        value={formData.delivery_fee}
                        onChange={(e) => setFormData({ ...formData, delivery_fee: parseFloat(e.target.value) || 0 })}
                        className={inputClassName}
                    />
                </div>
            </div>

            <div className="md:col-span-2">
                <label className={labelClassName}>Estado</label>
                <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className={inputClassName}
                >
                    <option value="pending">Pendiente</option>
                    <option value="dispatched">Despachado</option>
                    <option value="delivered">Entregado</option>
                    <option value="cancelled">Cancelado</option>
                </select>
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
                {/* Client Payment Proof */}
                <div>
                    <label className={labelClassName}>Pago del Cliente (Comprobante)</label>
                    <div className="mt-2">
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                    <p className="text-xs text-gray-500 font-sans">Click para subir</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'client')} />
                            </label>
                        </div>
                        {clientProofUrl && (
                            <div className="mt-2 relative h-20 w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                <img src={clientProofUrl} className="w-full h-full object-cover" />
                                <button type="button" onClick={() => { setClientProof(null); setClientProofUrl('') }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"><X className="h-3 w-3" /></button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Receipt Proof */}
                <div>
                    <label className={labelClassName}>Recibo Caja Menor (Pago Domiciliario)</label>
                    <div className="mt-2">
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                                    <p className="text-xs text-gray-500 font-sans">Click para subir</p>
                                </div>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'receipt')} />
                            </label>
                        </div>
                        {receiptProofUrl && (
                            <div className="mt-2 relative h-20 w-full bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                <img src={receiptProofUrl} className="w-full h-full object-cover" />
                                <button type="button" onClick={() => { setReceiptProof(null); setReceiptProofUrl('') }} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"><X className="h-3 w-3" /></button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex gap-3 pt-6 border-t mt-2">
                <Button onClick={onCancel} variant="ghost" className="flex-1">
                    Cancelar
                </Button>
                <Button type="submit" disabled={loading} className="flex-1 bg-pp-gold text-pp-brown hover:bg-pp-gold/80">
                    {loading ? 'Guardando...' : 'Guardar Domicilio'}
                </Button>
            </div>
        </form>
    )
}
