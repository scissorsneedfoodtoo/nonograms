<script lang="ts">
  import { onMount } from 'svelte';
  import {
    createEmptyGrid,
    createEmptyLockedGrid,
    checkWin,
    toggleCell,
    isLineCorrect,
    getColumn,
    getSolutionColumn,
    formatTime,
    isPuzzleInProgress
  } from './lib/gameLogic';
  import type { CellState, Puzzle } from './lib/types';
  import {
    saveBestTime,
    savePuzzleProgress,
    getPuzzleProgress,
    clearPuzzleProgress
  } from './lib/storage';
  import PuzzlePreview from './lib/components/PuzzlePreview.svelte';

  interface Props {
    puzzle: Puzzle;
    onBack: () => void;
  }

  let { puzzle, onBack }: Props = $props();

  const PENALTY_SECONDS = 15;

  // Initialize with empty arrays to satisfy types, real initialization happens in resetGame
  let grid = $state<CellState[][]>([]);
  let locked = $state<boolean[][]>([]);
  let errorState = $state<boolean[][]>([]);
  let isWon = $state(false);

  // Timer and Penalties
  let seconds = $state(0);
  let penalties = $state(0);
  let timerInterval: number | undefined;

  // Derived state for completed rows/cols
  // Use getters to ensure reactivity is tracked correctly
  let completedRows = $derived(
    grid.length > 0 ? grid.map((row, i) => isLineCorrect(row, puzzle.solution[i])) : []
  );
  let completedCols = $derived(
    grid.length > 0
      ? Array.from({ length: puzzle.width }, (_, i) =>
          isLineCorrect(getColumn(grid, i), getSolutionColumn(puzzle.solution, i))
        )
      : []
  );

  let totalPenaltyTime = $derived(penalties * PENALTY_SECONDS);
  let totalTime = $derived(seconds + totalPenaltyTime);

  onMount(() => {
    resetGame();
    return () => {
      if (isPuzzleInProgress(grid) && !isWon) {
        saveProgress();
      }
      stopTimer();
    };
  });

  // Watch for puzzle changes and reset
  $effect(() => {
    // This will run whenever 'puzzle' changes
    // We access puzzle.id to ensure the effect re-runs if the object identity changes
    if (puzzle.id) {
      resetGame();
    }
  });

  function startTimer() {
    stopTimer();
    timerInterval = setInterval(() => {
      if (!isWon) {
        seconds++;
      }
    }, 1000);
  }

  function stopTimer() {
    if (timerInterval) {
      clearInterval(timerInterval);
    }
  }

  function handleExit() {
    if (isPuzzleInProgress(grid) && !isWon) {
      saveProgress();
    } else {
      resetGame(true); // Reset state and timer before navigating back to the menu
    }
    onBack();
  }

  function handleMove(r: number, c: number, action: 'fill' | 'mark') {
    if (isWon || locked[r][c] || errorState[r][c]) return;

    const solutionValue = puzzle.solution[r][c];
    const isMistake =
      (action === 'fill' && solutionValue === 0) || (action === 'mark' && solutionValue === 1);

    if (isMistake) {
      errorState[r][c] = true;
      penalties++;

      setTimeout(() => {
        if (errorState[r]) {
          grid[r][c] = solutionValue === 1 ? 'filled' : 'marked';
          locked[r][c] = true;
          errorState[r][c] = false;

          isWon = checkWin(grid, puzzle.solution);
          if (isWon) {
            stopTimer();
            saveBestTime(puzzle.id, totalTime);
            clearPuzzleProgress(puzzle.id);
          } else {
            saveProgress();
          }
        }
      }, 500);
    } else {
      grid[r][c] = toggleCell(grid[r][c], action);
      isWon = checkWin(grid, puzzle.solution);
      if (isWon) {
        stopTimer();
        saveBestTime(puzzle.id, totalTime);
        clearPuzzleProgress(puzzle.id);
      } else {
        saveProgress();
      }
    }
  }

  function saveProgress() {
    savePuzzleProgress(puzzle.id, grid, seconds, penalties, locked);
  }

  function handleCellClick(r: number, c: number, event: MouseEvent) {
    const action = event.shiftKey || event.button === 2 ? 'mark' : 'fill';
    handleMove(r, c, action);
  }

  function handleKeyDown(event: KeyboardEvent, r: number, c: number) {
    if (isWon) return;

    let nextR = r;
    let nextC = c;

    switch (event.key) {
      case 'ArrowUp':
        nextR = Math.max(0, r - 1);
        break;
      case 'ArrowDown':
        nextR = Math.min(puzzle.height - 1, r + 1);
        break;
      case 'ArrowLeft':
        nextC = Math.max(0, c - 1);
        break;
      case 'ArrowRight':
        nextC = Math.min(puzzle.width - 1, c + 1);
        break;
      case 'x':
      case 'X':
        handleMove(r, c, 'mark');
        return;
      case ' ':
      case 'Enter':
        event.preventDefault();
        handleMove(r, c, 'fill');
        return;
      default:
        return;
    }

    if (nextR !== r || nextC !== c) {
      event.preventDefault();
      const nextBtn = document.querySelector(`.cell-${nextR}-${nextC}`) as HTMLButtonElement;
      nextBtn?.focus();
    }
  }

  function handleContextMenu(event: MouseEvent) {
    event.preventDefault();
  }

  function resetGame(force = false) {
    if (force) {
      clearPuzzleProgress(puzzle.id);
    }
    const saved = !force ? getPuzzleProgress(puzzle.id) : null;
    if (saved) {
      grid = saved.grid;
      locked = saved.locked;
      seconds = saved.seconds;
      penalties = saved.penalties;
    } else {
      grid = createEmptyGrid(puzzle.width, puzzle.height);
      locked = createEmptyLockedGrid(puzzle.width, puzzle.height);
      seconds = 0;
      penalties = 0;
    }
    errorState = createEmptyLockedGrid(puzzle.width, puzzle.height);
    isWon = false;
    startTimer();
  }
