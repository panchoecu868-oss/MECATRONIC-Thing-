# MECATRONIC Thing

App que guía paso a paso a mecatrónicos junior en sus proyectos individuales: de la idea al producto final, cubriendo investigación, requisitos, diseño (mecánico/electrónico/firmware), materiales (BOM), precio de venta, bitácora y resolución de problemas técnicos.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS
- Zustand con persistencia en `localStorage` (sin backend propio; cada navegador guarda sus propios proyectos)
- Endpoints de servidor propios para la generación de imagen (`app/api/generate-design-image`) y de modelo 3D (`app/api/generate-design-3d`) por IA, que mantienen las API keys fuera del cliente
- Visor 3D (react-three-fiber / drei) para la vista paramétrica y para renderizar el `.glb` generado

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

### Generación de modelo 3D real por IA (opcional)

La misma etapa puede generar una malla 3D real (no paramétrica) con Meshy, vía el
cliente [`@glbforge/meshy`](https://www.npmjs.com/package/@glbforge/meshy). Para
habilitarla, completá `MESHY_API_KEY` en `.env.local` con una key de tu cuenta de
Meshy. Es un proceso asíncrono (tarea → polling → descarga): la etapa "preview"
(geometría sin textura) suele tardar entre 30 segundos y un par de minutos, y
consume créditos de tu plan.

Meshy publica una key de prueba (`msy_dummy_api_key_for_test_mode_12345678`) que no
consume créditos reales — sirve para probar el flujo completo (creación de tarea,
polling, estados) sin gastar cuota, aunque el resultado final sea un modelo de prueba.

Tanto el visor 3D como la descarga pasan por un proxy propio
(`app/api/generate-design-3d/download`, restringido por allowlist a hosts `*.meshy.ai`)
en vez de pedirle el `.glb` directo al CDN de Meshy desde el navegador — así el
resultado no depende de qué headers CORS mande ese CDN.

**Nota de esta implementación:** el sandbox donde se construyó esto bloquea el acceso
saliente a `api.meshy.ai`, así que no pude probar el flujo de generación de punta a
punta con una key real (sí se verificó el contrato de la API leyendo el código fuente
de un cliente TypeScript publicado, y se probó en navegador todo el camino de error
sin key configurada).

## Build de producción

```bash
npm run build
npm start
```
