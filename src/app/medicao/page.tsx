/// <reference lib="dom" />
'use client';

import { useState } from 'react';

interface Navigator {
  serial: any;
}

export default function MedicaoPage() {
  const [log, setLog] = useState<string[]>([]);
  const [erro, setErro] = useState<string>('');

  async function conectarDispositivo() {
    try {
      const porta = await navigator.serial.requestPort();
      await porta.open({ baudRate: 115200 });

      const decoder = new TextDecoderStream();
      await porta.readable?.pipeTo(decoder.writable);
      const reader = decoder.readable.getReader();

      setLog((l) => [...l, '✅ Conectado. Lendo dados...']);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        if (value) setLog((l) => [...l, value.trim()]);
      }

      reader.releaseLock();
    } catch (err: any) {
      setErro('Erro ao conectar: ' + err.message);
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Conexão com Rigel Sense</h1>
      <button
        onClick={conectarDispositivo}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        Conectar dispositivo
      </button>

      {erro && <p className="text-red-500">{erro}</p>}

      <div className="mt-4 max-h-80 overflow-y-auto bg-muted p-4 rounded text-sm whitespace-pre-wrap">
        {log.map((linha, idx) => (
          <div key={idx}>{linha}</div>
        ))}
      </div>
    </div>
  );
}
