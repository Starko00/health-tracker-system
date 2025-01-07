import { auth } from "@/auth"
export default auth((req) => {
    if (!req.auth && req.nextUrl.pathname !== "/") {
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
   
  })

  export const config = {
    matcher: ["/((?!api|_next/static|public|assets|_next/image|favicon.ico|logo-icon.svg|gradient.png).*)"],
  }
