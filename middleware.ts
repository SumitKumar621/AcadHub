import { NextRequest, NextResponse } from 'next/server'

const publicRoutes = ['/login', '/api/auth/login', '/api/auth/register', '/api/auth/me']
const protectedRoutes = ['/dashboard', '/books', '/analytics', '/profile']

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  if (!isProtectedRoute) {
    return NextResponse.next()
  }

  // Check for auth token in cookies
  const token = request.cookies.get('lf_auth_token')?.value

  if (!token) {
    // Redirect to login if accessing protected route without token
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
