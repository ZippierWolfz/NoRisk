import Link from "next/link";

const sections = [
  {
    title: "Investor Score",
    copy: "Evalua concentracion, diversificacion, riesgo y exposicion regional con una formula transparente.",
  },
  {
    title: "Portfolio DNA",
    copy: "Visualiza en segundos como se reparte tu cartera por sectores, regiones y tipo de activo.",
  },
  {
    title: "Alertas inteligentes",
    copy: "Panel priorizado por severidad con acciones concretas para reducir riesgos evitables.",
  },
  {
    title: "Anti-panico",
    copy: "Cuando sube la volatilidad, activa una guia calmada para decidir con criterio y no por impulso.",
  },
  {
    title: "Comparacion anonima",
    copy: "Compara tu score frente a carteras similares sin exponer datos personales.",
  },
];

export default function LandingPage() {
  return (
    <main>
      <section className="bg-hero-grid border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="mb-4 inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              Fintech UI azul/blanco
            </p>
            <h1 className="text-4xl font-black text-slate-900 sm:text-5xl">
              NoRisk convierte datos de cartera en decisiones claras y accionables.
            </h1>
            <p className="mt-5 text-lg text-slate-600">
              Simula escenarios, entiende tu riesgo real y recibe recomendaciones con lenguaje simple.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/app"
                className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700"
              >
                Probar NoRisk
              </Link>
              <a
                href="#pricing"
                className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Ver planes
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((item) => (
            <article key={item.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
              <h2 className="mb-2 text-xl font-bold text-slate-900">{item.title}</h2>
              <p className="text-sm leading-relaxed text-slate-600">{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="pricing" className="border-y border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900">Pricing</h2>
          <p className="mt-2 text-slate-600">Visual informativo para demo.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 p-6 shadow-card">
              <p className="text-sm font-semibold text-slate-500">Free</p>
              <p className="mt-2 text-4xl font-black text-slate-900">EUR 0</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                <li>- Investor Score basico</li>
                <li>- Portfolio DNA</li>
                <li>- Alertas esenciales</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6 shadow-card">
              <p className="text-sm font-semibold text-brand-700">Pro</p>
              <p className="mt-2 text-4xl font-black text-slate-900">EUR 19</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>- Comparacion anonima avanzada</li>
                <li>- Escenarios extendidos</li>
                <li>- Reportes y exportacion (futuro)</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-4 py-10 text-sm text-slate-600 sm:px-6 lg:px-8">
        <p className="font-semibold text-slate-800">Sobre el proyecto</p>
        <p className="mt-2">
          NoRisk es una demo educativa de UX fintech para analisis local de carteras sin APIs externas.
        </p>
        <p className="mt-2 text-xs text-slate-500">
          NoRisk no proporciona asesoramiento financiero. Informacion educativa.
        </p>
      </footer>
    </main>
  );
}
