# MECATRONIC Thing

App que guía paso a paso a mecatrónicos junior en sus proyectos individuales: de la idea al producto final, cubriendo investigación, requisitos, diseño (mecánico/electrónico/firmware), materiales (BOM), precio de venta, bitácora y resolución de problemas técnicos.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS
- Zustand con persistencia en `localStorage` (sin backend propio; cada navegador guarda sus propios proyectos)
- Endpoints de servidor propios para IA generativa (`app/api/generate-design-image`, `app/api/ai-assistant`), que mantienen las API keys fuera del cliente
- Asistente IA en las 9 etapas, gratis por defecto: arma un prompt con todo el contexto real del proyecto para pegar en Claude (esta sesión, claude.ai, etc.) y guarda la respuesta pegada de vuelta. La llamada automática a la API (Claude Opus 5, vía `@anthropic-ai/sdk`) es opcional y apagada por defecto porque tiene costo
- Visor 3D paramétrico (react-three-fiber / drei), gratis y sin API key, para una primera referencia de proporciones en la etapa de Diseño
- Animaciones (framer-motion): transición entre etapas, aparición escalonada de la guía/checklist, hover en las tarjetas del dashboard, banner de bienvenida en la etapa de Idea

## Etapas del flujo

1. Idea y alcance
2. Investigación y estado del arte
3. Utilidad y requisitos
4. Diseño (mecánico / electrónico / firmware)
5. Materiales (BOM)
6. Precio del producto
7. Bitácora
8. Resolución de temas complejos
9. Producto final

## Desarrollo

```bash
npm install
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000).

### Generación de imagen conceptual por IA (opcional)

La etapa de Diseño puede generar una imagen conceptual del producto con DALL-E 3.
Para habilitarla:

```bash
cp .env.example .env.local
# completar OPENAI_API_KEY con una key de https://platform.openai.com/api-keys
```

Sin esa variable configurada, el botón sigue visible pero muestra un mensaje de error
claro en vez de fallar en silencio. Cada imagen generada tiene un costo (~USD 0.04) en
la cuenta de OpenAI dueña de la key.

### Asistente IA

Cada etapa tiene un panel de "Asistente IA". Por defecto es **gratis**: arma un prompt
con todo el contexto real del proyecto (lo que ya cargaste en todas las etapas) y lo
copia al portapapeles con un botón — lo pegás en esta misma sesión de Claude Code, en
claude.ai, o donde uses Claude, y después pegás la respuesta de vuelta en el panel para
guardarla en el proyecto. No requiere ninguna API key ni gasta nada.

Si en algún momento querés que el botón le pegue directo a la API sin copiar/pegar,
hay un checkbox "Automatizar con la API" (apagado por defecto) que habilita las
llamadas automáticas — eso sí tiene costo, facturado a tu cuenta de Anthropic:

```bash
cp .env.example .env.local
# completar ANTHROPIC_API_KEY con una key de https://console.anthropic.com/settings/keys
```

Sin esa variable configurada, tildar el checkbox y generar muestra el error claro en
vez de fallar en silencio.

## Build de producción

```bash
npm run build
npm start
```