</script>

{#if grid.length > 0}
  <div class="game-container">
    <div class="header-nav">
      <button class="back-btn" onclick={handleExit}>&larr; Exit to Menu</button>
      <h1>#{puzzle.id}</h1>
    </div>

    <div class="stats-bar">
      <div class="stat-item">
        Time: <span class="mono">{formatTime(seconds)}</span>
      </div>
      <div class="stat-item">
        Mistakes: <span class="mono error-text">{penalties}</span>
        <span class="penalty-hint">(+{formatTime(totalPenaltyTime)})</span>
      </div>
    </div>

    <div class="nonogram-board" oncontextmenu={handleContextMenu} role="presentation">
      <div class="corner"></div>

      <!-- Column Clues -->
      <div class="col-clues" style="grid-template-columns: repeat({puzzle.width}, 45px);">
        {#each puzzle.colClues as col, i (i)}
          <div
            class="clue-group col"
            class:completed={completedCols[i]}
            aria-label="Column {i + 1} clues: {col.join(', ')}{completedCols[i]
              ? ' - completed'
              : ''}"
          >
            {#each col as num, j (j)}
              <span>{num}</span>
            {/each}
          </div>
        {/each}
      </div>

      <!-- Row Clues -->
      <div class="row-clues" style="grid-template-rows: repeat({puzzle.height}, 45px);">
        {#each puzzle.rowClues as row, i (i)}
          <div
            class="clue-group row"
            class:completed={completedRows[i]}
            aria-label="Row {i + 1} clues: {row.join(', ')}{completedRows[i] ? ' - completed' : ''}"
          >
            {#each row as num, j (j)}
              <span>{num}</span>
            {/each}
          </div>
        {/each}
      </div>

      <!-- The Grid -->
      <div
        class="grid"
        role="grid"
        aria-label="Nonogram grid"
        style="grid-template-columns: repeat({puzzle.width}, 45px); grid-template-rows: repeat({puzzle.height}, 45px);"
      >
        {#each grid as row, r (r)}
          {#each row as cell, c (c)}
            <button
              class="cell {cell} cell-{r}-{c}"
              class:error={errorState[r] && errorState[r][c]}
              class:locked={locked[r] && locked[r][c]}
              onclick={(e) => handleCellClick(r, c, e)}
              onkeydown={(e) => handleKeyDown(e, r, c)}
              oncontextmenu={(e) => {
                e.preventDefault();
                handleMove(r, c, 'mark');
              }}
              aria-label="Row {r + 1}, Column {c + 1}: {cell}"
              aria-pressed={cell === 'filled'}
              disabled={isWon || (locked[r] && locked[r][c] && !isWon)}
            >
              {#if cell === 'marked'}
                <span aria-hidden="true">&times;</span>
              {/if}
            </button>
          {/each}
        {/each}
      </div>
    </div>

    <div class="controls">
      <button onclick={() => resetGame(true)}> Reset Puzzle </button>
    </div>

    <div class="instructions">
      <p>
        <strong>Controls:</strong> Left Click / Space / Enter to Fill | Right Click / X to Mark (X)
      </p>
      <p>Use Arrow Keys to navigate the grid</p>
      <p class="penalty-notice">
        Note: Incorrect moves are auto-corrected and add <strong>{PENALTY_SECONDS}s</strong> to your total
        time.
      </p>
    </div>
  </div>

  {#if isWon}
    <div class="modal-backdrop" aria-live="polite">
      <div class="win-message" role="dialog" aria-modal="true" aria-labelledby="win-title">
        <h2 id="win-title">Puzzle Completed! 🎉</h2>
        <h3>{puzzle.name}</h3>
        <div class="win-preview">
          <PuzzlePreview {puzzle} completed={true} inProgress={false} size={150} />
        </div>
        <div class="stats-summary">
          <p>Base Time: <span class="mono">{formatTime(seconds)}</span></p>
          <p>Penalties: <span class="mono error-text">{penalties}</span> ({formatTime(totalPenaltyTime)})</p>
          <p class="final-total">Total Time: <span class="mono">{formatTime(totalTime)}</span></p>
        </div>
        <button class="primary" onclick={handleExit} style="margin-top: 2rem;">
          Back to Levels
        </button>
      </div>
    </div>
  {/if}
{/if}

<style>
  .game-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: var(--gray-90);
  }

  .header-nav {
    display: flex;
    width: 100%;
    max-width: 800px;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    border-bottom: 3px solid var(--gray-75);
    padding-bottom: 1rem;
  }

  .back-btn {
    padding: 8px 16px;
    font-size: 1rem;
    border-width: 2px;
  }

  .stats-bar {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
    padding: 10px 20px;
    background-color: var(--gray-85);
    border: 3px solid var(--gray-00);
    width: 100%;
    max-width: 500px;
    justify-content: space-around;
  }

  .stat-item {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--gray-00);
  }

  .mono {
    font-family: var(--font-mono);
  }

  .error-text {
    color: var(--warning-orange);
  }

  .penalty-hint {
    font-size: 0.9rem;
    color: var(--gray-45);
    margin-left: 5px;
  }

  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(10, 10, 35, 0.9);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .win-message {
    font-size: 1.25rem;
    color: var(--yellow-gold);
    text-transform: uppercase;
    border: 5px solid var(--yellow-gold);
    padding: 40px;
    background-color: var(--gray-85);
    text-align: center;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  }

  .win-message h2 {
    margin-bottom: 0.5rem;
    color: var(--yellow-gold);
    font-size: 2rem;
  }

  .win-message h3 {
    margin-bottom: 1.5rem;
    color: var(--gray-00);
    text-transform: none;
    font-size: 1.5rem;
  }

  .win-preview {
    display: flex;
    justify-content: center;
    margin-bottom: 2rem;
    background-color: var(--gray-00);
    padding: 10px;
    border: 3px solid var(--gray-75);
    width: fit-content;
    margin-left: auto;
    margin-right: auto;
  }

  .stats-summary {
    background-color: var(--gray-90);
    padding: 1.5rem;
    border: 2px solid var(--gray-75);
    margin-bottom: 1rem;
  }

  .win-message p {
    margin: 8px 0;
    color: var(--gray-15);
    text-transform: none;
    font-size: 1.1rem;
  }

  .final-total {
    font-size: 1.5rem;
    font-weight: 900;
    color: var(--yellow-gold) !important;
    margin-top: 15px !important;
    border-top: 1px solid var(--gray-75);
    padding-top: 10px;
  }

  .nonogram-board {
    display: grid;
    grid-template-areas:
      'corner col-clues'
      'row-clues grid';
    gap: 0;
    border: 3px solid var(--gray-00);
    padding: 20px;
    background-color: var(--gray-85);
  }

  .corner {
    grid-area: corner;
  }

  .col-clues {
    grid-area: col-clues;
    display: grid;
    align-items: end;
  }

  .row-clues {
    grid-area: row-clues;
    display: grid;
    justify-items: end;
  }

  .grid {
    grid-area: grid;
    display: grid;
    background-color: var(--gray-00);
    gap: 1px;
    border: 1px solid var(--gray-00);
  }

  .clue-group {
    display: flex;
    font-family: var(--font-mono);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--gray-00);
    padding: 8px;
    transition: all 0.2s;
  }

  .clue-group.completed {
    color: var(--gray-45);
    text-decoration: line-through;
    opacity: 0.6;
  }

  .clue-group.col {
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    min-height: 100px;
  }

  .clue-group.row {
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    min-width: 100px;
  }

  .cell {
    width: 45px;
    height: 45px;
    background-color: var(--gray-00);
    border: 1px solid var(--gray-15);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-mono);
    font-size: 1.75rem;
    font-weight: 900;
    cursor: pointer;
    padding: 0;
    border-radius: 0;
    transition: background-color 0.1s;
  }

  .cell.filled {
    background-color: var(--gray-90);
    border-color: var(--gray-75);
  }

  .cell.marked {
    color: var(--gray-90);
  }

  .cell.locked {
    cursor: not-allowed;
    background-color: var(--gray-05);
  }

  .cell.filled.locked {
    background-color: var(--gray-90);
    opacity: 0.8;
  }

  .cell.error {
    background-color: var(--error-red) !important;
    color: var(--gray-00) !important;
  }

  .cell:not(:disabled):hover {
    background-color: var(--gray-10);
  }

  .cell.filled:not(:disabled):hover {
    background-color: var(--gray-85);
  }

  .cell:focus-visible {
    outline: 5px solid var(--yellow-gold);
    outline-offset: -5px;
    z-index: 10;
  }

  .controls {
    margin-top: 3rem;
    display: flex;
    gap: 1.5rem;
  }

  .instructions {
    margin-top: 2rem;
    text-align: center;
    color: var(--gray-15);
    max-width: 600px;
    line-height: 1.8;
    border-top: 3px solid var(--gray-75);
    padding-top: 1.5rem;
    font-size: 1.1rem;
    font-family: var(--font-family);
  }

  .instructions strong {
    color: var(--yellow-gold);
    font-weight: 900;
  }

  .penalty-notice {
    font-size: 0.9rem;
    margin-top: 10px;
    color: var(--gray-45);
  }
</style>
