# Comunica Tu Marca — Quiz de Diagnóstico

## Estructura del proyecto

```
/
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
├── api/
│   └── send-email.js        ← serverless function (Resend)
└── src/
    ├── main.jsx             ← entry point React
    ├── index.css            ← Tailwind directives
    └── App.jsx              ← el componente del quiz (comunica-quiz.jsx renombrado)
```

## Setup local

```bash
npm install
npm run dev
```

Abre en http://localhost:3000

## Variables de entorno

Crear un archivo `.env.local` en la raíz:

```
resend_api_key=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

En Vercel ya las tenés cargadas, para local las necesitás también.

## Deploy en Vercel

1. Push a GitHub
2. Importar repo en vercel.com
3. Framework preset: **Vite**
4. Build command: `npm run build`
5. Output directory: `dist`
6. Confirmar que `resend_api_key` está en Environment Variables

El archivo `vercel.json` se encarga de rutear `/api/*` a las serverless functions
y todo lo demás al `index.html` (SPA routing).

## Nota sobre el FROM_EMAIL

Mientras el dominio no esté verificado en Resend, el `from` tiene que ser
`onboarding@resend.dev`. Una vez verificado el dominio en resend.com,
cambiar en `api/send-email.js`:

```js
const FROM_EMAIL = "Manu <manu@tudominio.com>";
```
