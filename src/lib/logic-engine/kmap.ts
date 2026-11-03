// Karnaugh Map (K-Map) Minimization Engine
// Supports 2, 3, and 4 variables with SOP, POS, Don't Care conditions,
// wraparound adjacency (including corners), and step-by-step group derivation.

export type VariableCount = 2 | 3 | 4;
export type CellValue = 0 | 1 | 'X';
export type FormType = 'SOP' | 'POS';

export interface KMapCell {
  minterm: number;
  row: number;
  col: number;
  rowCode: string;
  colCode: string;
  binaryString: string;
  value: CellValue;
}

export interface KMapGroup {
  id: string;
  size: number;
  minterms: number[];
  cells: { row: number; col: number }[];
  termExpression: string; // e.g. "A'·B" or "(A + B')"
  color: string;
  explanation: string;
  isEssential: boolean;
}

export interface KMapSolution {
  variableCount: VariableCount;
  variables: string[];
  form: FormType;
  cells: KMapCell[][];
  rowLabels: string[];
  colLabels: string[];
  groups: KMapGroup[];
  simplifiedExpression: string;
  canonicalExpression: string;
  explanationSteps: string[];
}

const COLOR_PALETTE = [
  '#3b82f6', // blue
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#06b6d4', // cyan
  '#84cc16'  // lime
];

/**
 * Returns Gray code sequence for given bit length
 */
export function getGrayCodeSequence(bits: number): string[] {
  if (bits === 1) return ['0', '1'];
  if (bits === 2) return ['00', '01', '11', '10'];
  return ['0'];
}

/**
 * Get variable names
 */
export function getVariableNames(count: VariableCount): string[] {
  if (count === 2) return ['A', 'B'];
  if (count === 3) return ['A', 'B', 'C'];
  return ['A', 'B', 'C', 'D'];
}

/**
 * Generates initial grid for 2, 3, or 4 variables
 */
export function generateInitialGrid(
  count: VariableCount,
  activeMinterms: number[] = [],
  dontCares: number[] = []
): { cells: KMapCell[][]; rowLabels: string[]; colLabels: string[] } {
  let rowBits = 1;
  let colBits = 1;

  if (count === 2) {
    rowBits = 1; // A (0, 1)
    colBits = 1; // B (0, 1)
  } else if (count === 3) {
    rowBits = 1; // A (0, 1)
    colBits = 2; // BC (00, 01, 11, 10)
  } else {
    rowBits = 2; // AB (00, 01, 11, 10)
    colBits = 2; // CD (00, 01, 11, 10)
  }

  const rowLabels = getGrayCodeSequence(rowBits);
  const colLabels = getGrayCodeSequence(colBits);

  const grid: KMapCell[][] = [];

  for (let r = 0; r < rowLabels.length; r++) {
    const rowCells: KMapCell[] = [];
    for (let c = 0; c < colLabels.length; c++) {
      const rowCode = rowLabels[r];
      const colCode = colLabels[c];
      const binaryString = rowCode + colCode;
      const minterm = parseInt(binaryString, 2);

      let value: CellValue = 0;
      if (activeMinterms.includes(minterm)) {
        value = 1;
      } else if (dontCares.includes(minterm)) {
        value = 'X';
      }

      rowCells.push({
        minterm,
        row: r,
        col: c,
        rowCode,
        colCode,
        binaryString,
        value
      });
    }
    grid.push(rowCells);
  }

  return { cells: grid, rowLabels, colLabels };
}

/**
 * Helper to test if a subset of cells can form a valid rectangle (with wraparound)
 */
function isValidSubgrid(
  startRow: number,
  startCol: number,
  h: number,
  w: number,
  grid: KMapCell[][],
  targetVal: CellValue | CellValue[]
): { valid: boolean; minterms: number[]; cells: { row: number; col: number }[] } {
  const numRows = grid.length;
  const numCols = grid[0].length;
  const minterms: number[] = [];
  const cells: { row: number; col: number }[] = [];
  const allowed = Array.isArray(targetVal) ? targetVal : [targetVal];

  for (let r = 0; r < h; r++) {
    const currRow = (startRow + r) % numRows;
    for (let c = 0; c < w; c++) {
      const currCol = (startCol + c) % numCols;
      const cell = grid[currRow][currCol];
      if (!allowed.includes(cell.value)) {
        return { valid: false, minterms: [], cells: [] };
      }
      minterms.push(cell.minterm);
      cells.push({ row: currRow, col: currCol });
    }
  }

  return { valid: true, minterms, cells };
}

/**
 * Extracts Boolean expression for a given group of minterms
 */
