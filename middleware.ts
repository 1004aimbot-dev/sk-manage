import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// /admin 하위는 로그인 필수 + role 기반 허용
export default withAuth(
    function middleware(req: NextRequest) {
        const token = (req as any).nextauth?.token as
            | { role?: string }
            | undefined;

        const pathname = req.nextUrl.pathname;

        // token.role 기반 세부 제어 예시
        // staff는 settings 접근 금지
        if (pathname.startsWith("/admin/settings") && token?.role === "staff") {
            const url = req.nextUrl.clone();
            url.pathname = "/admin";
            url.searchParams.set("error", "forbidden");
            return NextResponse.redirect(url);
        }

        return NextResponse.next();
    },
    {
        callbacks: {
            // 인증 여부(로그인 여부)
            authorized: ({ token }) => !!token,
        },
        pages: {
            signIn: "/login",
        },
    }
);

export const config = {
    matcher: ["/admin/:path*"],
};
