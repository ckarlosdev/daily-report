import { DrDumpster, DumpsterRow, DumpsterSource } from "../types";

export const SOURCES: DumpsterSource[] = ["Disposal", "External"];

export const SOURCE_LABELS: Record<DumpsterSource, string> = {
  Disposal: "Creative Disposal",
  External: "External",
};

export const SIZES = [
  "40 yds",
  "35 yds",
  "30 yds",
  "20 yds",
  "12 yds",
  "Quad",
  "Semi",
  "Gondola",
];

export const BASE_MATERIALS = ["Concrete", "Metal", "C&D"];

export const MATERIAL_SUGGESTIONS = [
  "Copper",
  "Aluminum",
  "Brass",
  "Steel",
  "Stainless Steel",
  "Iron",
  "Wood",
  "Cardboard",
  "Drywall",
  "Asphalt",
  "Brick",
  "Glass",
  "Plastic",
  "Mixed",
];

export const MATERIAL_MAX_LENGTH = 50;

export const isBaseMaterial = (material: string) =>
  BASE_MATERIALS.includes(material);

export const buildEmptyTable = (): DumpsterRow[] =>
  SOURCES.flatMap((type) =>
    SIZES.map((size) => ({ type, size, values: {}, ids: {} })),
  );

const normalizeSize = (size: string) =>
  (size ?? "").replace(/\s/g, "").toLowerCase();

export const findRow = (
  tableData: DumpsterRow[],
  type: string,
  size: string,
): DumpsterRow | undefined =>
  tableData.find(
    (row) => row.type === type && normalizeSize(row.size) === normalizeSize(size),
  );

const findMaterial = (materials: string[], name: string) =>
  materials.find((m) => m.toLowerCase() === name.toLowerCase());

export type MaterialResult =
  | { ok: true; name: string }
  | { ok: false; error: string; existing?: string };

/**
 * Limpia el nombre escrito por el usuario y evita duplicados:
 * "  copper " -> "Copper" (usa la escritura de la sugerencia si coincide).
 */
export const normalizeMaterial = (
  input: string,
  existing: string[],
): MaterialResult => {
  const clean = input.trim().replace(/\s+/g, " ");

  if (!clean) return { ok: false, error: "Enter a material name." };
  if (clean.length > MATERIAL_MAX_LENGTH) {
    return {
      ok: false,
      error: `Max ${MATERIAL_MAX_LENGTH} characters.`,
    };
  }

  const duplicate = findMaterial(existing, clean);
  if (duplicate) {
    return {
      ok: false,
      error: `"${duplicate}" already exists.`,
      existing: duplicate,
    };
  }

  const suggestion = findMaterial(MATERIAL_SUGGESTIONS, clean);
  const name = suggestion ?? clean.charAt(0).toUpperCase() + clean.slice(1);

  return { ok: true, name };
};

export type SourceTotals = Record<DumpsterSource, number> & { total: number };

export type DumpsterTotals = {
  byMaterial: Record<string, SourceTotals>;
  bySource: Record<DumpsterSource, number>;
  grandTotal: number;
};

const emptySourceTotals = (): SourceTotals => ({
  Disposal: 0,
  External: 0,
  total: 0,
});

export const calculateTotals = (
  tableData: DumpsterRow[],
  materials: string[],
): DumpsterTotals => {
  const byMaterial: Record<string, SourceTotals> = {};
  materials.forEach((m) => (byMaterial[m] = emptySourceTotals()));

  const bySource: Record<DumpsterSource, number> = { Disposal: 0, External: 0 };
  let grandTotal = 0;

  tableData.forEach((row) => {
    materials.forEach((material) => {
      const qty = row.values[material] ?? 0;
      if (!qty) return;
      byMaterial[material][row.type] += qty;
      byMaterial[material].total += qty;
      bySource[row.type] += qty;
      grandTotal += qty;
    });
  });

  return { byMaterial, bySource, grandTotal };
};

/**
 * Arma lo que se manda al backend: solo cantidades > 0.
 * Si la celda vino de BD se manda su id (UPDATE); si no, null (INSERT).
 * Lo que no se manda, el backend lo marca como inactivo (soft delete).
 */
export const buildPayload = (
  tableData: DumpsterRow[],
  materials: string[],
): DrDumpster[] =>
  tableData.flatMap((row) =>
    materials.flatMap((material) => {
      const quantity = row.values[material] ?? 0;
      if (quantity <= 0) return [];
      return [
        {
          drDumpstersId: row.ids[material] ?? null,
          sourceDumpster: row.type,
          sizeDumpster: row.size,
          typeDumpster: material,
          quantity,
        },
      ];
    }),
  );

/** Convierte la respuesta de la API en filas de la tabla + lista de materiales. */
export const buildTableFromApi = (
  apiData: DrDumpster[] | null | undefined,
): { tableData: DumpsterRow[]; materials: string[] } => {
  const tableData = buildEmptyTable();
  const materials = [...BASE_MATERIALS];

  apiData?.forEach((item) => {
    if (!item || !SOURCES.includes(item.sourceDumpster as DumpsterSource)) {
      return;
    }
    const rawMaterial = item.typeDumpster?.trim();
    if (!rawMaterial) return;

    // Mismo material con distinta capitalización -> se usa el que ya existe
    let material = findMaterial(materials, rawMaterial);
    if (!material) {
      material = rawMaterial;
      materials.push(material);
    }

    // Si llega un tamaño que no está en la lista, se agrega para no perderlo
    let row = findRow(tableData, item.sourceDumpster, item.sizeDumpster);
    if (!row) {
      row = {
        type: item.sourceDumpster as DumpsterSource,
        size: item.sizeDumpster,
        values: {},
        ids: {},
      };
      tableData.push(row);
    }

    row.values[material] = (row.values[material] ?? 0) + (item.quantity ?? 0);
    if (item.drDumpstersId != null && row.ids[material] == null) {
      row.ids[material] = item.drDumpstersId;
    }
  });

  return { tableData, materials };
};
