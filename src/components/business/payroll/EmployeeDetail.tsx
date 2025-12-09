import { Building2, Calendar, Mail, Phone, DollarSign, Briefcase, User, Trash2, Edit2, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface Employee {
    id: string
    full_name: string
    email: string
    phone: string
    position: string
    branch_id: string
    hire_date: string
    salary_type: string
    base_salary: number
    active: boolean
    branches?: { name: string }
}

interface EmployeeDetailProps {
    employee: Employee
    onEdit: () => void
    onClose: () => void
    onRegisterPayment: () => void
}

export default function EmployeeDetail({ employee, onEdit, onClose, onRegisterPayment }: EmployeeDetailProps) {
    const [totalPaid, setTotalPaid] = useState<number>(0)

    // Fetch Total Paid
    useEffect(() => {
        const fetchTotalPaid = async () => {
            const { data, error } = await supabase
                .from('payroll')
                .select('net_amount')
                .eq('employee_id', employee.id)
                .eq('status', 'paid') // Only count paid records

            if (data) {
                const total = data.reduce((sum, record) => sum + (record.net_amount || 0), 0)
                setTotalPaid(total)
            }
        }
        fetchTotalPaid()
    }, [employee.id])

    const calculateTenure = (dateString: string) => {
        const start = new Date(dateString)
        const now = new Date()
        let years = now.getFullYear() - start.getFullYear()
        let months = now.getMonth() - start.getMonth()

        if (months < 0) {
            years--
            months += 12
        }

        if (years > 0) return `${years} año${years > 1 ? 's' : ''} y ${months} mes${months !== 1 ? 'es' : ''}`
        return `${months} mes${months !== 1 ? 'es' : ''}`
    }

    const formatSalary = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0
        }).format(amount)
    }

    const getSalaryTypeLabel = (type: string) => {
        const labels: Record<string, string> = {
            'monthly': 'Mensual',
            'biweekly': 'Quincenal',
            'daily': 'Diario',
            'hourly': 'Por hora'
        }
        return labels[type] || type
    }

    return (
        <div className="flex flex-col h-full max-h-[85vh]">
            {/* Header - Fixed */}
            <div className="flex justify-between items-start p-6 border-b border-gray-100 bg-white rounded-t-2xl shrink-0">
                <div className="flex gap-4 items-start">
                    <div className="h-14 w-14 bg-pp-brown/5 rounded-xl flex items-center justify-center text-pp-brown shrink-0">
                        <User className="h-7 w-7" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 font-display uppercase tracking-tight">{employee.full_name}</h2>
                        <p className="text-sm text-gray-500 font-sans uppercase tracking-wide mt-0.5">{employee.position}</p>
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
                        <Badge variant={employee.active ? 'success' : 'neutral'}>
                            {employee.active ? 'Activo' : 'Inactivo'}
                        </Badge>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Sede</p>
                        <p className="font-medium text-gray-900">{employee.branches?.name || 'Sin asignación'}</p>
                    </div>

                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Email</p>
                        <p className="font-medium text-gray-900 truncate" title={employee.email}>{employee.email || '—'}</p>
                    </div>
                    <div>
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Teléfono</p>
                        <p className="font-medium text-gray-900">{employee.phone || '—'}</p>
                    </div>

                    {/* Tenure Field */}
                    <div className="col-span-2">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tiempo en la empresa</p>
                        <p className="font-medium text-gray-900 flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-pp-gold" />
                            {calculateTenure(employee.hire_date)}
                        </p>
                    </div>
                </div>

                {/* Salary Types Section */}
                <div className="bg-pp-gold/5 rounded-xl p-5 border border-pp-gold/10">
                    <h3 className="text-sm font-bold text-pp-brown uppercase tracking-wider mb-4 flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Información Salarial y Pagos
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-xs font-bold text-pp-brown/60 uppercase tracking-widest mb-1">Tipo de Salario</p>
                            <p className="font-medium text-pp-brown capitalize">{getSalaryTypeLabel(employee.salary_type)}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-pp-brown/60 uppercase tracking-widest mb-1">Salario Base</p>
                            <p className="font-bold text-lg text-pp-brown font-mono tracking-tight">
                                {formatSalary(employee.base_salary)}
                            </p>
                        </div>
                        <div className="col-span-2 pt-2 border-t border-pp-brown/10 mt-2">
                            <p className="text-xs font-bold text-pp-brown/60 uppercase tracking-widest mb-1">Total Pagado (Histórico)</p>
                            <p className="font-bold text-2xl text-green-700 font-mono tracking-tight">
                                {formatSalary(totalPaid)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sticky Lower Actions Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3 shrink-0">
                {employee.active && (
                    <Button
                        onClick={() => {
                            onClose();
                            onRegisterPayment();
                        }}
                        className="bg-green-100 text-green-700 border-green-200 hover:bg-green-200 hover:border-green-300"
                        startIcon={<DollarSign className="h-4 w-4" />}
                    >
                        Registrar Pago
                    </Button>
                )}

                <Button
                    onClick={() => {
                        onClose();
                        onEdit();
                    }}
                    className="bg-pp-gold hover:bg-pp-gold/80 text-pp-brown border-transparent shadow-sm"
                    startIcon={<Edit2 className="h-4 w-4" />}
                >
                    Editar
                </Button>
            </div>
        </div>
    )
}
