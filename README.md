# MECATRONIC Thing

App que guía paso a paso a mecatrónicos junior en sus proyectos individuales: de la idea al producto final, cubriendo investigación, requisitos, diseño (mecánico/electrónico/firmware), materiales (BOM), precio de venta, bitácora y resolución de problemas técnicos.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS
- Zustand con persistencia en `localStorage` (sin backend propio; cada navegador guarda sus propios proyectos)
- Endpoints de servidor propios para IA generativa (`app/api/generate-design-image`, `app/api/ai-assistant`), que mantienen las API keys fuera del cliente
- Asistente IA (Claude Opus 5, vía `@anthropic-ai/sdk`) en las 9 etapas: genera un plan de acción específico para cada proyecto y responde preguntas puntuales usando todo lo ya cargado como contexto
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

### Asistente IA (opcional)

Cada etapa tiene un panel de "Asistente IA" que genera un plan de acción específico
para el proyecto o responde una pregunta puntual, usando Claude Opus 5. Para habilitarlo:

```bash
cp .env.example .env.local
# completar ANTHROPIC_API_KEY con una key de https://console.anthropic.com/settings/keys
```

Sin esa variable, el panel sigue visible pero muestra el error claro en vez de fallar
en silencio. El costo depende del uso real (facturado a la cuenta de Anthropic dueña
de la key) — no hay un número fijo por generación como con DALL-E.

## Build de producción

```bash
npm run build
npm start
```
