# ✦ Guía de despliegue de Sethi — paso a paso

Al final de esta guía tendrás a Sethi funcionando en internet, con una URL que puedes compartir con tu comunidad, los perfiles guardados en Supabase y un límite diario de mensajes que protege tu presupuesto de IA.

Tiempo estimado: 1 a 2 horas la primera vez. Todo se hace desde el navegador, sin tocar código.

---

## Paso 0 · Lo que necesitas antes de empezar

Crea cuentas gratuitas en estos cuatro servicios (con tu correo o con Google):

1. **GitHub** (github.com) — donde vivirá el código.
2. **Supabase** (supabase.com) — la base de datos.
3. **Railway** (railway.app) — donde correrá el backend. Alternativa equivalente: Render.
4. **Vercel** (vercel.com) — donde vivirá el frontend (la página que ve tu comunidad).

Además necesitas tu **clave de API de Anthropic**: entra a console.anthropic.com, crea una API key y cárgale un saldo pequeño (5 USD alcanza de sobra para tu beta). Guárdala en un lugar seguro y nunca la compartas ni la pegues en el frontend.

---

## Paso 1 · Sube el código a GitHub

1. En GitHub, crea un repositorio nuevo llamado `sethi` (privado está bien).
2. En tu computador, dentro de la carpeta del proyecto, ejecuta:

```bash
git init
git add .
git commit -m "Sethi MVP"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/sethi.git
git push -u origin main
```

> Si nunca has usado git: instala GitHub Desktop (desktop.github.com), arrastra la carpeta del proyecto y haz clic en "Publish repository". Hace lo mismo sin comandos.

---

## Paso 2 · Crea la base de datos en Supabase

1. En Supabase, crea un proyecto nuevo (nombre: `sethi`, región: South America / São Paulo, la más cercana a Chile).
2. Ve a **SQL Editor**, pega el contenido del archivo `backend/supabase/schema.sql` y presiona **Run**. Eso crea la tabla `usuarios`.
3. Ve a **Settings → API** y copia dos cosas:
   - **Project URL** (algo como `https://abcdefg.supabase.co`)
   - **service_role key** (la clave secreta del servidor — no la "anon")

---

## Paso 3 · Despliega el backend en Railway

1. En Railway: **New Project → Deploy from GitHub repo** → elige tu repo `sethi`.
2. En Settings del servicio, define **Root Directory**: `backend`.
3. Ve a **Variables** y agrega estas (una por una):

| Variable | Valor |
|---|---|
| `ANTHROPIC_API_KEY` | tu clave de Anthropic |
| `AI_MODEL` | `claude-haiku-4-5` |
| `STORAGE` | `supabase` |
| `SUPABASE_URL` | la Project URL del paso 2 |
| `SUPABASE_SERVICE_KEY` | la service_role key del paso 2 |
| `CHAT_LIMITE_DIARIO` | `20` (o el que prefieras) |
| `FRONTEND_ORIGIN` | lo llenarás en el paso 5 |

4. En **Settings → Networking**, genera un dominio público. Te dará algo como `https://sethi-api.up.railway.app`. **Cópialo.**
5. Prueba que vive: abre `https://TU-URL-RAILWAY/api/salud` en el navegador. Deberías ver `{"ok":true,...}`.

---

## Paso 4 · Despliega el frontend en Vercel

1. En Vercel: **Add New → Project** → importa tu repo `sethi`.
2. En la configuración de importación, define **Root Directory**: `frontend` (Vercel detecta Vite solo).
3. En **Environment Variables**, agrega:
   - `VITE_API_URL` = la URL de Railway del paso 3 (sin barra final, ej: `https://sethi-api.up.railway.app`)
4. Haz clic en **Deploy**. En un minuto tendrás tu URL: `https://sethi-XXXX.vercel.app`.

---

## Paso 5 · Conecta la seguridad entre ambos

Vuelve a Railway → Variables y completa:

- `FRONTEND_ORIGIN` = tu URL de Vercel (ej: `https://sethi-XXXX.vercel.app`)

Railway se reinicia solo. Con esto, únicamente tu página puede hablar con tu API — nadie más puede usar tu backend (y tu saldo de IA) desde otro sitio.

---

## Paso 6 · Prueba completa y comparte

1. Abre tu URL de Vercel desde el celular.
2. Regístrate, haz el test, revisa tu sello y conversa con el mentor.
3. En Supabase → **Table Editor → usuarios** deberías ver tu perfil guardado. ✦
4. ¡Comparte el enlace con tu comunidad!

---

## Paso 7 (opcional) · Tu dominio propio

1. Compra el dominio (ej: `sethi.cl` en nic.cl, ~10.000 CLP/año).
2. En Vercel → Settings → **Domains**, agrega `sethi.cl` y sigue las instrucciones de DNS que te muestra.
3. Agrega también `https://sethi.cl` a `FRONTEND_ORIGIN` en Railway, separado por coma:
   `https://sethi-XXXX.vercel.app,https://sethi.cl`

---

## Costos esperados en tu beta

Vercel y Supabase parten gratis. Railway cuesta ~5 USD/mes. La IA con el modelo económico cuesta centavos por conversación: con el límite de 20 mensajes diarios por usuario y ~100 usuarias activas, difícilmente superarás los 10-20 USD mensuales. Vigila tu consumo real en console.anthropic.com → Usage y en Railway → Metrics.

## Si algo falla

- **La página carga pero el chat no responde** → revisa que `VITE_API_URL` en Vercel sea exactamente la URL de Railway y que `FRONTEND_ORIGIN` en Railway sea exactamente la de Vercel (https incluido, sin barra final). Después de cambiar variables en Vercel hay que hacer **Redeploy**.
- **Error 429 en el chat** → es el límite diario funcionando; sube `CHAT_LIMITE_DIARIO` si quieres.
- **`/api/salud` no responde** → mira los **Logs** en Railway: casi siempre es una variable mal escrita.
- Cada cambio que subas a GitHub (`git push`) se despliega solo en Railway y Vercel. Magia.
