// middleware.ts
import { User } from "@prisma/client";
import { withAuth } from "next-auth/middleware";

// This function can be marked `async` if using `await` inside
export default withAuth({
    callbacks: {
        authorized: (param) => {
            const { token, req } = param;
            if (token) {
                const user = token.user as User;
                return true;
            }
            if (
                req.nextUrl.pathname.startsWith("/auth/") ||
                req.nextUrl.pathname.startsWith("/images/")
            ) {
                return true;
            }
            return false;
        },
    },
});

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        "/:path*",
        "/((?!api|_next/static|_next/*.png|favicon.ico|_next/images|).*)",
    ],
};
