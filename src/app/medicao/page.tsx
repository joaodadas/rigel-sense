'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PlugZap, Plug } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { SidebarLayout } from '@/components/layouts/sidebar-layout';

const Header = () => (
  <header className="border-b px-6 py-4 flex items-center justify-between">
    <div className="text-xl font-bold tracking-tight">RigelSense</div>
    <div className="flex gap-4 items-center">
      <Input type="text" placeholder="Buscar..." className="w-[200px]" />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="h-8 w-8 cursor-pointer">
            <AvatarImage src="https://github.com/shadcn.png" alt="avatar" />
            <AvatarFallback>MD</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>
            Dr. João
            <br />
            joao@clinicamedica.com
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Perfil</DropdownMenuItem>
          <DropdownMenuItem>Configurações</DropdownMenuItem>
          <DropdownMenuItem>Sair</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  </header>
);

export default function MedicaoPage() {
  const [conectado] = useState(false);
  const [sensores] = useState<Record<string, string>>({});
  const [historico] = useState<
    { sensor: string; valor: number; timestamp: number }[]
  >([]);
  const [erro] = useState('');
  const [anotacao, setAnotacao] = useState('');
  const [circunferencia, setCircunferencia] = useState('');
  const [regiao, setRegiao] = useState('');
  type Medicao = {
    timestamp: string;
    sensores: Record<string, string>;
    anotacao: string;
    regiao: string;
    circunferencia: string;
  };
  const [, setMedicoes] = useState<Medicao[]>([]);

  function salvarMedicao() {
    if (!regiao || !circunferencia || !anotacao)
      return alert('Preencha todos os campos');
    const nova = {
      timestamp: new Date().toISOString(),
      sensores: { ...sensores },
      anotacao,
      regiao,
      circunferencia,
    };
    setMedicoes((m) => [...m, nova]);
    alert('Medição salva!');
  }

  const sensoresData = (sensor: string) => {
    return historico
      .filter((h) => h.sensor === sensor)
      .slice(-10)
      .map((h) => ({
        name: new Date(h.timestamp).toLocaleTimeString('pt-BR', {
          minute: '2-digit',
          second: '2-digit',
        }),
        value: h.valor,
      }));
  };

  return (
    <SidebarLayout>
      <div className="min-h-screen bg-background text-foreground">
        <Header />
        <main className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Nova Medição</h1>
            <Badge variant={conectado ? 'default' : 'destructive'}>
              {conectado ? (
                <span className="flex items-center gap-1">
                  <PlugZap size={16} /> Conectado
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <Plug size={16} /> Desconectado
                </span>
              )}
            </Badge>
          </div>

          <div className="flex gap-4">
            <Button onClick={() => alert('Conectar')}>
              Conectar Dispositivo
            </Button>
            <Button variant="secondary">Iniciar Medição</Button>
            <Button variant="outline" onClick={salvarMedicao}>
              Salvar
            </Button>
          </div>

          {erro && <p className="text-red-500 text-sm">{erro}</p>}

          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {['A', 'B', 'C', 'D', 'E'].map((sensor) => (
              <Card key={sensor}>
                <CardHeader>
                  <CardTitle>Sensor {sensor}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">
                    {sensores[sensor] ?? '--'}
                  </p>
                  <div className="h-24 mt-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sensoresData(sensor)}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <Tooltip />
                        <Bar dataKey="value" fill="#4f46e5" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Separator />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="regiao">Região do Corpo</Label>
              <Select onValueChange={setRegiao} value={regiao}>
                <SelectTrigger id="regiao">
                  <SelectValue placeholder="Escolha a região" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="abdomen">Abdômen</SelectItem>
                  <SelectItem value="coxa">Coxa</SelectItem>
                  <SelectItem value="torax">Tórax</SelectItem>
                  <SelectItem value="braco">Braço</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="circ">Circunferência (cm)</Label>
              <Input
                id="circ"
                value={circunferencia}
                onChange={(e) => setCircunferencia(e.target.value)}
                placeholder="Ex: 45.2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notas">Anotações</Label>
              <Textarea
                id="notas"
                rows={6}
                className="min-h-[100px]"
                value={anotacao}
                onChange={(e) => setAnotacao(e.target.value)}
                placeholder="Observações clínicas..."
              />
            </div>
          </div>
        </main>
      </div>
    </SidebarLayout>
  );
}
