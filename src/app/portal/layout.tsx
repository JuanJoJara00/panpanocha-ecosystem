'use client'

import Sidebar from '@/components/ui/Sidebar'
import { usePathname } from 'next/navigation'

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const isLoginPage = pathname === '/portal/login'

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {!isLoginPage && <Sidebar />}
            <main className={`flex-grow ${!isLoginPage ? 'p-4 md:p-8' : ''} overflow-x-hidden`}>
                <div className={`${!isLoginPage ? 'max-w-7xl mx-auto' : 'w-full'} text-gray-800`}>
                    {children}
                </div>
            </main>
        </div>
    )
}
