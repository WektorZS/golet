import { getAuth, isAuthConfigured } from "@/lib/auth/server"

function unavailable() {
  return Response.json({ error: "Authentication is not configured" }, { status: 503 })
}

type AuthRouteContext = { params: Promise<{ path: string[] }> }

export async function GET(request: Request, context: AuthRouteContext) {
  if (!isAuthConfigured()) return unavailable()
  return getAuth().handler().GET(request, context)
}

export async function POST(request: Request, context: AuthRouteContext) {
  if (!isAuthConfigured()) return unavailable()
  return getAuth().handler().POST(request, context)
}
