import { next } from '@vercel/functions';

declare const process: {
  env: Record<string, string | undefined>;
};

const basicAuthUser = process.env.BASIC_AUTH_USER;
const basicAuthPassword = process.env.BASIC_AUTH_PASSWORD;

export default function middleware(request: Request) {
  if (!basicAuthUser || !basicAuthPassword) {
    return next();
  }

  const authorization = request.headers.get('authorization');
  const expectedAuthorization = `Basic ${btoa(`${basicAuthUser}:${basicAuthPassword}`)}`;

  if (authorization === expectedAuthorization) {
    return next();
  }

  return new Response('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Mogu", charset="UTF-8"',
    },
  });
}

export const config = {
  matcher: '/:path*',
};
