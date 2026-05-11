/**
 * Generates all possible bit patterns for a line of a given length that satisfy the clues.
 */
export function generatePossibleLines(clues: number[], length: number): number[][] {
  const result: number[][] = [];

  // clues = [0] means the line is empty
  if (clues.length === 1 && clues[0] === 0) {
    return [new Array(length).fill(0)];
  }

  function backtrack(clueIdx: number, currentPos: number, currentLine: number[]) {
    // Base case: all clues placed
    if (clueIdx === clues.length) {
      // Fill remaining with 0
      const completeLine = [...currentLine];
      while (completeLine.length < length) {
        completeLine.push(0);
      }
      result.push(completeLine);
      return;
    }

    const currentClue = clues[clueIdx];
    const remainingCluesSum = clues.slice(clueIdx + 1).reduce((a, b) => a + b, 0);
    const remainingCluesCount = clues.length - (clueIdx + 1);
    const minSpaceNeeded = currentClue + (remainingCluesCount > 0 ? 1 : 0) + remainingCluesSum + Math.max(0, remainingCluesCount - 1);

    // Try placing the current clue at every possible position
    for (let start = currentPos; start <= length - minSpaceNeeded; start++) {
      const newLine = [...currentLine];
      // Pad with 0s until start
      while (newLine.length < start) {
        newLine.push(0);
      }
      // Place block of 1s
      for (let i = 0; i < currentClue; i++) {
        newLine.push(1);
      }
      // Place a trailing 0 if not the last clue
      if (clueIdx < clues.length - 1) {
        newLine.push(0);
        backtrack(clueIdx + 1, start + currentClue + 1, newLine);
      } else {
        backtrack(clueIdx + 1, start + currentClue, newLine);
      }
    }
  }

  backtrack(0, 0, []);
  return result;
}

/**
 * Counts the number of solutions for a nonogram puzzle.
 * Returns 0, 1, or 2 (meaning 2 or more).
 */
export function countSolutions(rowClues: number[][], colClues: number[][]): number {
  const height = rowClues.length;
  const width = colClues.length;

  const possibleRows = rowClues.map((clues) => generatePossibleLines(clues, width));
  const possibleCols = colClues.map((clues) => generatePossibleLines(clues, height));

  let solutionCount = 0;

  function solve(rowIdx: number, currentGrid: number[][]) {
    if (solutionCount >= 2) return;

    if (rowIdx === height) {
      solutionCount++;
      return;
    }

    for (const rowPattern of possibleRows[rowIdx]) {
      // Check if this row pattern is compatible with column possibilities
      let compatible = true;
      for (let c = 0; c < width; c++) {
        const cellValue = rowPattern[c];
        // Check if there is ANY possible column pattern for column 'c'
        // that has cellValue at position rowIdx
        const hasMatch = possibleCols[c].some((colPattern) => colPattern[rowIdx] === cellValue);

        if (!hasMatch) {
          compatible = false;
          break;
        }
      }

      if (compatible) {
        // Optimization: narrow down possibleCols for subsequent rows
        const originalPossibleCols = possibleCols.map((cols) => [...cols]);
        
        let subCompatible = true;
        for (let c = 0; c < width; c++) {
          possibleCols[c] = possibleCols[c].filter((colPattern) => colPattern[rowIdx] === rowPattern[c]);
          if (possibleCols[c].length === 0) {
            subCompatible = false;
            break;
          }
        }

        if (subCompatible) {
          currentGrid.push(rowPattern);
          solve(rowIdx + 1, currentGrid);
          currentGrid.pop();
        }

        // Restore column possibilities
        for (let c = 0; c < width; c++) {
          possibleCols[c] = originalPossibleCols[c];
        }
      }

      if (solutionCount >= 2) return;
    }
  }

  solve(0, []);
  return solutionCount;
}
