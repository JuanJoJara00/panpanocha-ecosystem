
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        'https://dafdejwjgieiuazxmzba.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRhZmRlandqZ2llaXVhenhtemJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwNDI2NjIsImV4cCI6MjA4MDYxODY2Mn0.S9vZtPjkT4mPqJESsCKUTVZZHay6FpbnB0jIw4pQ6jE',
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    response.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    const { data: { user } } = await supabase.auth.getUser()

    if (request.nextUrl.pathname.startsWith('/portal')) {
        // Exclude login page from protection
        if (request.nextUrl.pathname === '/portal/login') {
            if (user) {
                // If already logged in, redirect to dashboard
                return NextResponse.redirect(new URL('/portal/dashboard', request.url))
            }
            return response
        }

        if (!user) {
            // If not logged in, redirect to login
            const redirectUrl = request.nextUrl.clone()
            redirectUrl.pathname = '/portal/login'
            redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
            return NextResponse.redirect(redirectUrl)
        }
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
