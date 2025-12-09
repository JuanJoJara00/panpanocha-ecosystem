'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { User, Mail, Phone, Briefcase, Building2, Calendar, DollarSign, Wallet } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'

interface EmployeeFormProps {
    onSuccess: () => void
    onCancel: () => void
    initialData?: any
}

export default function EmployeeForm({ onSuccess, onCancel, initialData }: EmployeeFormProps) {
    const [branches, setBranches] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    // Check if initialData is a valid object with an ID to determine mode
    const isEditMode = !!(initialData && initialData.id)

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        position: '',
        branch_id: '',
        hire_date: new Date().toISOString().split('T')[0],
        salary_type: 'monthly',
        base_salary: '',
        active: true
    })

    useEffect(() => {
        fetchBranches()
        if (isEditMode) {
            setFormData({
                full_name: initialData.full_name || '',
                email: initialData.email || '',
                phone: initialData.phone || '',
                position: initialData.position || '',
                branch_id: initialData.branch_id || '',
                hire_date: initialData.hire_date || new Date().toISOString().split('T')[0],
                salary_type: initialData.salary_type || 'monthly',
                base_salary: initialData.base_salary?.toString() || '',
                active: initialData.active ?? true
            })
        }
    }, [initialData, isEditMode])

    const fetchBranches = async () => {
        const { data } = await supabase.from('branches').select('*').order('name')
        if (data) setBranches(data)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const dataToSave = {
                ...formData,
                base_salary: parseFloat(formData.base_salary)
            }

            if (isEditMode) {
                // Update
                const { error } = await supabase
                    .from('employees')
                    .update(dataToSave)
                    .eq('id', initialData.id)

                if (error) throw error
            } else {
                // Insert
                const { error } = await supabase
                    .from('employees')
                    .insert([dataToSave])

                if (error) throw error
            }

            onSuccess()
        } catch (error: any) {
            console.error('Error saving employee:', error)
            alert('Error al guardar empleado: ' + error.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                    <Input
                        label="Nombre Completo"
                        required
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        startIcon={<User className="h-4 w-4" />}
                        placeholder="Ej: Juan Pérez"
                    />
                </div>

                <Input
                    label="Email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    startIcon={<Mail className="h-4 w-4" />}
                    placeholder="empleado@panpanocha.com"
                />

                <Input
                    label="Teléfono"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    startIcon={<Phone className="h-4 w-4" />}
                    placeholder="300 123 4567"
                />

                <Input
                    label="Cargo"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    startIcon={<Briefcase className="h-4 w-4" />}
                    placeholder="Ej: Cajero, Cocinero..."
                />

                <Select
                    label="Sede"
                    required
                    value={formData.branch_id}
                    onChange={(e) => setFormData({ ...formData, branch_id: e.target.value })}
                    options={branches.map(b => ({ value: b.id, label: b.name }))}
                />

                <Input
                    label="Fecha de Contratación"
                    type="date"
                    required
                    value={formData.hire_date}
                    onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                    startIcon={<Calendar className="h-4 w-4" />}
                />

                <Select
                    label="Tipo de Salario"
                    required
                    value={formData.salary_type}
                    onChange={(e) => setFormData({ ...formData, salary_type: e.target.value })}
                    options={[
                        { value: 'monthly', label: 'Mensual' },
                        { value: 'biweekly', label: 'Quincenal' },
                        { value: 'daily', label: 'Diario' },
                        { value: 'hourly', label: 'Por Hora' }
                    ]}
                />

                <Input
                    label="Salario Base (COP)"
                    type="number"
                    required
                    min="0"
                    step="1000"
                    value={formData.base_salary}
                    onChange={(e) => setFormData({ ...formData, base_salary: e.target.value })}
                    startIcon={<DollarSign className="h-4 w-4" />}
                    placeholder="1200000"
                />

                <div className="md:col-span-2 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <input
                            type="checkbox"
                            checked={formData.active}
                            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                            className="w-4 h-4 text-pp-gold border-gray-300 rounded focus:ring-pp-gold focus:ring-offset-0"
                        />
                        <span className="text-sm font-bold text-gray-700 font-display uppercase tracking-wide">Empleado Activo</span>
                    </label>
                </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-gray-100 justify-end">
                <Button
                    onClick={onCancel}
                    variant="ghost"
                    disabled={loading}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    isLoading={loading}
                    startIcon={isEditMode ? <User className="h-4 w-4" /> : <User className="h-4 w-4" />}
                >
                    {isEditMode ? 'Actualizar Empleado' : 'Crear Empleado'}
                </Button>
            </div>
        </form>
    )
}
