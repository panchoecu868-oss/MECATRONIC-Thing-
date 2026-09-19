# MECATRONIC Thing

App que guía paso a paso a mecatrónicos junior en sus proyectos individuales: de la idea al producto final, cubriendo investigación, requisitos, diseño (mecánico/electrónico/firmware), materiales (BOM), precio de venta, bitácora y resolución de problemas técnicos.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Zustand con persistencia en `localStorage` (sin backend; cada navegador guarda sus propios proyectos)

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

## Build de producción

```bash
npm run build
npm start
```
