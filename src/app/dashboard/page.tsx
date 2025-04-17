// src/app/dashboard/page.tsx
'use client';

import { SidebarLayout } from '@/components/layouts/sidebar-layout';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const mockTreatments = [
  { id: '1', name: 'Pós-Operatório João', date: '13/04/2025' },
  { id: '2', name: 'Tratamento Ana', date: '10/04/2025' },
];

export default function DashboardPage() {
  return (
    <SidebarLayout>
      <div className="flex h-16 shrink-0 items-center gap-2 px-4">
        <Breadcrumb title="Dashboard" />
      </div>

      <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
        {/* Cards superiores */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader>
              <CardTitle>Total de Tratamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">12</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tratamentos ativos</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">8</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Tratamentos finalizados</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">4</span>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Próximos agendamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <span className="text-2xl font-bold">3</span>
            </CardContent>
          </Card>
        </div>

        {/* Tratamentos recentes */}
        <div className="rounded-xl bg-muted/50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Tratamentos recentes</h2>
            <Button variant="link" size="sm">
              Ver todos
            </Button>
          </div>
          <ul className="space-y-3">
            {mockTreatments.map((t) => (
              <li key={t.id} className="border p-4 rounded-lg bg-background">
                <p className="font-medium">{t.name}</p>
                <p className="text-sm text-muted-foreground">
                  Criado em {t.date}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </SidebarLayout>
  );
}
