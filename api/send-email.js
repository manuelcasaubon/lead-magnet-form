// api/send-email.js
// Vercel Serverless Function — Envío de emails via Resend
// Variables de entorno requeridas en Vercel:
//   resend_api_key  →  tu API key de Resend

const FROM_EMAIL = "Manu <manu@info.comunicatumarca.com>";

// ─── Templates HTML ────────────────────────────────────────────────────────

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

// ─── Handler principal ─────────────────────────────────────────────────────

export default async function handler(req, res) {
  // Solo aceptar POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  // CORS — permitir llamadas desde tu dominio en producción.
  // Ajustá el origin según donde esté deployado el quiz.
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { profile, toEmail, instagram } = req.body ?? {};

  // Validaciones básicas
  if (!profile || !toEmail) {
    return res.status(400).json({ error: "Faltan campos requeridos: profile, toEmail" });
  }

  const template = EMAIL_TEMPLATES[profile];
  if (!template) {
    return res.status(400).json({ error: `Perfil desconocido: ${profile}` });
  }

  const apiKey = process.env.resend_api_key;
  if (!apiKey) {
    console.error("resend_api_key no configurada en las variables de entorno");
    return res.status(500).json({ error: "Configuración de servidor incompleta" });
  }

  try {
    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [toEmail],
        subject: template.subject,
        html: template.html({ instagram: instagram ?? "" }),
      }),
    });

    const data = await resendResponse.json();

    if (!resendResponse.ok) {
      console.error("Error de Resend:", data);
      return res.status(resendResponse.status).json({
        error: data?.message ?? "Error al enviar el email",
      });
    }

    return res.status(200).json({ success: true, id: data.id });

  } catch (err) {
    console.error("Error inesperado:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