function deriveTermForMinterms(
  minterms: number[],
  varNames: string[],
  form: FormType
): { expression: string; explanation: string } {
  const totalVars = varNames.length;
  const bitValues: (number | null)[] = []; // null means eliminated variable

  for (let bitIdx = 0; bitIdx < totalVars; bitIdx++) {
    const bitPosFromLeft = bitIdx;
    let commonVal: number | null = null;
    let consistent = true;

    for (const m of minterms) {
      const bin = m.toString(2).padStart(totalVars, '0');
      const val = parseInt(bin[bitPosFromLeft], 10);
      if (commonVal === null) {
        commonVal = val;
      } else if (commonVal !== val) {
        consistent = false;
        break;
      }
    }

    bitValues.push(consistent ? commonVal : null);
  }

  const keptVars: string[] = [];
  const eliminatedVars: string[] = [];

  for (let i = 0; i < totalVars; i++) {
    const vName = varNames[i];
    const val = bitValues[i];

    if (val === null) {
      eliminatedVars.push(vName);
      continue;
    }

    if (form === 'SOP') {
      // In SOP: 1 -> variable, 0 -> complement
      keptVars.push(val === 1 ? vName : `${vName}'`);
    } else {
      // In POS: 0 -> variable, 1 -> complement (sum term)
      keptVars.push(val === 0 ? vName : `${vName}'`);
    }
  }

  let expression = '';
  if (keptVars.length === 0) {
    expression = form === 'SOP' ? '1' : '0';
  } else {
    if (form === 'SOP') {
      expression = keptVars.join('·');
    } else {
      expression = `(${keptVars.join(' + ')})`;
    }
  }

  const elimStr = eliminatedVars.length > 0
    ? `Eliminates variable(s): ${eliminatedVars.join(', ')}.`
    : 'No variables eliminated (single cell term).';

  const explanation = `Group of ${minterms.length} cells (${minterms.map(m => `m${m}`).join(', ')}): ${elimStr} Yields: ${expression}`;

  return { expression, explanation };
}

/**
 * Core K-Map Solver
 */
