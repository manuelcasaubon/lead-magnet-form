import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  ArrowRight, ArrowLeft, Mail, Instagram, Send, Check, Loader2,
  Play, AlertCircle
} from 'lucide-react';

/* ============================================================
   COMUNICA TU MARCA — Diagnóstico Quiz · Brutalist Manifesto
   Mobile-first · Poppins · Multi-select · 3D card result
   Resend wired (mover sendDiagnosticEmail al backend antes de
   producción — ver nota arriba de la función).
============================================================ */

// ────────────────────────────────────────────────────────────
// RESEND — Envío de emails (3 templates · 1 por perfil)
// ────────────────────────────────────────────────────────────
//
// ⚠ IMPORTANTE — leer antes de testear:
// La API key está hardcodeada acá abajo, pero Resend bloquea por
// CORS las llamadas directas desde el navegador. Eso significa
// que `sendDiagnosticEmail()` va a fallar con error de CORS si se
// ejecuta desde React en el browser. Cuando llegue el momento de
// activar el envío real, mové esta función a un endpoint backend
// (Vercel/Netlify serverless function, Next.js API route, o un
// pequeño server Node). El código de la función no cambia — solo
// dónde corre.
//
// Para reemplazar `from`: una vez que verifiques tu dominio en
// Resend, cambiá FROM_EMAIL a "Manu <manu@tudominio.com>". Hasta
// entonces se puede testear con el sandbox de Resend.
// ────────────────────────────────────────────────────────────

const FROM_EMAIL = "Comunica Tu Marca <onboarding@resend.dev>";

// HTML templates — uno por perfil. Estilados inline para máxima
// compatibilidad con clientes de email (Gmail, Outlook, Apple Mail).
const EMAIL_TEMPLATES = {
  A: {
    subject: "Tu diagnóstico está listo — esto es lo que encontramos",
    html: ({ instagram }) => buildEmailHtml({
      profile: "A",
      heading: "Tu diagnóstico está listo.",
      paragraphs: [
        "Tenés el conocimiento. Tenés la experiencia. Tenés algo genuino para decir. El problema no es lo que creés.",
        "El cuello de botella está en tres lugares concretos: <strong>claridad de mensaje</strong> (qué decir y para quién), <strong>encontrar la voz</strong> (sacar el bloqueo frente a cámara), y <strong>un sistema mínimo para crear</strong> sin abandonar a mitad de camino.",
        "Te grabé un video de 5 minutos donde te muestro exactamente cómo trabajo este proceso con alguien en tu misma situación — la historia de Yaco, que tenía algo para decir pero no arrancaba.",
      ],
      videoTitle: "Cómo trabajo este proceso con alguien en tu misma situación",
      ps: "El mejor momento para arrancar era hace un año. El segundo mejor momento es hoy.",
      instagram,
    }),
  },
  B: {
    subject: "Encontramos el problema real — no es lo que creés",
    html: ({ instagram }) => buildEmailHtml({
      profile: "B",
      heading: "Encontramos el problema real.",
      paragraphs: [
        "Estás creando contenido. Pero cuando lo ves, algo no cierra. No te reconocés. Y la mayoría de la gente diagnostica esto como problema de técnica — y se equivoca.",
        "El problema es <strong>identidad comunicativa</strong>. La diferencia entre comunicar desde la fórmula y comunicar desde quién sos. El plan se mueve en tres ejes: <strong>encontrar tu voz real</strong>, <strong>construir mensaje desde adentro</strong>, y <strong>transmitir en vez de informar</strong>.",
        "Te grabé un video de 5 minutos sobre exactamente esto — la diferencia entre comunicar desde la técnica y comunicar desde la identidad. La historia de Fer, que creaba pero no se sentía ella misma.",
      ],
      videoTitle: "La diferencia entre comunicar desde la técnica y comunicar desde la identidad",
      ps: "El contenido que borrás no es malo. Es que todavía no encontraste tu voz. Eso tiene solución.",
      instagram,
    }),
  },
  C: {
    subject: "Tu marca existe. El problema es otro",
    html: ({ instagram }) => buildEmailHtml({
      profile: "C",
      heading: "Tu marca existe. El problema es otro.",
      paragraphs: [
        "Tenés presencia. Tenés contenido. Tenés una marca. Pero algo no está funcionando como debería. Hay una brecha entre lo que pensás y lo que el mundo recibe.",
        "El plan es concreto: <strong>auditar el mensaje</strong> (encontrar dónde se pierde la profundidad), <strong>profundizar la comunicación de impacto</strong>, y <strong>alinear estrategia con posicionamiento</strong> — el lugar que querés ocupar.",
        "Te grabé un video de 5 minutos sobre qué separa una marca que genera impacto real de una que acumula contenido sin resultados. La historia de Andre, que tenía marca activa pero sin dirección.",
      ],
      videoTitle: "Qué separa una marca que genera impacto real de una que acumula contenido sin resultados",
      ps: "El problema nunca fue el volumen de contenido. Fue la profundidad desde donde comunicás. Eso se trabaja.",
      instagram,
    }),
  },
};

