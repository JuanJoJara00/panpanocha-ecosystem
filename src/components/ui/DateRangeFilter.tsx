import React from 'react'
import Button from '@/components/ui/Button'
import { Search } from 'lucide-react'

interface DateRangeFilterProps {
    startDate: string
    endDate: string
    onStartDateChange: (date: string) => void
    onEndDateChange: (date: string) => void
    onFilter: () => void
    loading?: boolean
}

export default function DateRangeFilter({
    startDate,
    endDate,
    onStartDateChange,
    onEndDateChange,
    onFilter,
    loading = false
}: DateRangeFilterProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-2 items-end sm:items-center bg-gray-50 p-2 rounded-xl border border-gray-200">
            <div className="flex flex-col">
                <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Desde</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => onStartDateChange(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pp-gold/50"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-[10px] text-gray-500 font-bold uppercase ml-1">Hasta</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => onEndDateChange(e.target.value)}
                    className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-pp-gold/50"
                />
            </div>
            <Button
                onClick={onFilter}
                className="h-[38px] px-4"
                startIcon={<Search className="w-4 h-4" />}
                disabled={loading}
            >
                {loading ? '...' : 'Filtrar'}
            </Button>
        </div>
    )
}
