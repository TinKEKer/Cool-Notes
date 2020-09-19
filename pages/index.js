import { useEffect } from "react";
import Router from "next/router";

const redirectTo = "/signin";

const RootPage = () => {
    useEffect(() => Router.push(redirectTo));
    return null;
};
RootPage.getInitialProps = (ctx) => {
    if (ctx.req) {
        ctx.res.writeHead(302, { Location: redirectTo });
        ctx.res.end();
    }
};

export default RootPage;