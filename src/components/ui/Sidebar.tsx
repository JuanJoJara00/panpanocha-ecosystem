'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
    LayoutDashboard,
    Package,
    Truck,
    ChefHat,
    Wallet,
    DollarSign,
    ShoppingBag,
    ClipboardList,
    BarChart3,
    LogOut,
    Users,
    MapPin,
    Bike,
    Plus
} from 'lucide-react'
import { twMerge } from 'tailwind-merge'
import Image from 'next/image'
import Modal from '@/components/ui/Modal'

export default function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false)
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleLogout = async () => {
        setIsLoading(true)
        try {
            await supabase.auth.signOut()
            router.push('/portal/login')
        } catch (error) {
            console.error('Error signing out:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Hide sidebar on the main dashboard page
    // The path could be /portal or /portal/dashboard depending on config, checking both to be safe
    if (pathname === '/portal/dashboard' || pathname === '/portal') {
        return null
    }

    // Must match main dashboard options
    // Must match main dashboard options
    const navigation = [
        { name: 'Menú Principal', href: '/portal/dashboard', icon: LayoutDashboard },
        { name: 'Cierre de Caja', href: '/portal/cierre-caja', icon: DollarSign },
        { name: 'Inventario materia prima', href: '/portal/inventario-general', icon: Package }, // Hub Inventory + Products 
        { name: 'Pedidos', href: '/portal/compras', icon: Truck }, // Hub Orders + Supplier
        { name: 'Gestión', href: '/portal/gestion', icon: BarChart3 }, // Hub Branches + Payroll + Schedule
        { name: 'Domicilios', href: '/portal/domicilios', icon: Bike },
        { name: 'Manuales', href: '/portal/manuales', icon: ClipboardList },
        { name: 'Admin', href: '/portal/admin', icon: Users },
    ]

    return (
        <aside className="w-64 bg-white border-r border-gray-100 hidden md:flex flex-col h-screen sticky top-0 overflow-y-auto z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
            <div className="p-6 flex flex-col items-center justify-center text-center gap-4 border-b border-gray-50/50">
                <div className="relative h-24 w-24 shrink-0 transition-transform hover:scale-105 duration-300">
                    <Image
                        src="/images/logo_v2.png"
                        alt="Portal PanPanocha"
                        fill
                        className="object-contain drop-shadow-sm"
                        priority
                    />
                </div>
                <div>
                    <Link href="/portal/dashboard" className="block text-lg font-extrabold text-pp-brown font-display uppercase tracking-widest leading-tight hover:opacity-80 transition-opacity">
                        PORTAL <br /><span className="text-pp-gold text-xl">PANPANOCHA</span>
                    </Link>
                </div>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {navigation.map((item) => {
                    const isActive = pathname.startsWith(item.href) && item.href !== '/portal/dashboard' || pathname === item.href
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={twMerge(
                                'relative flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-2xl transition-all duration-200 group font-display uppercase tracking-wide overflow-hidden',
                                isActive
                                    ? 'bg-pp-gold/15 text-pp-brown shadow-sm ring-1 ring-pp-gold/50'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-pp-brown'
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-pp-gold rounded-l-full" />
                            )}
                            <item.icon className={twMerge(
                                "h-5 w-5 transition-colors z-10",
                                isActive ? "text-pp-brown" : "text-gray-400 group-hover:text-pp-gold"
                            )} />
                            <span className="z-10">{item.name}</span>
                        </Link>
                    )
                })}
            </nav>

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-100 space-y-3 bg-gray-50/50">
                <button
                    onClick={() => setIsAccountModalOpen(true)}
                    className="flex items-center gap-3 px-4 py-3 w-full text-sm font-bold text-gray-600 bg-white border border-gray-200 rounded-full hover:bg-gray-50 hover:text-pp-brown hover:border-pp-gold/50 transition-all font-display uppercase tracking-wide shadow-sm group"
                >
                    <div className="p-1 bg-gray-100 rounded-full group-hover:bg-pp-gold/10 transition-colors">
                        <Users className="h-4 w-4" />
                    </div>
                    Gestionar Cuentas
                </button>

                <button
                    onClick={() => setIsLogoutModalOpen(true)}
                    className="flex items-center gap-3 px-4 py-3 w-full text-sm font-bold text-white bg-red-500 rounded-full hover:bg-red-600 transition-colors font-display uppercase tracking-wide shadow-sm"
                >
                    <div className="p-1 bg-white/20 rounded-full">
                        <LogOut className="h-4 w-4" />
                    </div>
                    Cerrar Sesión
                </button>
            </div>

            {/* Logout Confirmation Modal */}
            <Modal
                isOpen={isLogoutModalOpen}
                onClose={() => setIsLogoutModalOpen(false)}
                title="¿Cerrar Sesión?"
            >
                <div className="space-y-4">
                    <p className="text-gray-600">
                        ¿Estás seguro de que deseas salir del sistema?
                    </p>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            onClick={() => setIsLogoutModalOpen(false)}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleLogout}
                            disabled={isLoading}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors shadow-sm flex items-center gap-2"
                        >
                            {isLoading ? 'Saliendo...' : 'Sí, Cerrar Sesión'}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Account Switcher Modal */}
            <Modal
                isOpen={isAccountModalOpen}
                onClose={() => setIsAccountModalOpen(false)}
                title="Gestionar Cuentas"
            >
                <div className="space-y-4">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-4">
                        <div className="h-10 w-10 bg-pp-gold text-pp-brown rounded-full flex items-center justify-center font-bold text-lg">
                            PP
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-gray-900">PanPanocha Admin</p>
                            <p className="text-sm text-gray-500">admin@panpanocha.com</p>
                        </div>
                        <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-md">
                            ACTUAL
                        </div>
                    </div>

                    <div className="border-t border-gray-100 my-4"></div>

                    <p className="text-sm text-gray-500 font-medium px-1">Otras cuentas guardadas</p>

                    <button className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all text-left">
                        <div className="h-10 w-10 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center">
                            <Plus className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="font-bold text-gray-700">Agregar otra cuenta</p>
                            <p className="text-sm text-gray-400">Iniciar sesión con otro usuario</p>
                        </div>
                    </button>
                </div>
            </Modal>
        </aside>
    )
}
