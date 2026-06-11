import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Tractor,
  Landmark,
  Network,
  Check,
  Satellite,
  Leaf,
  CloudRain,
  MapPin,
  Activity,
  Database,
  ShieldOff,
  FileText,
  UserPlus,
  Bell,
} from 'lucide-react';
import { Logo } from '../components/Logo';
import { MockMap } from '../components/MockMap';
import { Toaster } from '../components/Toaster';
import { useReveal } from '../lib/useReveal';
import { seedProperties, dataSources, REGION } from '../lib/data';

const solutions = [
  {
    icon: Tractor,
    title: 'Para Produtores',
    text: 'Aumente a resiliência climática da safra. Monitore microclimas em tempo real e receba alertas preditivos para otimizar o manejo e reduzir perdas.',
    tone: 'bg-brand text-white',
  },
  {
    icon: Landmark,
    title: 'Para Bancos',
    text: 'Qualifique sua carteira de crédito rural. Análise de risco de portfólio com base em históricos climáticos e modelagem preditiva de produtividade.',
    tone: 'bg-soft text-body',
  },
  {
    icon: Network,
    title: 'Para Cooperativas',
    text: 'Gestão integrada de risco para todos os cooperados. Visão consolidada da exposição climática regional para direcionar insumos e seguros.',
    tone: 'bg-brand-50 text-brand',
  },
];

const journey = [
  {
    icon: MapPin,
    step: '01',
    title: 'Cadastre a propriedade',
    text: 'O cliente faz login e insere as coordenadas (latitude e longitude) do talhão de interesse.',
  },
  {
    icon: Activity,
    step: '02',
    title: 'Monitoramento diário em lote',
    text: 'O sistema vincula a área ao lote de varredura batch e cruza dados de satélite e estações todos os dias.',
  },
  {
    icon: Bell,
    step: '03',
    title: 'Gatilho aciona a notificação',
    text: 'Quando o parâmetro é atingido, a plataforma emite o alerta e gera o laudo rastreável para acionar a proteção.',
  },
];

const requisitos = [
  { id: 'RF01', icon: UserPlus, text: 'Cadastro de usuários por perfil (produtor, banco, cooperativa, seguradora).' },
  { id: 'RF02', icon: MapPin, text: 'Inserção de coordenadas de latitude e longitude da propriedade.' },
  { id: 'RF03', icon: FileText, text: 'Exportação de relatórios e laudos digitais em PDF.' },
  { id: 'RF04', icon: Bell, text: 'Emissão e envio de alertas quando o gatilho climático é acionado.' },
  { id: 'RF05', icon: Activity, text: 'Simulação de gatilhos paramétricos para novas propostas de proteção.' },
];

