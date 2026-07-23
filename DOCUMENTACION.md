# Documentación de la Aplicación Sethi (Zethi)

Esta es la documentación técnica y funcional del proyecto **Sethi**, una aplicación web diseñada para brindar mentoría de vida accionable a través de Inteligencia Artificial, basándose en arquetipos, astrología y numerología.

---

## 1. Reglas y Entorno de la Inteligencia Artificial

El "cerebro" de la IA está configurado en `backend/lib/ai.js`. La IA no actúa libremente, sino que está contenida bajo un marco estricto que define su personalidad y sus límites:

**Rol y Personalidad:**
- **Identidad:** Sethi, un mentor de vida sabio, cálido y empático.
- **Tono:** Chileno/Latinoamericano, cercano pero muy profesional.
- **Enfoque:** Autodescubrimiento accionable. Sethi NO es un adivino; usa la información esotérica como un "espejo" psicológico para ayudar al usuario a tomar mejores decisiones en su vida y carrera, nunca como un destino inamovible.

**Reglas (System Prompt):**
1. **Personalización:** Debe adaptar cada consejo al arquetipo primario (sus fortalezas y sombras típicas) y matizarlo con el secundario.
2. **Lenguaje Simbólico:** La astrología y la numerología se usan solo como herramientas de reflexión (lenguaje simbólico), nunca como predicciones deterministas.
3. **Accionabilidad:** En cada respuesta, debe sugerir al menos una (1) acción concreta y pequeña que la persona pueda realizar durante la semana.
4. **Seguridad Psicológica:** Si la IA detecta señales de angustia seria, crisis o problemas graves de salud mental, tiene la instrucción inquebrantable de recomendar buscar ayuda profesional con cariño y empatía.
5. **Formato:** Las respuestas deben ser conversacionales, de 2 a 4 párrafos como máximo, sin usar listas (a menos que el usuario lo pida explícitamente).

---

## 2. Arquitectura de la Aplicación

La aplicación está dividida en dos partes (monorepo):

### A. Frontend (`/frontend`)
- **Tecnología:** React + Vite.
- **Host:** Vercel (`zethi.vercel.app`).
- **Función:** Es la interfaz de usuario. Contiene el formulario para recopilar los datos del usuario (fecha de nacimiento, respuestas al test de arquetipos) y la interfaz gráfica del chat.
- **Identidad:** Los usuarios se identifican mediante un UUID temporal que se guarda en el `localStorage` del navegador.

### B. Backend (`/backend`)
- **Tecnología:** Node.js + Express.
- **Host:** Render (`zethi.onrender.com`).
- **Función:** Actúa como el puente seguro entre el navegador web, la base de datos y la IA. Contiene toda la lógica de negocio para que las credenciales secretas nunca lleguen al navegador del usuario.

**Módulos principales del Backend:**
- `server.js`: El servidor HTTP. Expone 3 rutas: `/api/salud` (para comprobar que está vivo), `/api/perfil` (para guardar y leer el perfil) y `/api/chat` (para enviar mensajes a la IA).
- `lib/ai.js`: El orquestador de la IA. Toma el perfil del usuario, arma el *System Prompt* dinámico, e invoca a Google Gemini a través de su API REST.
- `lib/store-supabase.js`: Conexión directa a PostgreSQL (Supabase). Guarda el perfil y el historial de chat (hasta 50 mensajes por usuario).
- `lib/limits.js`: El guardián de uso. Evita que un mismo usuario consuma todo el saldo de la API.

---

## 3. Revisión y Auditoría de Sistemas de Seguridad

Sethi cuenta con un modelo de seguridad robusto para una arquitectura MVP, diseñado para proteger tanto los datos como los costos operativos.

### ✅ Lo que está bien y es seguro (Puntos fuertes):
1. **Protección CORS (Cross-Origin Resource Sharing):**
   - **Mecanismo:** El backend rechaza cualquier petición que no provenga de la variable `FRONTEND_ORIGIN` configurada en Render.
   - **Beneficio:** Evita que un tercero construya una página web pirata que use tu backend a tu costa (CSRF). 
2. **Aislamiento de Secretos (API Keys):**
   - **Mecanismo:** La llave de Gemini (`GEMINI_API_KEY`) y la llave de Supabase (`SUPABASE_SERVICE_KEY`) solo viven en el backend. El frontend jamás las conoce.
   - **Beneficio:** Nadie puede robar tus credenciales inspeccionando el código de la página web (F12).
3. **Protección contra Abuso (Rate Limiting):**
   - **Mecanismo:** El archivo `limits.js` impone un límite de mensajes por usuario por día (variable `CHAT_LIMITE_DIARIO`, por defecto 20).
   - **Beneficio:** Evita que un usuario o un bot envíe miles de mensajes a la vez, lo cual generaría una factura gigantesca en la API de Google Gemini.
4. **Seguridad de Base de Datos (RLS de Supabase):**
   - **Mecanismo:** La tabla `usuarios` en Supabase tiene activada la "Seguridad a nivel de filas" (Row Level Security). Además, no se escribieron políticas públicas.
   - **Beneficio:** Es imposible leer o escribir datos en la base de datos conectándose directamente a Supabase sin autenticación. El backend es el único que puede leer/escribir usando la "Service Key" que se salta esta regla (bypass).

### ⚠️ Puntos a mejorar en el futuro (Vulnerabilidades del MVP):
1. **Identificación por `localStorage` (Falta de Login Real):**
   - Actualmente el usuario no usa correo ni contraseña. Su perfil está atado al navegador. Si el usuario borra las cookies o cambia de celular, perderá su perfil y su historial.
   - **Recomendación futura:** Implementar un sistema de autenticación (Login) usando Supabase Auth (correo/contraseña o Google Login) para que el perfil sea permanente y 100% privado.
2. **Límites de memoria RAM (`limits.js`):**
   - El límite de 20 chats diarios se guarda en la memoria volátil (RAM) de Render. Si Render se reinicia, el contador de todos los usuarios vuelve a cero.
   - **Recomendación futura:** Si la app tiene mucho tráfico, mover el contador a una tabla de Supabase o a una base de datos Redis.

---
*Documentación generada y actualizada en julio de 2026.*
