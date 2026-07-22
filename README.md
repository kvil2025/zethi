# ✦ Sethi — Mentoría Arquetípica e IA Cósmica (MVP Web)

Aplicación web completa que cruza tres capas de información del usuario para entregarle un mentor de vida ultra-personalizado con IA: su perfil de **arquetipos junguianos** (test interactivo de 12 preguntas), su **astrología** (signo solar en el MVP, carta natal completa en producción) y su **numerología pitagórica** (camino de vida, destino y año personal).

## Estructura del proyecto

```
sethi/
├── backend/          API en Node.js + Express
│   ├── server.js     Rutas: registro, test, perfil, chat
│   └── lib/
│       ├── numerology.js   Motor de numerología pitagórica
│       ├── astrology.js    Signo solar + contrato para Swiss Ephemeris
│       ├── archetypes.js   12 arquetipos, test y algoritmo de puntaje
│       ├── ai.js           System prompt dinámico + API de Anthropic
│       └── store.js        Almacenamiento JSON (migrable a Supabase)
└── frontend/         React + Vite, estética "Premium Deep Dark"
    └── src/views/    Registro → Test → Perfil (Sello Cósmico) → Chat
```

## Cómo ejecutarlo (requiere Node.js 18 o superior)

**1. Backend** — en una terminal:

```bash
cd backend
npm install
cp .env.example .env    # pega tu ANTHROPIC_API_KEY dentro del archivo .env
npm run dev             # queda en http://localhost:3001
```

Sin API key la app funciona igual en "modo demo": el chat responde con un mensaje simulado para que puedas probar todo el flujo.

**2. Frontend** — en otra terminal:

```bash
cd frontend
npm install
npm run dev             # abre http://localhost:5173
```

Vite ya está configurado para redirigir `/api` al backend, así que no hay nada más que configurar.

## Cómo funciona el "Cerebro"

Cuando el usuario chatea, el backend arma un system prompt invisible con su perfil completo (arquetipos con porcentajes, signo, camino de vida, año personal) y las reglas del mentor: tono chileno cercano, foco en autodescubrimiento accionable —nunca predicción determinista— y siempre una acción concreta por respuesta. Ese prompt viaja con el historial de la conversación a la API de Anthropic. Puedes cambiar el modelo en `.env` con la variable `AI_MODEL`.

## Hoja de ruta hacia producción

El código está escrito para que cada pieza se reemplace sin tocar el resto. El almacenamiento en JSON (`store.js`) se migra a **Supabase** cambiando solo ese archivo, ya que la interfaz `getUsuario / guardarUsuario / agregarMensaje` se mantiene. La astrología completa (ascendente, luna, casas, tránsitos) se conecta en `astrology.js`, cuyo contrato de salida ya contempla esos campos en null: la opción recomendada es un microservicio Python con `pyswisseph` o una API de efemérides. La autenticación real (Google / Apple / correo) llega junto con Supabase Auth, y los pagos con Webpay/Transbank o Stripe se agregan como rutas nuevas en `server.js` cuando definas el plan premium. Finalmente, este mismo frontend React sirve de base visual y de lógica para la futura app móvil en Flutter o React Native descrita en tu documento de arquitectura.
