import { StageId, ChecklistItem } from "./types";

export interface FieldDef {
  key: string;
  label: string;
  placeholder: string;
  type: "text" | "textarea";
}

export interface StageMeta {
  id: StageId;
  numero: number;
  titulo: string;
  resumen: string;
  guia: string[]; // bullets técnicos, nivel avanzado, sin relleno
  fields: FieldDef[];
  checklistDefault: string[];
}

const mk = (labels: string[]): ChecklistItem[] =>
  labels.map((label, i) => ({ id: `c${i}`, label, done: false }));

export const STAGES_META: Record<StageId, StageMeta> = {
  idea: {
    id: "idea",
    numero: 1,
    titulo: "Idea y Alcance",
    resumen:
      "Define el problema real que resuelves, no la solución. El error más común de junior es enamorarse del mecanismo antes de validar la necesidad.",
    guia: [
      "Escribe el problema en una sola frase con sujeto, dolor y contexto: 'X necesita Y porque Z falla actualmente'. Si no cabe en una frase, no está claro todavía.",
      "Define el ALCANCE cerrado: qué SÍ entra en esta versión (v1) y qué queda explícitamente fuera (backlog). Sin esto, el scope creep te va a comer el cronograma.",
      "Clasifica el proyecto por dominio dominante: mecánico puro, electrónico puro, control/firmware, o sistema integrado (mecatrónico real). Esto define qué stack de habilidades vas a necesitar reforzar.",
      "Define el criterio de éxito medible (KPI técnico): tiempo de ciclo, precisión en mm, repetibilidad, autonomía en horas, throughput, etc. Sin métrica no hay forma de saber si terminaste.",
      "Identifica restricciones duras desde el día uno: presupuesto máximo, tiempo disponible, herramientas/máquinas a las que tienes acceso real (impresora 3D, torno, CNC, laboratorio).",
    ],
    fields: [
      { key: "problema", label: "Problema en una frase", placeholder: "Ej: Los pequeños talleres de reciclaje clasifican PET a mano porque no hay clasificador de bajo costo.", type: "textarea" },
      { key: "alcanceIn", label: "Dentro del alcance (v1)", placeholder: "Lista lo que SÍ construyes en esta versión", type: "textarea" },
      { key: "alcanceOut", label: "Fuera del alcance", placeholder: "Lista lo que queda para versiones futuras", type: "textarea" },
      { key: "dominio", label: "Dominio dominante", placeholder: "Mecánico / Electrónico / Control-Firmware / Integrado", type: "text" },
      { key: "kpi", label: "Criterio de éxito medible (KPI)", placeholder: "Ej: clasificar 30 piezas/min con 90% de precisión", type: "text" },
      { key: "restricciones", label: "Restricciones duras", placeholder: "Presupuesto, tiempo, herramientas disponibles", type: "textarea" },
    ],
    checklistDefault: [
      "Problema escrito en una frase, validado con al menos una persona externa",
      "Alcance v1 cerrado por escrito (dentro/fuera)",
      "KPI técnico medible definido",
      "Restricciones de presupuesto y tiempo cuantificadas",
    ],
  },
  investigacion: {
    id: "investigacion",
    numero: 2,
    titulo: "Investigación y Estado del Arte",
    resumen:
      "Antes de diseñar, busca quién ya resolvió algo parecido. Reinventar sin investigar es la causa #1 de retrabajo en proyectos junior.",
    guia: [
      "Busca 3 a 5 soluciones existentes (comerciales, papers, proyectos open-source tipo Hackaday/Instructables/IEEE Xplore) y documenta específicamente qué mecanismo/algoritmo usan y por qué.",
      "Haz benchmarking comparativo: tabla con columnas de precio, precisión, tamaño, y limitación conocida de cada solución encontrada. Eso te da tu ventaja diferencial real.",
      "Si el proyecto usa un sensor o actuador específico, lee el datasheet completo antes de comprar: rango, resolución, tensión de alimentación, interfaz de comunicación, tiempo de respuesta.",
      "Revisa patentes activas si el proyecto tiene intención comercial futura — una búsqueda rápida en Google Patents evita que inviertas meses en algo bloqueado legalmente.",
      "Identifica los 2-3 riesgos técnicos más grandes (dónde es más probable que falles) ANTES de comprometer diseño. Eso se llama reducción de riesgo temprana y te ahorra iteraciones caras.",
    ],
    fields: [
      { key: "referencias", label: "Referencias / soluciones existentes encontradas", placeholder: "Lista con link o cita + qué mecanismo usan", type: "textarea" },
      { key: "benchmark", label: "Comparativa (precio / precisión / limitación)", placeholder: "Tabla resumida en texto", type: "textarea" },
      { key: "datasheets", label: "Componentes clave investigados (datasheet leído)", placeholder: "Sensor/actuador + parámetro crítico", type: "textarea" },
      { key: "riesgos", label: "Riesgos técnicos principales identificados", placeholder: "Los 2-3 puntos donde más probable es que falles", type: "textarea" },
    ],
    checklistDefault: [
      "Al menos 3 soluciones existentes documentadas con su mecanismo",
      "Tabla comparativa de benchmarking hecha",
      "Datasheets de componentes críticos leídos completos",
      "Riesgos técnicos principales identificados y priorizados",
    ],
  },
  requisitos: {
    id: "requisitos",
    numero: 3,
    titulo: "Utilidad y Requisitos",
    resumen:
      "Traduce el problema en requisitos funcionales y no funcionales verificables. Un requisito que no se puede probar no sirve como requisito.",
    guia: [
      "Separa requisitos FUNCIONALES (qué debe hacer el sistema) de NO FUNCIONALES (cómo debe hacerlo: robustez, IP rating, autonomía, ruido acústico, ergonomía).",
      "Redacta cada requisito en formato verificable: 'El sistema DEBE [acción] EN [condición] CON [tolerancia/margen]'. Ejemplo: 'El brazo DEBE posicionar el efector en ±0.5mm bajo carga de 500g'.",
      "Define el usuario final real (persona, no abstracción) y su nivel técnico — eso condiciona la interfaz de usuario y el nivel de mantenimiento aceptable.",
      "Prioriza requisitos con MoSCoW (Must / Should / Could / Won't) para esta versión — así cuando el tiempo apriete sabes qué cortar sin culpa.",
      "Define condiciones ambientales de operación: temperatura, humedad, polvo, vibración. Muchos fallos de campo son por ignorar esto en el diseño.",
    ],
    fields: [
      { key: "funcionales", label: "Requisitos funcionales (verificables)", placeholder: "El sistema DEBE...", type: "textarea" },
      { key: "noFuncionales", label: "Requisitos no funcionales", placeholder: "Robustez, IP, autonomía, ergonomía, ruido...", type: "textarea" },
      { key: "usuario", label: "Usuario final y contexto de uso", placeholder: "Quién lo usa, qué tan técnico es, dónde se usa", type: "textarea" },
      { key: "moscow", label: "Priorización MoSCoW", placeholder: "Must / Should / Could / Won't", type: "textarea" },
      { key: "ambiente", label: "Condiciones ambientales de operación", placeholder: "Temperatura, humedad, polvo, vibración", type: "textarea" },
    ],
    checklistDefault: [
      "Requisitos funcionales redactados en formato verificable (DEBE/CON/EN)",
      "Requisitos no funcionales definidos",
      "Priorización MoSCoW hecha para v1",
      "Condiciones ambientales de operación consideradas en el diseño",
    ],
  },
  diseno: {
    id: "diseno",
    numero: 4,
    titulo: "Diseño (Mecánico / Electrónico / Firmware)",
    resumen:
      "El diseño mecatrónico es simultáneo, no secuencial: decisiones eléctricas afectan la mecánica y viceversa. Itera en los tres dominios a la vez.",
    guia: [
      "Mecánico: define el diagrama cinemático antes del CAD 3D. Calcula grados de libertad (Grübler-Kutzbach si aplica), cargas estáticas y dinámicas, y factor de seguridad (mínimo 1.5-2 para prototipo, más alto si hay riesgo humano).",
      "Selecciona material por criterio real: rigidez específica (E/ρ) para estructuras livianas, resistencia a fatiga si hay ciclos repetitivos, o costo/maquinabilidad si es prototipo único. PLA/PETG sirve para prototipo no estructural; para carga, aluminio o acero.",
      "Electrónico: dimensiona la fuente de alimentación con margen del 20-30% sobre el consumo pico calculado, no el promedio. Verifica caída de tensión en cables según corriente y distancia (usa la fórmula V=IR con la resistencia del calibre AWG real).",
      "Diseña el diagrama de bloques del sistema completo (sensores → controlador → actuadores → retroalimentación) antes de tocar una protoboard. Define qué protocolo de comunicación usa cada bloque (I2C, SPI, UART, CAN) y por qué.",
      "Firmware/Control: define la arquitectura de control (lazo abierto vs. cerrado, PID vs. on-off vs. estado) según la dinámica real del sistema, no por costumbre. Si hay lazo cerrado, identifica planta antes de sintonizar ganancias.",
      "Documenta cada decisión de diseño con su justificación técnica (trade-off considerado) — esto es lo que te distingue de alguien que solo copió un tutorial.",
    ],
    fields: [
      { key: "cinematica", label: "Diagrama cinemático / mecanismo", placeholder: "Describe el mecanismo, GDL, cargas estimadas", type: "textarea" },
      { key: "materiales", label: "Selección de materiales y justificación", placeholder: "Material + por qué (rigidez, fatiga, costo)", type: "textarea" },
      { key: "electronica", label: "Arquitectura electrónica", placeholder: "Fuente, consumo pico, protocolos de comunicación", type: "textarea" },
      { key: "bloques", label: "Diagrama de bloques del sistema", placeholder: "Sensores -> Controlador -> Actuadores -> Feedback", type: "textarea" },
      { key: "control", label: "Estrategia de control", placeholder: "Lazo abierto/cerrado, PID, estados, planta identificada", type: "textarea" },
      { key: "decisiones", label: "Decisiones clave y trade-offs", placeholder: "Qué descartaste y por qué", type: "textarea" },
    ],
    checklistDefault: [
      "Diagrama cinemático y cargas estimadas antes del CAD",
      "Materiales seleccionados con justificación técnica",
      "Fuente de alimentación dimensionada con margen (20-30%)",
      "Diagrama de bloques del sistema completo",
      "Estrategia de control definida y justificada",
    ],
  },
  materiales: {
    id: "materiales",
    numero: 5,
    titulo: "Materiales (BOM)",
    resumen:
      "El BOM (Bill of Materials) es el puente entre diseño y realidad. Un BOM incompleto es la razón #1 de que un proyecto se atrase por esperar un tornillo.",
    guia: [
      "Incluye TODO: no solo el motor y el sensor, también tornillería, cables, conectores, disipadores, adhesivos, consumibles de impresión 3D. Lo pequeño suma y frena el ensamble.",
      "Para cada ítem crítico, agrega una alternativa de segunda fuente (second source) — si el proveedor se queda sin stock, no paras el proyecto.",
      "Distingue entre costo unitario de una unidad vs. precio por lote (MOQ) — muchos componentes electrónicos bajan drásticamente de precio a partir de 10 o 100 unidades.",
      "Marca explícitamente qué llega con lead time largo (importación, componentes especializados) y pide eso PRIMERO, no al final.",
    ],
    fields: [],
    checklistDefault: [
      "BOM incluye consumibles y tornillería, no solo componentes principales",
      "Segunda fuente identificada para ítems críticos",
      "Precio unitario vs. precio por lote (MOQ) verificado",
      "Ítems de lead time largo pedidos primero",
    ],
  },
  precio: {
    id: "precio",
    numero: 6,
    titulo: "Precio del Producto",
    resumen:
      "El precio no es 'costo de materiales + un poco más'. Es costo directo + indirecto + mano de obra + margen, calculado con método, no a ojo.",
    guia: [
      "Costo directo = suma del BOM (materiales). Costo indirecto = energía, depreciación de herramienta/máquina, desperdicio de material (scrap rate), típicamente 10-20% del costo directo.",
      "Mano de obra = horas reales invertidas × tu tarifa/hora objetivo. Súbela: subvalorar tu hora es el error #1 de quien recién arranca a vender proyectos propios.",
      "Margen de ganancia se aplica SOBRE el costo total (directo + indirecto + mano de obra), no sobre el precio de venta — así evitas el error clásico de calcular margen al revés.",
      "Si es producto para vender formalmente, considera impuestos aplicables (IVA u otro) como línea aparte, no diluido en el margen.",
      "Compara tu precio final contra el benchmark que sacaste en la etapa de investigación — si estás muy por encima sin justificación de valor (mejor precisión, garantía, soporte), vas a tener que argumentarlo o ajustar.",
    ],
    fields: [],
    checklistDefault: [
      "Costo directo (BOM) calculado",
      "Costos indirectos estimados (10-20% del directo)",
      "Mano de obra valorada por hora real, no subestimada",
      "Margen aplicado sobre costo total, no sobre precio de venta",
      "Precio final comparado contra el benchmark de la investigación",
    ],
  },
  bitacora: {
    id: "bitacora",
    numero: 7,
    titulo: "Bitácora de Proyecto",
    resumen:
      "La bitácora es tu evidencia de proceso: qué hiciste, qué decidiste y por qué. Es lo primero que un evaluador técnico o cliente serio pide ver.",
    guia: [
      "Registra CADA sesión de trabajo, no solo los hitos grandes: fecha, qué hiciste, qué decidiste, cuánto tiempo tomó. Esto también te sirve para estimar mejor el próximo proyecto.",
      "Anota los fracasos y rediseños con la misma seriedad que los éxitos — es la parte más valiosa para quien lea tu proceso después (incluido tú mismo en 6 meses).",
      "Si tomas una decisión de diseño que cambia algo ya definido en etapas anteriores, anótalo aquí y actualiza esa etapa — la bitácora es la fuente de verdad temporal del proyecto.",
    ],
    fields: [],
    checklistDefault: [
      "Cada sesión de trabajo registrada con fecha y tiempo invertido",
      "Fracasos y rediseños documentados, no solo éxitos",
      "Cambios de diseño reflejados de vuelta en la etapa correspondiente",
    ],
  },
  troubleshooting: {
    id: "troubleshooting",
    numero: 8,
    titulo: "Resolución de Temas Complejos",
    resumen:
      "Cuando algo no funciona, documenta el método de diagnóstico, no solo el parche. Eso es lo que separa depurar de adivinar.",
    guia: [
      "Aplica diagnóstico por aislamiento: divide el sistema en bloques (mecánico / eléctrico / firmware) y verifica cada uno por separado antes de asumir que el problema es del sistema completo.",
      "Formula una hipótesis explícita ANTES de cambiar algo ('creo que el ruido viene de la PWM del motor acoplándose a la línea del sensor'), y diseña una prueba que la confirme o descarte.",
      "Usa herramientas de medición reales cuando el problema es eléctrico: multímetro para continuidad/tensión, osciloscopio para señales rápidas o ruido — no adivines con LEDs parpadeando.",
      "Cuando encuentres la causa raíz, pregúntate '¿por qué llegó a pasar esto?' al menos dos veces (5 whys simplificado) antes de dar el problema por cerrado — evita que vuelva a aparecer en otra forma.",
    ],
    fields: [],
    checklistDefault: [
      "Diagnóstico por aislamiento aplicado (mecánico/eléctrico/firmware)",
      "Hipótesis formulada antes de modificar el sistema",
      "Medición real hecha (multímetro/osciloscopio), no solo observación",
      "Causa raíz confirmada con al menos un 'por qué' adicional",
    ],
  },
  final: {
    id: "final",
    numero: 9,
    titulo: "Producto Final",
    resumen:
      "Cerrar el proyecto significa que otra persona podría retomarlo sin ti. Documentación de cierre = entregable real, no un extra opcional.",
    guia: [
      "Genera el BOM final consolidado (lo realmente usado, no lo planeado) y el costo real final vs. el estimado — esa diferencia es aprendizaje directo para el próximo proyecto.",
      "Documenta el procedimiento de ensamble y de operación con fotos/diagramas — asume que quien lo lee no estuvo contigo durante el desarrollo.",
      "Define el plan de mantenimiento: qué revisar, cada cuánto, qué piezas son consumibles y necesitan reemplazo periódico.",
      "Haz un post-mortem honesto: qué harías diferente, qué requisito subestimaste, qué te tomó más tiempo del esperado y por qué. Esto es lo que acelera tu curva de aprendizaje real.",
    ],
    fields: [
      { key: "bomFinal", label: "Resumen BOM final vs. estimado", placeholder: "Diferencias de costo real vs planeado", type: "textarea" },
      { key: "manual", label: "Procedimiento de ensamble/operación", placeholder: "Pasos clave, referencia a fotos/diagramas externos", type: "textarea" },
      { key: "mantenimiento", label: "Plan de mantenimiento", placeholder: "Qué revisar, frecuencia, consumibles", type: "textarea" },
      { key: "postmortem", label: "Post-mortem del proyecto", placeholder: "Qué harías diferente", type: "textarea" },
    ],
    checklistDefault: [
      "BOM final consolidado y comparado contra el estimado",
      "Procedimiento de ensamble/operación documentado",
      "Plan de mantenimiento definido",
      "Post-mortem honesto completado",
    ],
  },
};
