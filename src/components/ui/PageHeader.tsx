'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface PageHeaderProps {
    title: string
    subtitle?: string
    backUrl?: string
}

export default function PageHeader({ title, subtitle, backUrl }: PageHeaderProps) {
    return (
        <div className="flex items-center gap-4 mb-6">
            {backUrl && (
                <Link href={backUrl} className="p-2 -ml-2 text-gray-400 hover:text-pp-brown hover:bg-gray-100 rounded-full transition-colors group" title="Volver">
                    <ArrowLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
                </Link>
            )}

            <div className="relative h-12 w-12 shrink-0">
                <Image
                    src="/images/logo_v2.png"
                    alt="Logo PanPanocha"
                    fill
                    className="object-contain"
                />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-pp-brown font-display uppercase tracking-tight">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-sm text-gray-500 font-medium">
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    )
}
