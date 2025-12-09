import Image from 'next/image'

interface PageHeaderProps {
    title: string
    subtitle?: string
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
    return (
        <div className="flex items-center gap-4 mb-6">
            <div className="relative h-12 w-12 shrink-0">
                <Image
                    src="/images/logo.png"
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
