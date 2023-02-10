import { NextRequest, NextResponse } from "next/server";

export const config = {
    /*
     * The way you configure your matcher items depend on your route structure.
     * E.g. if you decide to put all your posts under `/posts/[postSlug]`,
     * you'll need to add an extra matcher item "/posts/:path*".
     * The reason we do this is to prevent the middleware from matching absolute paths
     * like "demo.vercel.pub/_sites/steven" and have the content from `steven` be served.
     *
     * Here's a breakdown of each matcher item:
     * 1. "/"               - Matches the root path of the site.
     * 2. "/([^/.]*)"       - Matches all first-level paths (e.g. demo.vercel.pub/platforms-starter-kit)
     *                        but exclude `/public` files by excluding paths containing `.` (e.g. /logo.png)
     * 3. "/site/:path*"    – for app.vercel.pub/site/[siteId]
     * 4. "/post/:path*"    – for app.vercel.pub/post/[postId]
     * 5. "/_sites/:path*"  – for all custom hostnames under the `/_sites/[site]*` dynamic route (demo.vercel.pub, platformize.co)
     *                        we do this to make sure "demo.vercel.pub/_sites/steven" is not matched and throws a 404.
     */
    matcher: [
        "/([^/.]*)",
        "/_sites/:path*",
        "/",
        "/c/:path*",
        "/p/:path*",
        "/([^/.]*)/:path*",
    ],
};

export default function middleware(req: NextRequest) {
    const url = req.nextUrl;
    // Get hostname of request (e.g. demo.vercel.pub, demo.localhost:3000)
    let hostname = req.headers.get("host");

    /*  You have to replace ".vercel.pub" with your own domain if you deploy this example under your domain.
      You can also use wildcard subdomains on .vercel.app links that are associated with your Vercel team slug
      in this case, our team slug is "platformize", thus *.platformize.vercel.app works. Do note that you'll
      still need to add "*.platformize.vercel.app" as a wildcard domain on your Vercel dashboard. */
    const currentHost =
        process.env.NODE_ENV === "production"
            ? hostname
                  .replace(`.vercel.pub`, "")
                  .replace(`.platformize.vercel.app`, "")
                  .replace(`.imobiliariasimob.com.br`, "")
                  .replace(`.imo7.com.br`, "")
            : hostname.replace(`.localhost:3000`, "");
    // rewrites for app pages
    if (currentHost == "app") {
        if (
            url.pathname === "/login" &&
            (req.cookies.get("next-auth.session-token") ||
                req.cookies.get("__Secure-next-auth.session-token"))
        ) {
            url.pathname = "/";
            return NextResponse.redirect(url);
        }
        url.pathname = `/app${url.pathname}`;
        return NextResponse.rewrite(url);
    }

    // rewrite root application to `/home` folder
    // if (hostname === "localhost:3000") {
    //   console.log(4);
    //   url.pathname = `/home${url.pathname}`;
    //   return NextResponse.rewrite(url);
    // }
    console.log(url.route);
    // rewrite everything else to `/_sites/[site] dynamic route
    if (url.pathname.includes("/img/")) {
        return NextResponse.rewrite(url);
    }
    if (url.pathname.includes("_next")) {
        return NextResponse.rewrite(url);
    }
    if (url.pathname.includes("/_sites/[site]/")) {
        url.pathname = url.pathname.replace("/_sites/[site]/", "/");
    }
    if (url.route && url.route.includes("/_sites/[site]/")) {
        url.route = url.route.replace("/_sites/[site]/", "/");
    }

    url.pathname = `/_sites/${currentHost}${url.pathname}`;
    console.log(url);
    if (url.pathname.includes("/_sites/imo7.com.br/")) {
        url.pathname = url.pathname.replace("/_sites/imo7.com.br/", "/");
    } else if (url.pathname.includes("/_sites/localhost:3000/")) {
        url.pathname = url.pathname.replace("/_sites/localhost:3000/", "/");
    } else if (url.pathname.includes("/_sites/www/")) {
        url.pathname = url.pathname.replace("/_sites/www/", "/");
    }
    if (url.pathname.includes(`/_sites/${url.host}/api/`)) {
        url.pathname = url.pathname.replace(
            `/_sites/${url.host}/api/`,
            "/api/"
        );
    }
    console.log(1);
    return NextResponse.rewrite(url);
}
