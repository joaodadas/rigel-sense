'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export function LoginForm() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [email, setEmail] = useState('medico@rigel.com');
  const [password, setPassword] = useState('1234');
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Credenciais inválidas.');
      return;
    }

    router.push('/dashboard');
  }

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Faça login na sua conta</h1>
        <p className="text-sm text-muted-foreground">
          Insira seu email abaixo para entrar na sua conta.
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="medico@rigel.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Senha</Label>
            <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Esqueceu sua senha?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            placeholder="••••••"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full">
          Login
        </Button>
      </div>

      <div className="text-center text-sm text-muted-foreground mt-4">
        Não tem uma conta?{' '}
        <a href="#" className="underline underline-offset-4">
          Contato
        </a>
      </div>
    </form>
  );
}