function buildEmailHtml({ heading, paragraphs, videoTitle, ps, instagram }) {
  return `<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#efebe2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#efebe2;padding:40px 20px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border:2px solid #0a0a0a;">
        <tr><td style="padding:40px 32px 32px 32px;">
          <p style="margin:0 0 20px 0;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#dc2626;font-weight:700;">Comunica Tu Marca</p>
          <h1 style="margin:0 0 24px 0;font-size:32px;line-height:1.1;color:#0a0a0a;font-weight:900;letter-spacing:-0.02em;text-transform:uppercase;">${heading}</h1>
          ${paragraphs.map(p => `<p style="margin:0 0 18px 0;font-size:16px;line-height:1.6;color:#0a0a0a;">${p}</p>`).join("")}
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:28px 0;background:#0a0a0a;border:2px solid #0a0a0a;">
            <tr><td style="padding:20px;">
              <p style="margin:0 0 6px 0;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#dc2626;font-weight:700;">▶ Video personalizado · 5 min</p>
              <p style="margin:0;font-size:14px;line-height:1.4;color:#ffffff;font-weight:600;">${videoTitle}</p>
            </td></tr>
          </table>
          <table cellpadding="0" cellspacing="0" style="margin:0 0 24px 0;">
            <tr><td style="background:#dc2626;border:2px solid #0a0a0a;box-shadow:4px 4px 0 #0a0a0a;">
              <a href="https://comunicatumarca.com/llamada" style="display:block;padding:14px 28px;color:#ffffff;text-decoration:none;font-size:14px;font-weight:800;letter-spacing:1px;text-transform:uppercase;">Agendar llamada de claridad →</a>
            </td></tr>
          </table>
          <p style="margin:0 0 4px 0;font-size:13px;line-height:1.5;color:#5c574e;font-style:italic;border-top:1px solid #d4d0c5;padding-top:20px;">PD: ${ps}</p>
          ${instagram ? `<p style="margin:16px 0 0 0;font-size:11px;color:#5c574e;">Mientras tanto, te dejo seguido en Instagram (${instagram}) — Manu</p>` : ""}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

// Envía el email del perfil correspondiente al usuario.
// ⚠ ESTA FUNCIÓN NO VA A FUNCIONAR DESDE EL BROWSER (CORS).
// Cuando la pases a un backend (serverless, Node, Next API route),
// el código se mantiene exactamente igual — solo cambia el contexto
// de ejecución.
async function sendDiagnosticEmail({ profile, toEmail, instagram }) {
  const response = await fetch("/api/send-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ profile, toEmail, instagram }),
  });
 
  const data = await response.json();
 
  if (!response.ok) {
    throw new Error(data?.error ?? `Error ${response.status}`);
  }
 
  return data;
}

// ────────────────────────────────────────────────────────────
// DATA — Preguntas y resultados (compartido entre variantes)
// ────────────────────────────────────────────────────────────

const QUESTIONS = [
  {
    title: "El punto de partida",
    question: "¿Cuál de estas frases te describe mejor hoy?",
    options: [
      { text: "Tengo algo para decir pero nunca terminé de arrancar con mi marca", profiles: ["A"] },
      { text: "Ya estoy creando contenido pero siento que no me representa de verdad", profiles: ["B"] },
      { text: "Tengo una marca activa pero no estoy generando el impacto o las oportunidades que quiero", profiles: ["C"] },
      { text: "Publico seguido pero no entiendo por qué no convierte", profiles: ["B", "C"] },
    ],
  },
  {
    title: "El mayor freno",
    question: "Cuando pensás en tu marca personal, ¿qué es lo que más te frena?",
    options: [
      { text: "No sé bien qué decir ni para quién", profiles: ["A"] },
      { text: "Sé lo que quiero decir pero no me sale natural cuando me grabo", profiles: ["B"] },
      { text: "Publico pero no genero la conexión ni los resultados que busco", profiles: ["C"] },
      { text: "Me falta sistema — arranco y abandono", profiles: ["A", "B"] },
    ],
  },
  {
    title: "La relación con la cámara",
    question: "¿Cómo te sentís cuando te grabás o hablás de lo que hacés?",
    options: [
      { text: "Me bloqueo — algo se apaga cuando enciendo la cámara", profiles: ["A"] },
      { text: "Lo hago pero cuando me veo no me reconozco, no se siente mío", profiles: ["B"] },
      { text: "Me siento cómodo pero siento que no transmito lo que realmente soy", profiles: ["C"] },
      { text: "No tengo problema con la cámara, mi problema es otro", profiles: ["C"] },
    ],
  },
  {
    title: "El objetivo real",
    question: "Si tu marca personal funcionara como querés, ¿qué cambiaría primero?",
    options: [
      { text: "Conseguiría más clientes o trabajo sin tener que salir a buscarlos", profiles: ["A", "C"] },
      { text: "Sería reconocido por lo que sé y lo que soy en mi sector", profiles: ["C"] },
      { text: "Podría vivir de lo que me apasiona comunicar", profiles: ["B"] },
      { text: "Generaría oportunidades — charlas, entrevistas, colaboraciones", profiles: ["C"] },
    ],
  },
  {
    title: "El contenido",
    question: "¿Qué pasa cuando intentás crear contenido?",
    options: [
      { text: "Tengo ideas pero no arranco — lo postergo indefinidamente", profiles: ["A"] },
      { text: "Arranco pero a mitad del camino lo borro o lo abandono", profiles: ["B"] },
      { text: "Lo publico pero no estoy conforme — siento que podría ser mejor", profiles: ["B"] },
      { text: "Publico con regularidad pero los resultados no acompañan", profiles: ["C"] },
    ],
  },
  {
    title: "El tiempo",
    question: "¿Hace cuánto estás pensando en mejorar o arrancar con tu marca personal?",
    options: [
      { text: "Hace menos de 3 meses", profiles: ["A"] },
      { text: "Entre 3 meses y 1 año", profiles: ["A", "B"] },
      { text: "Más de 1 año", profiles: ["B", "C"] },
      { text: "Hace años — y sigo en el mismo lugar", profiles: ["C"] },
    ],
  },
  {
    title: "El diferencial",
    question: "¿Qué sentís que tenés para decirle al mundo?",
    options: [
      { text: "Tengo experiencia y conocimiento real pero no sé cómo comunicarlo", profiles: ["A"] },
      { text: "Tengo una pasión genuina pero no sé si le importa a alguien", profiles: ["A", "B"] },
      { text: "Tengo una historia que puede ayudar a otros pero me cuesta mostrarla", profiles: ["B"] },
      { text: "Tengo claridad de mensaje pero no logro que llegue como quiero", profiles: ["C"] },
    ],
  },
];

const RESULTS = {
  A: {
    code: "A",
    name: "El Comunicador en Potencia",
    tagline: "Tenés el conocimiento. Falta arrancar.",
    diagnosis: "Tenés el conocimiento. Tenés la experiencia. Tenés algo genuino para decir. El problema no es lo que creés.",
    subject: "Tu diagnóstico está listo — esto es lo que encontramos",
    plan: [
      { step: "01", title: "Claridad de mensaje", desc: "Definir qué decir y para quién" },
      { step: "02", title: "Encontrar la voz", desc: "Sacar el bloqueo frente a cámara" },
      { step: "03", title: "Sistema mínimo", desc: "Crear sin abandonar a mitad de camino" },
    ],
    quote: "El mejor momento para arrancar era hace un año. El segundo mejor momento es hoy.",
    videoTitle: "Cómo trabajo este proceso con alguien en tu misma situación",
    caseStudy: "La historia de Yaco",
  },
  B: {
    code: "B",
    name: "El Comunicador Bloqueado",
    tagline: "Creás. Pero no te reconocés.",
    diagnosis: "Estás creando contenido. Pero cuando lo ves, algo no cierra. No te reconocés. El problema no es técnica — es identidad comunicativa.",
    subject: "Encontramos el problema real — no es lo que creés",
    plan: [
      { step: "01", title: "Voz real", desc: "Comunicar desde quien sos, no desde la fórmula" },
      { step: "02", title: "Mensaje desde adentro", desc: "Que cada pieza venga de un lugar genuino" },
      { step: "03", title: "Transmitir, no informar", desc: "Conectar antes que enseñar" },
    ],
    quote: "El contenido que borrás no es malo. Es que todavía no encontraste tu voz. Eso tiene solución.",
    videoTitle: "La diferencia entre comunicar desde la técnica y comunicar desde la identidad",
    caseStudy: "La historia de Fer",
  },
  C: {
    code: "C",
    name: "El Comunicador Estancado",
    tagline: "Tenés marca. Falta impacto.",
    diagnosis: "Tenés presencia. Tenés contenido. Tenés una marca. Pero algo no está funcionando como debería. Hay una brecha entre lo que pensás y lo que el mundo recibe.",
    subject: "Tu marca existe. El problema es otro",
    plan: [
      { step: "01", title: "Auditar el mensaje", desc: "Encontrar dónde se pierde la profundidad" },
      { step: "02", title: "Comunicación de impacto", desc: "Profundizar lo que ya estás haciendo" },
      { step: "03", title: "Estrategia + posicionamiento", desc: "Alinear la marca con el lugar que querés ocupar" },
    ],
    quote: "El problema nunca fue el volumen de contenido. Fue la profundidad desde donde comunicás. Eso se trabaja.",
    videoTitle: "Qué separa una marca que genera impacto real de una que acumula contenido sin resultados",
    caseStudy: "La historia de Andre",
  },
};

// ────────────────────────────────────────────────────────────
// LÓGICA — Cálculo de perfil ganador
// ────────────────────────────────────────────────────────────

function calculateProfile(responses) {
  const score = { A: 0, B: 0, C: 0 };
  const decisive = [0, 1, 4]; // preguntas 1, 2 y 5 pesan más
  responses.forEach((selected, idx) => {
    if (!selected || selected.length === 0) return;
    selected.forEach((opt) => {
      const weight = (decisive.includes(idx) ? 1.5 : 1) / opt.profiles.length;
      opt.profiles.forEach((p) => { score[p] += weight; });
    });
  });
  // Tiebreak: C > B > A
  const order = ["C", "B", "A"];
  let winner = "A", best = -Infinity;
  order.forEach((p) => {
    if (score[p] > best) { best = score[p]; winner = p; }
  });
  return { winner, score };
}

// ────────────────────────────────────────────────────────────
// HOOK — Tarjeta 3D con tracking del mouse
// ────────────────────────────────────────────────────────────

function use3DCard(intensity = 14) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, mx: 0.5, my: 0.5, active: false });

  const onMove = (e) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setTilt({
      rx: (y - 0.5) * -intensity,
      ry: (x - 0.5) * intensity,
      mx: x, my: y, active: true,
    });
  };
  const onLeave = () => setTilt({ rx: 0, ry: 0, mx: 0.5, my: 0.5, active: false });

  return { ref, tilt, onMove, onLeave };
}

// ────────────────────────────────────────────────────────────
// VALIDACIÓN — Email + IG
// ────────────────────────────────────────────────────────────

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());


// ════════════════════════════════════════════════════════════
// VARIANTE B · BRUTALIST MANIFESTO  (POPPINS · MOBILE-FIRST)
// Crema/hueso · Bold gigante · Asimetría · Vermellón accent
// ════════════════════════════════════════════════════════════

function VariantB({ state, setState, reset }) {
  const { step, responses, contact } = state;
  const PALETTE = {
    bg: "#efebe2",
    paper: "#ffffff",
    ink: "#0a0a0a",
    muted: "#5c574e",
    accent: "#dc2626",
    line: "#0a0a0a",
  };

  const totalForm = 8;
  const formStep = step >= 1 && step <= 8 ? step : null;

  const next = () => setState((s) => ({ ...s, step: s.step + 1 }));
  const prev = () => setState((s) => ({ ...s, step: Math.max(0, s.step - 1) }));
  const toggleResponse = (qIdx, opt) => {
    setState((s) => {
      const r = [...s.responses];
      const cur = r[qIdx] || [];
      r[qIdx] = cur.includes(opt) ? cur.filter((o) => o !== opt) : [...cur, opt];
      return { ...s, responses: r };
    });
  };
  const setContact = (patch) => setState((s) => ({ ...s, contact: { ...s.contact, ...patch } }));

  useEffect(() => {
    if (step === 9) {
      const t = setTimeout(() => setState((s) => ({ ...s, step: 10 })), 2400);
      return () => clearTimeout(t);
    }
  }, [step]);

  const result = useMemo(() => {
    if (step !== 10) return null;
    const { winner } = calculateProfile(responses);
    return RESULTS[winner];
  }, [step, responses]);

  return (
    <div
      className="min-h-screen w-full"
      style={{ background: PALETTE.bg, color: PALETTE.ink, fontFamily: '"Poppins", system-ui, sans-serif' }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
        .vb-bold { font-family: "Poppins", sans-serif; font-weight: 900; letter-spacing: -0.03em; }
        @keyframes vb-fade { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        .vb-fade { animation: vb-fade .5s cubic-bezier(.2,.7,.2,1) both; }
        @keyframes vb-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .vb-marquee { animation: vb-marquee 30s linear infinite; }
      `}</style>

      {/* TOP BAR — marquee */}
      <div className="border-b-2 overflow-hidden" style={{ borderColor: PALETTE.ink, background: PALETTE.ink, color: PALETTE.bg }}>
        <div className="vb-marquee whitespace-nowrap py-2 text-[11px] uppercase tracking-[0.3em] font-medium flex">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex shrink-0">
              {Array.from({ length: 8 }).map((_, j) => (
                <span key={j} className="px-6 flex items-center gap-3">
                  Comunica Tu Marca <span style={{ color: PALETTE.accent }}>●</span> Diagnóstico personal <span style={{ color: PALETTE.accent }}>●</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* HEADER + Progress */}
      <header className="border-b-2 sticky top-0 z-10" style={{ borderColor: PALETTE.ink, background: PALETTE.bg }}>
        <div className="max-w-7xl mx-auto px-5 md:px-12 py-4 md:py-5 flex items-center justify-between">
          <div className="vb-bold text-lg md:text-2xl leading-none flex items-baseline gap-1">
            COMUNICA<span style={{ color: PALETTE.accent }}>/</span>TU<span style={{ color: PALETTE.accent }}>/</span>MARCA
          </div>
          <div className="text-[10px] md:text-xs uppercase font-medium tracking-widest">
            {step === 0 && "[ INTRO ]"}
            {formStep && `[ ${formStep.toString().padStart(2, "0")} / ${totalForm} ]`}
            {step === 9 && "[ CALCULANDO ]"}
            {step === 10 && "[ RESULTADO ]"}
          </div>
        </div>
        {/* Block progress */}
        {formStep && (
          <div className="grid grid-cols-8 border-t-2" style={{ borderColor: PALETTE.ink }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-2 border-r-2 last:border-r-0"
                style={{
                  borderColor: PALETTE.ink,
                  background: i < formStep ? PALETTE.accent : "transparent",
                }}
              />
            ))}
          </div>
        )}
      </header>

      <main className="max-w-7xl mx-auto px-5 md:px-12 py-10 md:py-16 min-h-[calc(100vh-180px)]">

        {/* WELCOME */}
        {step === 0 && (
          <div className="vb-fade">
            <h1 className="vb-bold text-[44px] sm:text-6xl md:text-7xl lg:text-[96px] leading-[0.92] uppercase">
              Analicemos<br />
              el cuello<br />
              de botella<br />
              <span style={{ color: PALETTE.accent }}>de tu marca</span><br />
              personal.
            </h1>

            <p className="mt-6 md:mt-8 text-base md:text-lg max-w-xl leading-relaxed font-medium" style={{ color: PALETTE.muted }}>
              Esto es un diagnóstico completo de tu marca personal. Al finalizar, te enviaremos un plan de acción paso a paso según tu caso, analizado por el equipo de Comunica Tu Marca al email.
            </p>

            {/* 3 cards (informativos, NO botones) */}
            <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              {[
                { num: "01", title: "RECOLECCIÓN", desc: "Email + Instagram para enviarte el plan personalizado." },
                { num: "02", title: "ANÁLISIS",    desc: "7 preguntas multi-select sobre tu marca actual." },
                { num: "03", title: "DIAGNÓSTICO", desc: "Plan paso a paso y video personalizado al email." },
              ].map((c, i) => (
                <div
                  key={i}
                  className="border-2 p-4 md:p-5 flex md:flex-col items-start gap-4 md:gap-3"
                  style={{ borderColor: PALETTE.ink, background: PALETTE.paper }}
                >
                  <div className="vb-bold text-[40px] md:text-5xl leading-none shrink-0" style={{ color: PALETTE.accent }}>
                    {c.num}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="vb-bold text-sm md:text-base tracking-wide uppercase">{c.title}</div>
                    <div className="h-px w-8 my-2" style={{ background: PALETTE.ink }} />
                    <div className="text-xs md:text-sm leading-snug font-medium" style={{ color: PALETTE.muted }}>
                      {c.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="mt-8 md:mt-12">
              <button
                onClick={next}
                className="group w-full md:w-auto inline-flex items-center justify-between md:justify-center gap-4 md:gap-6 px-6 md:px-12 py-5 md:py-7 border-2 transition-all hover:translate-x-[-3px] hover:translate-y-[-3px] active:translate-x-0 active:translate-y-0"
                style={{
                  borderColor: PALETTE.ink, background: PALETTE.ink, color: PALETTE.bg,
                  boxShadow: `6px 6px 0 ${PALETTE.accent}`,
                }}
              >
                <span className="vb-bold text-2xl md:text-4xl leading-none uppercase">Empezar</span>
                <ArrowRight size={26} className="transition-transform group-hover:translate-x-1 shrink-0" />
              </button>
            </div>
          </div>
        )}

        {/* CAPTURE */}
        {step === 1 && (
          <div className="vb-fade max-w-2xl">
            <div className="text-xs uppercase tracking-widest font-medium mb-4">[ Paso 01 / 08 ]</div>
            <h2 className="vb-bold text-[40px] sm:text-5xl md:text-7xl leading-[0.92] uppercase">
              ¿A dónde<br />
              mando tu<br />
              <span style={{ color: PALETTE.accent }}>diagnóstico?</span>
            </h2>
            <p className="mt-5 md:mt-6 text-base max-w-md leading-relaxed font-medium" style={{ color: PALETTE.muted }}>
              Cuando termines el test te llega un email con tu plan personalizado.
            </p>

            <div className="mt-8 space-y-3">
              <FieldB icon={<Mail size={16} />} label="EMAIL" placeholder="vos@ejemplo.com"
                value={contact.email} onChange={(v) => setContact({ email: v })} palette={PALETTE} required />
              <FieldB icon={<Instagram size={16} />} label="INSTAGRAM" placeholder="@tuusuario"
                value={contact.instagram} onChange={(v) => setContact({ instagram: v })} palette={PALETTE} required />
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <button
                disabled={!isEmail(contact.email) || !contact.instagram.trim()}
                onClick={next}
                className="w-full px-6 py-5 vb-bold text-2xl md:text-3xl uppercase border-2 transition-all hover:translate-x-[-3px] hover:translate-y-[-3px] disabled:opacity-30 disabled:hover:translate-x-0 disabled:hover:translate-y-0 flex items-center justify-between"
                style={{
                  borderColor: PALETTE.ink, background: PALETTE.accent, color: PALETTE.paper,
                  boxShadow: `6px 6px 0 ${PALETTE.ink}`,
                }}
              >
                Continuar <ArrowRight size={24} />
              </button>
              <button onClick={prev} className="text-xs uppercase tracking-widest font-medium text-left hover:underline self-start">
                ← Volver al inicio
              </button>
            </div>
          </div>
        )}

        {/* QUESTIONS */}
        {step >= 2 && step <= 8 && (() => {
          const qIdx = step - 2;
          const q = QUESTIONS[qIdx];
          const selected = responses[qIdx] || [];
          const canContinue = selected.length > 0;
          return (
            <div className="vb-fade grid md:grid-cols-12 gap-5 md:gap-10" key={qIdx}>
              <div className="md:col-span-5">
                <div className="vb-bold text-[32vw] md:text-[14vw] lg:text-[12vw] leading-[0.78]" style={{ color: PALETTE.accent }}>
                  {(qIdx + 1).toString().padStart(2, "0")}
                </div>
                <div className="text-xs uppercase tracking-widest font-medium border-t-2 pt-3 mt-1" style={{ borderColor: PALETTE.ink }}>
                  {q.title.toUpperCase()}
                </div>
              </div>

              <div className="md:col-span-7">
                <h2 className="vb-bold text-2xl md:text-4xl lg:text-5xl leading-[1] uppercase mb-6 md:mb-8">
                  {q.question}
                </h2>
                <div className="space-y-2.5">
                  {q.options.map((opt, i) => {
                    const isSel = selected.includes(opt);
                    return (
                      <button
                        key={i}
                        onClick={() => toggleResponse(qIdx, opt)}
                        className="w-full text-left flex items-start gap-3 px-4 md:px-5 py-4 md:py-5 border-2 transition-all"
                        style={{
                          borderColor: PALETTE.ink,
                          background: isSel ? PALETTE.ink : PALETTE.paper,
                          color: isSel ? PALETTE.paper : PALETTE.ink,
                          boxShadow: isSel ? `4px 4px 0 ${PALETTE.accent}` : `3px 3px 0 ${PALETTE.ink}`,
                          transform: isSel ? "translate(-2px, -2px)" : "none",
                        }}
                      >
                        <span className="text-xs font-bold tracking-widest shrink-0 mt-1"
                          style={{ color: isSel ? PALETTE.accent : PALETTE.muted }}>
                          [{String.fromCharCode(65 + i)}]
                        </span>
                        <span className="text-base md:text-lg leading-snug font-medium flex-1">{opt.text}</span>
                        {isSel && <Check size={18} className="shrink-0 mt-1" style={{ color: PALETTE.accent }} />}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-6 md:mt-8 flex items-center justify-between gap-3">
                  <button onClick={prev} className="text-xs uppercase tracking-widest font-medium hover:underline shrink-0">
                    ← Anterior
                  </button>
                  <button
                    onClick={next}
                    disabled={!canContinue}
                    className="flex-1 md:flex-none px-6 py-4 vb-bold text-lg md:text-2xl uppercase border-2 transition-all hover:translate-x-[-3px] hover:translate-y-[-3px] disabled:opacity-30 disabled:hover:translate-x-0 disabled:hover:translate-y-0 inline-flex items-center justify-center gap-3"
                    style={{
                      borderColor: PALETTE.ink, background: PALETTE.ink, color: PALETTE.paper,
                      boxShadow: `5px 5px 0 ${PALETTE.accent}`,
                    }}
                  >
                    Continuar <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          );
        })()}

        {/* LOADING */}
        {step === 9 && (
          <div className="vb-fade flex flex-col items-center justify-center py-16 md:py-20 text-center px-4">
            <div className="vb-bold text-6xl md:text-8xl lg:text-9xl leading-none uppercase" style={{ color: PALETTE.accent }}>
              Calcu<wbr />lando.
            </div>
            <div className="mt-8 grid grid-cols-3 gap-2 w-full max-w-sm">
              {["A", "B", "C"].map((p, i) => (
                <div key={p} className="border-2 p-3 text-center vb-bold text-base md:text-lg uppercase" style={{
                  borderColor: PALETTE.ink, background: PALETTE.paper,
                  animation: `vb-fade .8s ease ${i * 0.3}s both`,
                }}>
                  Perfil {p}
                </div>
              ))}
            </div>
            <div className="mt-6 text-xs uppercase tracking-widest font-medium" style={{ color: PALETTE.muted }}>
              Cruzando 7 respuestas con 3 patrones
            </div>
          </div>
        )}

        {/* RESULT */}
        {step === 10 && result && (
          <ResultB result={result} contact={contact} reset={reset} palette={PALETTE} />
        )}
      </main>

      <footer className="border-t-2 mt-12" style={{ borderColor: PALETTE.ink, background: PALETTE.ink, color: PALETTE.bg }}>
        <div className="max-w-7xl mx-auto px-5 md:px-12 py-5 flex items-center justify-center text-xs uppercase tracking-widest font-medium">
          <span>© Comunica Tu Marca</span>
        </div>
      </footer>
    </div>
  );
}

function FieldB({ icon, label, placeholder, value, onChange, palette, required }) {
  return (
    <div className="border-2 p-3 md:p-4" style={{ borderColor: palette.ink, background: palette.paper }}>
      <div className="flex items-center justify-between mb-1.5">
        <div className="flex items-center gap-2">
          <span style={{ color: palette.accent }}>{icon}</span>
          <span className="text-xs tracking-widest font-bold">{label}</span>
        </div>
        {required && <span className="text-[10px] font-bold" style={{ color: palette.accent }}>★</span>}
      </div>
      <input
        type="text" placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent text-base md:text-lg outline-none font-medium"
        style={{ color: palette.ink, fontFamily: '"Poppins", sans-serif' }}
      />
    </div>
  );
}

function ResultB({ result, contact, reset, palette }) {
  const card = use3DCard(15);
  const profileLabel = { A: "POTENCIA", B: "BLOQUEADO", C: "ESTANCADO" }[result.code];
  const [sendState, setSendState] = useState("idle"); // idle | sending | sent | error
  const [sendError, setSendError] = useState(null);

  const handleSend = async () => {
    setSendState("sending");
    setSendError(null);
    try {
      await sendDiagnosticEmail({
        profile: result.code,
        toEmail: contact.email,
        instagram: contact.instagram,
      });
      setSendState("sent");
    } catch (err) {
      setSendState("error");
      setSendError(err.message || String(err));
    }
  };

  const buttonContent = {
    idle:    { label: "Enviar ahora",     icon: <Send size={22} />,                     bg: palette.ink },
    sending: { label: "Enviando...",      icon: <Loader2 size={22} className="animate-spin" />, bg: palette.ink },
    sent:    { label: "Enviado ✓",        icon: <Check size={22} />,                    bg: "#16a34a" },
    error:   { label: "Reintentar envío", icon: <AlertCircle size={22} />,              bg: palette.accent },
  }[sendState];

  return (
    <div className="vb-fade">
      <div className="grid md:grid-cols-12 gap-6 md:gap-8 items-start">
        <div className="md:col-span-5">
          <div className="text-xs uppercase tracking-widest font-bold mb-3 inline-block px-3 py-1 border-2"
            style={{ borderColor: palette.ink, background: palette.accent, color: palette.paper }}>
            ◆ PERFIL {result.code} · {profileLabel}
          </div>
          <h2 className="vb-bold text-4xl md:text-6xl lg:text-7xl leading-[0.9] mb-5 uppercase">
            {result.name}.
          </h2>
          <p className="text-xl md:text-2xl font-bold leading-tight mb-5" style={{ color: palette.accent }}>
            {result.tagline}
          </p>
          <p className="text-base leading-relaxed mb-8 font-medium" style={{ color: palette.muted }}>
            {result.diagnosis}
          </p>
          <button
            onClick={handleSend}
            disabled={sendState === "sending" || sendState === "sent"}
            className="w-full px-6 py-5 vb-bold text-xl md:text-2xl uppercase border-2 transition-all hover:translate-x-[-3px] hover:translate-y-[-3px] disabled:hover:translate-x-0 disabled:hover:translate-y-0 flex items-center justify-between"
            style={{ borderColor: palette.ink, background: buttonContent.bg, color: palette.paper, boxShadow: `6px 6px 0 ${palette.accent}` }}>
            {buttonContent.label} {buttonContent.icon}
          </button>
          {sendState === "error" && sendError && (
            <div className="mt-3 p-3 border-2 text-xs leading-snug" style={{ borderColor: palette.accent, background: "#fef2f2", color: palette.accent }}>
              <strong className="block mb-1 uppercase tracking-wide">Error de envío</strong>
              <span className="font-mono break-all">{sendError}</span>
              <span className="block mt-2 text-[11px]" style={{ color: palette.muted }}>
                Si ves un error de CORS, esperado: la API de Resend tiene que llamarse desde un backend, no desde el browser. Revisar el comentario en el código.
              </span>
            </div>
          )}
          {sendState === "sent" && (
            <div className="mt-3 p-3 border-2 text-xs leading-snug" style={{ borderColor: "#16a34a", background: "#f0fdf4", color: "#15803d" }}>
              <strong className="block uppercase tracking-wide">Email enviado a {contact.email}</strong>
              <span className="block mt-1 font-medium">Revisá tu bandeja de entrada (y el spam por las dudas).</span>
            </div>
          )}
          <button onClick={reset} className="mt-4 text-xs uppercase tracking-widest font-medium hover:underline">
            ↺ Hacer el test otra vez
          </button>
        </div>

        {/* 3D CARD */}
        <div
          className="md:col-span-7"
          style={{ perspective: "1400px" }}
          onMouseMove={card.onMove}
          onMouseLeave={card.onLeave}
        >
          <div
            ref={card.ref}
            className="relative w-full transition-transform duration-150 ease-out"
            style={{
              aspectRatio: "4 / 5",
              transformStyle: "preserve-3d",
              transform: `rotateX(${card.tilt.rx}deg) rotateY(${card.tilt.ry}deg)`,
              background: palette.paper,
              border: `3px solid ${palette.ink}`,
              boxShadow: `8px 8px 0 ${palette.accent}, 8px 8px 0 3px ${palette.ink}`,
            }}
          >
            <div className="border-b-2 px-4 md:px-6 py-2 md:py-3 flex items-center justify-between"
              style={{ borderColor: palette.ink, background: palette.ink, color: palette.paper, transform: "translateZ(20px)" }}>
              <span className="text-[10px] uppercase tracking-widest font-medium">EMAIL · DRAFT</span>
              <span className="text-[10px] uppercase tracking-widest font-medium" style={{ color: palette.accent }}>● LISTO</span>
            </div>

            <div className="p-4 md:p-6 lg:p-8" style={{ transform: "translateZ(0px)" }}>
              <div className="grid grid-cols-3 gap-2 mb-4 md:mb-5" style={{ transform: "translateZ(40px)" }}>
                <Stat label="PARA" value={contact.email.split("@")[0] || "—"} palette={palette} />
                <Stat label="DE" value="Manu" palette={palette} />
                <Stat label="ID" value={`#${result.code}-${Date.now().toString().slice(-4)}`} palette={palette} />
              </div>

              <div className="border-t-2 pt-4 md:pt-5" style={{ borderColor: palette.ink, transform: "translateZ(50px)" }}>
                <div className="text-[10px] uppercase tracking-widest font-medium mb-2">ASUNTO</div>
                <h3 className="vb-bold text-lg md:text-2xl lg:text-3xl leading-tight uppercase">
                  {result.subject}
                </h3>
              </div>

              <div className="mt-4 md:mt-5 space-y-2" style={{ transform: "translateZ(35px)" }}>
                {result.plan.map((p, i) => (
                  <div key={i} className="flex items-stretch border-2" style={{ borderColor: palette.ink }}>
                    <div className="vb-bold text-lg md:text-2xl px-3 py-2 border-r-2 flex items-center"
                      style={{ borderColor: palette.ink, background: palette.accent, color: palette.paper }}>
                      {p.step}
                    </div>
                    <div className="px-3 py-2 flex-1 min-w-0">
                      <div className="vb-bold text-xs md:text-sm leading-tight uppercase">{p.title}</div>
                      <div className="text-[11px] md:text-xs leading-snug font-medium" style={{ color: palette.muted }}>{p.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 md:mt-5 border-t-2 pt-4 italic font-bold text-xs md:text-sm leading-snug"
                style={{ borderColor: palette.ink, color: palette.accent, transform: "translateZ(25px)" }}>
                "{result.quote}"
              </div>

              <div className="mt-4 flex items-center gap-3 border-2 p-2 md:p-2.5" style={{ borderColor: palette.ink, transform: "translateZ(45px)" }}>
                <div className="w-9 h-9 flex items-center justify-center shrink-0" style={{ background: palette.ink }}>
                  <Play size={14} fill={palette.accent} color={palette.accent} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="vb-bold text-[11px] md:text-xs uppercase">Video adjunto · 5 min</div>
                  <div className="text-[9px] md:text-[10px] uppercase tracking-wider truncate font-medium" style={{ color: palette.muted }}>
                    {result.caseStudy}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-5 text-[11px] md:text-xs uppercase tracking-widest font-medium flex items-center gap-2 break-all">
            ↗ DESTINATARIO: <span className="font-bold">{contact.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, palette }) {
  return (
    <div className="border-2 p-2 min-w-0" style={{ borderColor: palette.ink }}>
      <div className="text-[9px] tracking-widest font-medium" style={{ color: palette.muted }}>{label}</div>
      <div className="vb-bold text-xs md:text-sm truncate uppercase">{value}</div>
    </div>
  );
}


// ════════════════════════════════════════════════════════════
// APP — Wrapper de estado · Renderiza VariantB
// ════════════════════════════════════════════════════════════

export default function App() {
  const [state, setState] = useState({
    step: 0,
    responses: Array.from({ length: 7 }, () => []),
    contact: { email: "", instagram: "" },
  });

  const reset = () => setState({
    step: 0,
    responses: Array.from({ length: 7 }, () => []),
    contact: { email: "", instagram: "" },
  });

  return <VariantB state={state} setState={setState} reset={reset} />;
}