export default function Landing() {
  useReveal();
  return (
    <div className="relative min-h-screen overflow-hidden bg-base">
      {/* Glows ambientes */}
      <div
        className="pointer-events-none absolute -top-40 right-0 h-[520px] w-[520px] rounded-full opacity-30 blur-3xl"
        style={{ background: 'radial-gradient(circle, #22C55E 0%, transparent 65%)' }}
      />
      <div
        className="pointer-events-none absolute left-[-10%] top-[40%] h-[480px] w-[480px] rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #16A34A 0%, transparent 70%)' }}
      />

      <div className="relative z-10">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-line/70 bg-base/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <Logo />
          <nav className="hidden items-center gap-8 text-sm font-medium text-body md:flex">
            <a href="#solucoes" className="hover:text-ink">Soluções</a>
            <a href="#tecnologia" className="hover:text-ink">Tecnologia</a>
            <a href="#contato" className="hover:text-ink">Contato</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden text-sm font-semibold text-brand hover:text-brand-dark sm:block">
              Acessar Plataforma
            </Link>
            <a href="#contato" className="btn-primary px-4 py-2.5 text-sm">Fale Conosco</a>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-14 lg:grid-cols-2 lg:py-20">
        <div className="animate-fade-up">
          <span className="chip border border-brand/20 bg-brand-50 text-brand">
            <Sparkles size={13} /> <span className="font-mono text-[11px] uppercase tracking-wider">Inteligência climática avançada</span>
          </span>
          <h1 className="mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-5xl">
            Infraestrutura digital que conecta <span className="text-brand">clima</span>, produção, crédito e proteção.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-body">
            Transforme a incerteza climática em vantagem competitiva. Plataforma de alta precisão para mitigação de
            riscos no agronegócio através de dados em tempo real — com foco inicial no <strong className="text-ink">{REGION.name}</strong> e na cultura de <strong className="text-ink">{REGION.culture}</strong>.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#solucoes" className="btn-primary">Conheça as soluções</a>
            <Link to="/login" className="btn-ghost">Ver Demonstração <ArrowRight size={16} /></Link>
          </div>
          <p className="mt-6 flex items-center gap-2 text-xs text-muted">
            <ShieldOff size={14} /> A Climarisk é provedora de dados e infraestrutura — não é uma seguradora.
          </p>
        </div>

        {/* Card de monitoramento */}
        <div className="relative animate-fade-up">
          <div className="card overflow-hidden p-3">
            <MockMap properties={seedProperties} height={360} interactive={false} />
          </div>
          <div className="absolute -right-3 top-6 z-[1000] hidden rounded-xl border border-line bg-surface px-4 py-3 shadow-lift sm:block">
            <span className="label-mono">Risco Hídrico Atual</span>
            <p className="mt-1 font-mono text-lg font-bold text-brand">Baixo (12%)</p>
          </div>
          <div className="absolute -left-3 bottom-8 z-[1000] hidden rounded-xl border border-line bg-surface px-4 py-3 shadow-lift sm:block">
            <span className="label-mono">Anomalia de Temp.</span>
            <p className="mt-1 font-mono text-lg font-bold text-risk-medium">+1.2°C</p>
          </div>
        </div>
      </section>

      {/* Faixa de números */}
      <section data-reveal className="mx-auto max-w-6xl px-5 pb-6">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {[
            { v: '380+', l: 'Propriedades monitoradas' },
            { v: '1.4M', l: 'Hectares sob análise' },
            { v: '98,2%', l: 'Precisão dos gatilhos' },
            { v: '24/7', l: 'Varredura de satélite' },
          ].map((s) => (
            <div key={s.l} className="bg-surface p-6 text-center">
              <p className="text-3xl font-extrabold tracking-tight text-brand">{s.v}</p>
              <p className="mt-1 text-xs text-body">{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Soluções */}
      <section id="solucoes" data-reveal className="bg-lavender py-16">
        <div className="mx-auto max-w-6xl px-5">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-ink">Soluções para todo o ecossistema</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-body">
              Inteligência adaptada para a realidade de quem produz, quem financia e quem protege.
            </p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {solutions.map((s) => (
              <div key={s.title} className="card p-6 transition hover:shadow-lift">
                <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.tone}`}>
                  <s.icon size={20} />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-body">{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Monitoramento em tempo real */}
      <section data-reveal className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-16 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold text-ink">Monitoramento em Tempo Real</h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-body">
            Nossa interface cartográfica de alta fidelidade sobrepõe camadas de dados ambientais às áreas de produção.
            Identifique padrões de estresse hídrico e anomalias térmicas com precisão sub-talhão.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              { icon: Satellite, t: 'Imagens de satélite diárias' },
              { icon: Leaf, t: 'Índices de vegetação (NDVI)' },
              { icon: CloudRain, t: 'Previsão meteorológica hiperlocal' },
            ].map((i) => (
              <li key={i.t} className="flex items-center gap-3 border-b border-line pb-3 text-sm text-ink">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-50 text-brand">
                  <i.icon size={15} />
                </span>
                {i.t}
              </li>
            ))}
          </ul>
        </div>
        <NdviPanel />
      </section>

      {/* Como funciona — jornada */}
      <section data-reveal className="bg-ink-hero py-16 text-white">
        <div className="mx-auto max-w-6xl px-5">
          <span className="label-mono text-brand-200">Jornada do cliente</span>
          <h2 className="mt-3 text-3xl font-bold">Do cadastro ao acionamento, em três passos</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {journey.map((j) => (
              <div key={j.step} className="rounded-2xl border border-white/10 bg-surface/[0.04] p-6">
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white">
                    <j.icon size={20} />
                  </span>
                  <span className="font-mono text-3xl font-bold text-white/15">{j.step}</span>
                </div>
                <h3 className="mt-5 text-lg font-semibold">{j.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{j.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tecnologia & Fontes de dados */}
      <section id="tecnologia" data-reveal className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <span className="label-mono text-brand">Tecnologia & Fontes de Dados</span>
            <h2 className="mt-3 text-3xl font-bold text-ink">Oráculos de dados confiáveis, com redundância</h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-body">
              A precisão da Climarisk depende de fontes meteorológicas robustas. Operamos com oráculo primário e
              fallback automático: se a fonte principal falha, o sistema comuta para a contingência sem interromper a
              varredura diária (RNF11).
            </p>
            <div className="mt-6 space-y-3">
              {dataSources.map((d) => (
                <div key={d.name} className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand">
                    <Database size={18} />
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-ink">{d.name}</p>
                    <p className="text-xs text-body">{d.role}</p>
                  </div>
                  <span className="chip bg-brand-50 text-brand">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand pulse-dot" /> {d.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Requisitos do MVP */}
          <div className="card p-6">
            <span className="label-mono">Requisitos Funcionais do MVP</span>
            <h3 className="mt-2 text-xl font-bold text-ink">O que a plataforma entrega</h3>
            <ul className="mt-5 space-y-3.5">
              {requisitos.map((r) => (
                <li key={r.id} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-soft text-brand">
                    <r.icon size={16} />
                  </span>
                  <div>
                    <span className="font-mono text-xs font-semibold text-brand">{r.id}</span>
                    <p className="text-sm leading-snug text-body">{r.text}</p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex items-center gap-2 rounded-xl bg-brand-50 px-4 py-3 text-xs text-brand-dark">
              <Check size={15} /> Varredura diária em lote (batch) para reduzir custos de API e garantir rastreabilidade.
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* CTA final */}
      <section data-reveal className="mx-auto max-w-6xl px-5 pb-16">
        <div className="relative overflow-hidden rounded-3xl border border-brand/20 bg-gradient-to-br from-brand-50 to-surface p-10 text-center sm:p-14">
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{ background: 'radial-gradient(60% 80% at 50% 0%, #22C55E33, transparent 70%)' }}
          />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold text-ink sm:text-4xl">
              Pronto para transformar risco climático em decisão de negócio?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm text-body">
              Comece pelo Oeste da Bahia. Cadastre suas áreas, acompanhe gatilhos paramétricos e gere laudos
              rastreáveis — tudo em uma única plataforma.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link to="/login" className="btn-primary">Acessar a plataforma <ArrowRight size={16} /></Link>
              <a href="#solucoes" className="btn-ghost">Ver as soluções</a>
            </div>
          </div>
        </div>
      </section>

      <footer id="contato" className="bg-ink-hero py-14 text-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 md:grid-cols-4">
          <div>
            <img src="/logo.png" alt="Climarisk" className="h-10 w-auto" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/55">
              Mitigando riscos e potencializando resultados no agronegócio do {REGION.name}.
            </p>
            <Link to="/login" className="mt-5 inline-flex btn-primary px-4 py-2.5 text-sm">
              Acessar Plataforma <ArrowRight size={15} />
            </Link>
          </div>
          {[
            { h: 'Soluções', items: ['Para Produtores', 'Para Bancos', 'Para Cooperativas', 'Para Seguradoras'] },
            { h: 'Empresa', items: ['Sobre Nós', 'Carreiras', 'Imprensa', 'Contato'] },
            { h: 'Legal', items: ['Termos de Uso', 'Política de Privacidade', 'Segurança de Dados'] },
          ].map((col) => (
            <div key={col.h}>
              <span className="label-mono text-white/40">{col.h}</span>
              <ul className="mt-4 space-y-2.5 text-sm text-white/70">
                {col.items.map((i) => (
                  <li key={i} className="cursor-pointer transition hover:text-white">{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-12 flex max-w-6xl flex-col items-center justify-between gap-2 border-t border-white/10 px-5 pt-6 text-xs text-white/40 sm:flex-row">
          <span>© 2026 Climarisk. Todos os direitos reservados.</span>
          <span className="flex gap-5">
            <span className="cursor-pointer hover:text-white">LinkedIn</span>
            <span className="cursor-pointer hover:text-white">Twitter</span>
          </span>
        </div>
      </footer>
      </div>
      <Toaster />
    </div>
  );
}

/** Painel didático de NDVI (mapa de calor de vigor vegetativo, animado). */
function NdviPanel() {
  const cols = 14;
  const rows = 8;
  const cells: { v: number; i: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      // Gradiente de vigor + uma mancha seca no canto inferior direito (didático).
      const base = 0.45 + 0.4 * Math.sin((c / cols) * 2.2 + r * 0.35);
      const dry = Math.max(0, 1 - Math.hypot(c - cols * 0.78, r - rows * 0.72) / 5);
      const v = Math.max(0.05, Math.min(1, base - dry * 0.7));
      cells.push({ v, i: r * cols + c });
    }
  }
  const ndviColor = (v: number) => {
    // marrom (seco) → amarelo → verde (vigoroso)
    if (v < 0.35) return `rgb(${146 - v * 60}, ${90 + v * 120}, 40)`;
    if (v < 0.6) return `rgb(${230 - (v - 0.35) * 300}, ${190 + (v - 0.35) * 40}, ${40})`;
    return `rgb(${34 + (1 - v) * 60}, ${163 + (v - 0.6) * 60}, ${74})`;
  };

  return (
    <div className="card overflow-hidden p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <span className="label-mono flex items-center gap-1.5">
            <Leaf size={12} className="text-brand" /> Índice de Vegetação (NDVI)
          </span>
          <p className="mt-1 text-sm font-medium text-ink">Fazenda Alvorada · Gleba Norte</p>
        </div>
        <span className="animate-count rounded-lg bg-brand-50 px-2.5 py-1 text-sm font-bold text-brand">0,72</span>
      </div>

      {/* Mapa de calor */}
      <div className="grid gap-[3px] rounded-xl bg-soft p-2" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {cells.map((cell) => (
          <div
            key={cell.i}
            className="ndvi-cell aspect-square rounded-[3px]"
            style={{ background: ndviColor(cell.v), animationDelay: `${cell.i * 9}ms` }}
            title={`NDVI ${cell.v.toFixed(2)}`}
          />
        ))}
      </div>

      {/* Legenda */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted">Seco</span>
          <span className="h-2 w-28 rounded-full" style={{ background: 'linear-gradient(90deg,#8c5a28,#e6c224,#16a34a)' }} />
          <span className="text-[11px] text-muted">Vigoroso</span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[11px] text-body">
          <span className="h-2 w-2 rounded-[2px]" style={{ background: '#8c5a28' }} /> Mancha de estresse hídrico
        </span>
      </div>
    </div>
  );
}
