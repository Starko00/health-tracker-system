import { auth } from "@/auth"
import { UserExtended } from "./actions/auth/types"
export default auth((req) => {
    if (!req.auth && req.nextUrl.pathname !== "/" && !req.nextUrl.pathname.includes("/book") && !req.nextUrl.pathname.includes("/portal")) {
      const newUrl = new URL("/", req.nextUrl.origin)
      return Response.redirect(newUrl)
    }else if(req.auth && req.nextUrl.pathname === "/"){
      const newUrl = new URL("/dashboard", req.nextUrl.origin)
      return Response.redirect(newUrl)
    }
    
  
    
    if(req.auth && (req.auth.user?.name === null || req.auth.user?.name === undefined || req.auth.user?.image === null || req.auth.user?.image === undefined) && req.nextUrl.pathname !== "/first-time-setup"){
      const newUrl = new URL("/first-time-setup", req.nextUrl.origin)
      return Response.redirect(newUrl)
    }else if(req.auth && req.nextUrl.pathname === "/first-time-setup"){
      const newUrl = new URL("/dashboard", req.nextUrl.origin)
      return Response.redirect(newUrl)
    }
    if(req.auth && !(req.auth.user as UserExtended).workspaceId && req.nextUrl.pathname !== "/workspace-setup"){
      const newUrl = new URL("/workspace-setup", req.nextUrl.origin)
      return Response.redirect(newUrl)
    }if(req.auth && (req.auth.user as UserExtended).workspaceId && req.nextUrl.pathname === "/workspace-setup"){
      const newUrl = new URL("/dashboard", req.nextUrl.origin)
      return Response.redirect(newUrl)
    }
   
  })

  export const config = {
    matcher: ["/((?!api|_next/static|public|assets|_next/image|favicon.ico|logo-icon.svg|gradient.png).*)"],
  }
