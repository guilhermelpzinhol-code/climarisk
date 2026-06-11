import { ShieldCheck, Clock, Eye, Download, Snowflake, AlertTriangle, Leaf } from 'lucide-react';
import { RiskBadge } from '../components/primitives';
import { toast } from '../components/Toaster';
import { alerts, riskMeta } from '../lib/data';

export default function Alerts() {
  function exportLaudo() {
    // RF03: exporta o laudo digital em PDF (via diálogo de impressão → Salvar como PDF).
    window.print();
  }

  return (
    <div className="mx-auto max-w-4xl animate-fade-up">
      <h1 className="text-2xl font-bold text-ink sm:text-3xl">Central de Laudos</h1>
      <p className="mt-1.5 max-w-2xl text-sm text-body">
        Acompanhe e valide relatórios de ocorrências climáticas em suas propriedades.
      </p>

      {/* Laudo oficial — printable */}
      <div className="printable card mt-6 overflow-hidden">
        <div className="border-b border-line bg-gradient-to-br from-brand-50 to-surface p-6">
          <div className="flex items-start justify-between">
            <div>
              <span className="label-mono">Laudo Oficial</span>
              <h2 className="mt-1 font-mono text-2xl font-bold text-ink">Sinistro: Déficit Hídrico</h2>
            </div>
            <span className="chip bg-brand-100 text-brand-dark"><ShieldCheck size={13} /> Emitido</span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <Field label="Propriedade" value="Sítio Boa Vista" />
            <Field label="Data do Evento" value="08 Jun 2026" />
            <Field label="Cultura" value="Milho" />
          </div>
        </div>

        <div className="p-6">
          <div className="rounded-xl bg-lavender p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white"><ShieldCheck size={18} /></span>
              <div className="min-w-0">
                <span className="label-mono">Hash de Validação Blockchain</span>
                <p className="truncate font-mono text-sm font-semibold text-ink">0x7F8A9B2C1D...4E5F6G7H8I</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3 border-t border-white/60 pt-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/30 text-body"><Clock size={18} /></span>
              <div>
                <span className="label-mono">Timestamp Registrado</span>
                <p className="font-mono text-sm font-semibold text-ink">2026-06-08 06:12:40 UTC</p>
              </div>
            </div>
          </div>

          <div className="no-print mt-5 grid gap-3 sm:grid-cols-2">
            <button onClick={() => toast('Abrindo pré-visualização do laudo…')} className="btn-ghost"><Eye size={16} /> Visualizar PDF</button>
            <button onClick={exportLaudo} className="btn-primary"><Download size={16} /> Baixar Laudo (RF03)</button>
          </div>
        </div>
      </div>

      {/* Ocorrências / alertas (RF04) */}
      <h3 className="mt-8 font-mono text-lg font-bold text-ink">Ocorrências Relacionadas</h3>
      <div className="mt-4 space-y-3">
        {alerts.map((a, i) => {
          const m = riskMeta[a.level];
          const Icon = i === 0 ? Snowflake : i === 1 ? AlertTriangle : Leaf;
          return (
            <div key={a.id} className="card flex gap-4 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full" style={{ background: `${m.color}14`, color: m.color }}>
                <Icon size={18} />
              </span>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold text-ink">{a.title}</p>
                  <RiskBadge level={a.level} />
                </div>
                <p className="mt-1 text-sm text-body">{a.description}</p>
                <p className="mt-1.5 font-mono text-[11px] text-muted">{a.date} · {a.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="label-mono">{label}</span>
      <p className="mt-0.5 font-mono text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}
