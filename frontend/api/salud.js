export default function handler(req, res) {
  res.status(200).json({
    ok: true,
    servicio: "sethi-api",
    engine: "Google Gemini 2.5 Flash",
    provider: "Vercel Serverless Edge",
  });
}
