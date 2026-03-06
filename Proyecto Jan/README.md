# NoRisk

Aplicacion web de analisis de cartera (acciones/ETFs) construida con Next.js App Router + TypeScript + Tailwind + Recharts.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Recharts
- Persistencia local con `localStorage`
- Dataset local en `src/data/tickers.ts` (sin APIs externas)

## Ejecutar en local

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

## Funcionalidades MVP incluidas

- Landing publica (`/`) con secciones de producto y pricing visual.
- Zona de producto (`/app`) con sidebar + topbar + reset demo.
- Onboarding de perfil de riesgo (5 preguntas y resultado guardado).
- CRUD de cartera con autocompletado de tickers locales.
- Investor Score 0-100 con logica exacta y breakdown transparente.
- Portfolio DNA con 3 graficos (sector, region, tipo activo).
- Alertas inteligentes por severidad (Alta/Media/Baja) con CTA y links internos.
- Modo Anti-panico con escenarios Normal/Volatil/Crisis, checklist y plan de accion.
- Comparacion anonima con 100 carteras mock por perfil y percentil.
- Asistente mock con respuestas por reglas y disclaimer legal.

## Persistencia localStorage

Claves usadas:

- `norisk:profile`
- `norisk:positions`
- `norisk:scenario`
- `norisk:checklist`

## Legal

La app muestra en UI el texto:

`NoRisk no proporciona asesoramiento financiero. Informacion educativa.`

## Extension futura (sin implementar)

- **APIs reales de mercado**: sustituir `priceNow` local por proveedor real (por ejemplo endpoint server-side), manteniendo el mismo contrato de tipos para no romper UI.
- **App movil Expo/React Native**: reutilizar logica de negocio (`src/lib/*`, `src/types/*`) en un paquete compartido y recrear pantallas con React Native + charts equivalentes.