export function solveKMap(
  count: VariableCount,
  minterms: number[],
  dontCares: number[] = [],
  form: FormType = 'SOP'
): KMapSolution {
  const varNames = getVariableNames(count);
  const { cells, rowLabels, colLabels } = generateInitialGrid(count, minterms, dontCares);
  const numRows = cells.length;
  const numCols = cells[0].length;
  const totalCells = numRows * numCols;

  // For SOP: target is 1 and X. Must cover all 1s.
  // For POS: target is 0 and X. Must cover all 0s.
  const targetVal: CellValue[] = form === 'SOP' ? [1, 'X'] : [0, 'X'];
  const essentialVal: CellValue = form === 'SOP' ? 1 : 0;

  // Cells that MUST be covered:
  const mustCoverMinterms = new Set<number>();
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numCols; c++) {
      if (cells[r][c].value === essentialVal) {
        mustCoverMinterms.add(cells[r][c].minterm);
      }
    }
  }

  // Trivial cases:
  if (mustCoverMinterms.size === 0) {
    return {
      variableCount: count,
      variables: varNames,
      form,
      cells,
      rowLabels,
      colLabels,
      groups: [],
      simplifiedExpression: form === 'SOP' ? '0' : '1',
      canonicalExpression: form === 'SOP' ? '0' : '1',
      explanationSteps: ['No active cells to cover. The function output is constant.']
    };
  }

  if (mustCoverMinterms.size === totalCells) {
    return {
      variableCount: count,
      variables: varNames,
      form,
      cells,
      rowLabels,
      colLabels,
      groups: [],
      simplifiedExpression: form === 'SOP' ? '1' : '0',
      canonicalExpression: form === 'SOP' ? '1' : '0',
      explanationSteps: ['All cells in the map are active. The entire map forms a single group of size ' + totalCells + '.']
    };
  }

  // Identify all valid power-of-2 rectangle candidates (sizes: 16, 8, 4, 2, 1)
  const candidateRectangles: { h: number; w: number; size: number }[] = [];
  const possibleSizes = [16, 8, 4, 2, 1].filter(s => s <= totalCells);

  for (const size of possibleSizes) {
    for (let h = 1; h <= numRows; h *= 2) {
      if (size % h === 0) {
        const w = size / h;
        if (w >= 1 && w <= numCols && (w & (w - 1)) === 0) {
          candidateRectangles.push({ h, w, size });
        }
      }
    }
  }

  // Find all Prime Implicants (valid groups not fully contained in any larger group)
  interface RawGroup {
    size: number;
    minterms: number[];
    mintermSet: Set<number>;
    cells: { row: number; col: number }[];
    hasEssential: boolean;
  }

  const rawGroups: RawGroup[] = [];
  const seenMintermKeys = new Set<string>();

  for (const rect of candidateRectangles) {
    for (let r = 0; r < numRows; r++) {
      for (let c = 0; c < numCols; c++) {
        const test = isValidSubgrid(r, c, rect.h, rect.w, cells, targetVal);
        if (test.valid) {
          // Check if contains at least one essential cell (not only don't-cares)
          const hasEssential = test.minterms.some(m => mustCoverMinterms.has(m));
          if (!hasEssential) continue;

          const sortedM = [...test.minterms].sort((a, b) => a - b);
          const key = sortedM.join(',');

          if (!seenMintermKeys.has(key)) {
            // Check if subset of already found larger group
            let isSubset = false;
            for (const existing of rawGroups) {
              if (existing.size > rect.size && sortedM.every(m => existing.mintermSet.has(m))) {
                isSubset = true;
                break;
              }
            }

            if (!isSubset) {
              seenMintermKeys.add(key);
              rawGroups.push({
                size: rect.size,
                minterms: sortedM,
                mintermSet: new Set(sortedM),
                cells: test.cells,
                hasEssential
              });
            }
          }
        }
      }
    }
  }

  // Sort groups descending by size
  rawGroups.sort((a, b) => b.size - a.size);

  // Essential Prime Implicant selection (Petrick's or greedy set-cover)
  const uncoveredMinterms = new Set<number>(mustCoverMinterms);
  const selectedGroups: RawGroup[] = [];

  // 1. Find essential prime implicants (only one group covers a specific minterm)
  for (const m of mustCoverMinterms) {
    const covering = rawGroups.filter(g => g.mintermSet.has(m));
    if (covering.length === 1) {
      const epi = covering[0];
      if (!selectedGroups.includes(epi)) {
        selectedGroups.push(epi);
        for (const coveredM of epi.minterms) {
          uncoveredMinterms.delete(coveredM);
        }
      }
    }
  }

  // 2. Greedy cover for remaining uncovered minterms
  while (uncoveredMinterms.size > 0) {
    let bestGroup: RawGroup | null = null;
    let maxNewlyCovered = 0;

    for (const g of rawGroups) {
      if (selectedGroups.includes(g)) continue;
      let newCount = 0;
      for (const m of g.minterms) {
        if (uncoveredMinterms.has(m)) newCount++;
      }
      if (newCount > maxNewlyCovered) {
        maxNewlyCovered = newCount;
        bestGroup = g;
      }
    }

    if (!bestGroup || maxNewlyCovered === 0) break;

    selectedGroups.push(bestGroup);
    for (const m of bestGroup.minterms) {
      uncoveredMinterms.delete(m);
    }
  }

  // Build finalized KMapGroup objects
  const finalGroups: KMapGroup[] = [];
  const explanationSteps: string[] = [];

  selectedGroups.forEach((g, idx) => {
    const color = COLOR_PALETTE[idx % COLOR_PALETTE.length];
    const derived = deriveTermForMinterms(g.minterms, varNames, form);

    const isEssential = g.minterms.some(m => {
      const others = selectedGroups.filter(other => other !== g);
      return mustCoverMinterms.has(m) && !others.some(other => other.mintermSet.has(m));
    });

    finalGroups.push({
      id: `group-${idx + 1}`,
      size: g.size,
      minterms: g.minterms,
      cells: g.cells,
      termExpression: derived.expression,
      color,
      explanation: derived.explanation,
      isEssential
    });

    explanationSteps.push(
      `Step ${idx + 1} (${isEssential ? 'Essential Group' : 'Covering Group'}): Formed group of size ${g.size} covering [${g.minterms.map(m => 'm' + m).join(', ')}]. ${derived.explanation}`
    );
  });

  // Final simplified equation
  let simplifiedExpression = '';
  if (finalGroups.length === 0) {
    simplifiedExpression = form === 'SOP' ? '0' : '1';
  } else if (form === 'SOP') {
    simplifiedExpression = finalGroups.map(g => g.termExpression).join(' + ');
  } else {
    simplifiedExpression = finalGroups.map(g => g.termExpression).join(' · ');
  }

  // Canonical expression
  const canonicalList = Array.from(mustCoverMinterms).sort((a, b) => a - b);
  const canonicalExpression = form === 'SOP'
    ? `Σm(${canonicalList.join(', ')})` + (dontCares.length > 0 ? ` + d(${dontCares.join(', ')})` : '')
    : `ΠM(${canonicalList.join(', ')})` + (dontCares.length > 0 ? ` · d(${dontCares.join(', ')})` : '');

  return {
    variableCount: count,
    variables: varNames,
    form,
    cells,
    rowLabels,
    colLabels,
    groups: finalGroups,
    simplifiedExpression,
    canonicalExpression,
    explanationSteps
  };
}
