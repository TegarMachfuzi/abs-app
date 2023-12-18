import { AppProps } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { Toaster } from "~/components/ui/toast/toaster";
import { NextPageWithContextProvider } from "~/page";
import NextProgress from "next-progress";

interface AppPageProps {
    session: Session | null;
}

interface AppPropsWithContext extends AppProps<AppPageProps> {
    Component: NextPageWithContextProvider;
}

const MyApp = ({
    Component,
    pageProps: { session, ...pageProps },
}: AppPropsWithContext) => {
    const getContext = Component.getContext || ((page) => page);
    return (
        <SessionProvider session={session}>
            {getContext(<Component {...pageProps} />)}
            <Toaster />
            <NextProgress color="#6d28d9" />
        </SessionProvider>
    );
};

export default api.withTRPC(MyApp);
