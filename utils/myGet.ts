import fetch from 'isomorphic-unfetch';
import Router from 'next/router';
import {NextPageContext} from 'next'


export async function myGet(url:string, ctx:NextPageContext) {
    const cookie = ctx.req?.headers.cookie;

    console.log('email',ctx.req?.headers)

    const resp = await fetch(url, {
        headers: {
            cookie: cookie!
      }
}
    );

    if(resp.status === 401 && !ctx.req) {
        await Router.replace('/signin');
        return {};
    }

    if(resp.status === 401 && ctx.req) {
        ctx.res?.writeHead(302, {
            Location: '/signin'
        });
        ctx.res.end();
        return;
    }
    const json = await resp.json()
    return json;
}