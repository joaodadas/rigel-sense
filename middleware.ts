// middleware.ts
import {
  clerkMiddleware,
  createRouteMatcher,
  currentUser,
} from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';

const isPublicRoute = createRouteMatcher([
  '/',
  '/login',
  '/sign-in(.*)',
  '/sign-up(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  const user = await currentUser();

  if (user) {
    redirect('/dashboard'); // 🔒 já está autenticado? vai direto
  }
  if (!isPublicRoute(req)) {
    const session = await auth();
    if (!session.userId) {
      redirect('/login'); // or throw new Error('Unauthorized');
    }
  }
});

export const config = {
  matcher: [
    // Ignora arquivos estáticos e internos do Next.js
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)', // Sempre rodar em rotas da API
  ],
};
