import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for static files and API routes
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // If already on mobile route, allow it
  if (pathname.startsWith('/mobile')) {
    return NextResponse.next()
  }

  // Detect mobile devices
  const userAgent = request.headers.get('user-agent') || ''
  const isMobile = detectMobileDevice(userAgent)
  
  // If mobile device detected, redirect to /mobile
  if (isMobile) {
    const mobileUrl = new URL('/mobile', request.url)
    return NextResponse.redirect(mobileUrl)
  }

  return NextResponse.next()
}

function detectMobileDevice(userAgent: string): boolean {
  // Comprehensive mobile detection
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile safari|mobile/i
  
  // Special handling for iPadOS in mobile Safari mode
  const isIPad = /ipad/i.test(userAgent)
  const isMobileSafari = /mobile safari/i.test(userAgent)
  
  // iPadOS in mobile Safari mode should be treated as mobile
  if (isIPad && isMobileSafari) {
    return true
  }
  
  // Standard mobile detection
  return mobileRegex.test(userAgent)
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
