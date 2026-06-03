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
  import WinModal from './lib/components/WinModal.svelte';

  interface Props {
    puzzle: Puzzle;
    order: number;
    onBack: () => void;
  }

  let { puzzle, order, onBack }: Props = $props();

  const PENALTY_SECONDS = 15;

  // Initialize with empty arrays to satisfy types, real initialization happens in resetGame
  let grid = $state<CellState[][]>([]);
  let locked = $state<boolean[][]>([]);
  let errorState = $state<boolean[][]>([]);
  let isWon = $state(false);

  // Tap mode for touch devices: a plain click/tap fills or marks based on this.
  // Desktop users can still right-click / shift-click to mark regardless of mode.
  let mode = $state<'fill' | 'mark'>('fill');

  // Timer and Penalties
  let seconds = $state(0);
  let penalties = $state(0);
  let timerInterval: ReturnType<typeof setInterval> | undefined;

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

  function devCompleteGame() {
    if (!import.meta.env.DEV) return;
    stopTimer();
    isWon = true;
    saveBestTime(puzzle.id, totalTime);
    clearPuzzleProgress(puzzle.id);
  }

  onMount(() => {
    resetGame();

    function handleDevShortcut(e: KeyboardEvent) {
      if (e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey && e.key === 'F') {
        devCompleteGame();
      }
    }

    if (import.meta.env.DEV) {
      document.addEventListener('keydown', handleDevShortcut);
    }

    return () => {
      if (import.meta.env.DEV) {
        document.removeEventListener('keydown', handleDevShortcut);
      }
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
    // Shift-click always marks (desktop power users); otherwise follow the active tap mode.
    const action = event.shiftKey || event.button === 2 ? 'mark' : mode;
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
      <h1>#{order} — {isWon ? puzzle.name : '???'}</h1>
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

    <div class="mode-toggle" role="group" aria-label="Tap mode">
      <button
        class="mode-btn"
        class:active={mode === 'fill'}
        onclick={() => (mode = 'fill')}
        aria-pressed={mode === 'fill'}
        disabled={isWon}
      >
        <span class="mode-swatch fill" aria-hidden="true"></span> Fill
      </button>
      <button
        class="mode-btn"
        class:active={mode === 'mark'}
        onclick={() => (mode = 'mark')}
        aria-pressed={mode === 'mark'}
        disabled={isWon}
      >
        <span class="mode-swatch mark" aria-hidden="true">&times;</span> Mark
      </button>
    </div>

    <div
      class="nonogram-board"
      style="--cols: {puzzle.width}; --rows: {puzzle.height};"
      oncontextmenu={handleContextMenu}
      role="presentation"
    >
      <div class="corner"></div>

      <!-- Column Clues -->
      <div class="col-clues" style="grid-template-columns: repeat({puzzle.width}, var(--cell-size));">
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
      <div class="row-clues" style="grid-template-rows: repeat({puzzle.height}, var(--cell-size));">
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
        style="grid-template-columns: repeat({puzzle.width}, var(--cell-size)); grid-template-rows: repeat({puzzle.height}, var(--cell-size));"
      >
        {#each grid as row, r (r)}
          {#each row as cell, c (c)}
            <button
              class="cell {cell} cell-{r}-{c}"
              class:error={errorState[r] && errorState[r][c]}
              class:locked={locked[r] && locked[r][c]}
              class:thick-border-right={(c + 1) % 5 === 0 && c + 1 !== puzzle.width}
              class:thick-border-bottom={(r + 1) % 5 === 0 && r + 1 !== puzzle.height}
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
      <p class="touch-controls">
        <strong>Touch:</strong> Pick <strong>Fill</strong> or <strong>Mark</strong> above, then tap
        cells. Drag to scroll larger puzzles — the clues stay pinned.
      </p>
      <p class="desktop-controls">
        <strong>Desktop:</strong> Left Click / Space / Enter to Fill | Right Click / Shift+Click / X to
        Mark
      </p>
      <p class="desktop-controls">Use Arrow Keys to navigate the grid</p>
      <p class="penalty-notice">
        Note: Incorrect moves are auto-corrected and add <strong>{PENALTY_SECONDS}s</strong> to your total
        time.
      </p>
      {#if import.meta.env.DEV}
        <p class="dev-hint"><strong>Dev:</strong> <kbd>Shift+F</kbd> to auto-complete puzzle</p>
      {/if}
    </div>
  </div>

  {#if isWon}
    <WinModal {puzzle} {seconds} {penalties} {totalPenaltyTime} {totalTime} onClose={handleExit} />
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

  .mode-toggle {
    display: flex;
    gap: 0;
    margin-bottom: 1.5rem;
  }

  .mode-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 24px;
    font-size: 1.1rem;
    font-weight: 700;
    border-width: 3px;
    border-color: var(--gray-45);
    background: var(--gray-85);
    color: var(--gray-15);
  }

  .mode-btn:first-child {
    border-right-width: 0;
  }

  .mode-btn.active {
    background: var(--yellow-gold);
    border-color: var(--yellow-gold);
    color: var(--gray-90);
  }

  .mode-btn.active:hover,
  .mode-btn.active:focus-visible {
    background: var(--yellow-hover);
    border-color: var(--yellow-hover);
    color: var(--gray-90);
  }

  .mode-swatch {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    font-weight: 900;
    line-height: 1;
  }

  .mode-swatch.fill {
    background: currentColor;
    border: 2px solid currentColor;
  }

  .mode-swatch.mark {
    font-size: 1.3rem;
  }

  .touch-controls {
    display: none;
  }

  .nonogram-board {
    /* Cell and clue-gutter sizing. Overridden responsively below; --cols/--rows
       are injected inline per-puzzle so the board can scale to fit the viewport. */
    --cell-size: 45px;
    --clue-size: 100px;
    --clue-font: 1.25rem;
    display: grid;
    grid-template-areas:
      'corner col-clues'
      'row-clues grid';
    gap: 0;
    border: 4px solid var(--gray-90);
    padding: 20px;
    background-color: var(--gray-85);
    max-width: 100%;
  }

  .corner {
    grid-area: corner;
    border-right: 1px solid var(--gray-75);
    border-bottom: 1px solid var(--gray-75);
  }

  .col-clues {
    grid-area: col-clues;
    display: grid;
    align-items: end;
    background-color: var(--gray-85);
    border-bottom: 4px solid var(--gray-90);
  }

  .row-clues {
    grid-area: row-clues;
    display: grid;
    justify-items: end;
    background-color: var(--gray-85);
    border-right: 4px solid var(--gray-90);
  }

  .grid {
    grid-area: grid;
    display: grid;
    /* Dark like the separators (cells fully tile over this). Keeps any
       sub-pixel seam at the sticky-gutter edge from flashing white on scroll. */
    background-color: var(--gray-90);
    gap: 0;
  }

  .clue-group {
    display: flex;
    font-family: var(--font-mono);
    font-size: var(--clue-font);
    font-weight: 700;
    color: var(--gray-00);
    padding: 8px;
    transition: all 0.2s;
    box-sizing: border-box;
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
    min-height: var(--clue-size);
    box-shadow: inset -1px 0 0 var(--gray-75);
  }

  .clue-group.row {
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    min-width: var(--clue-size);
    gap: 6px;
    box-shadow: inset 0 -1px 0 var(--gray-75);
  }

  .cell {
    width: var(--cell-size);
    height: var(--cell-size);
    background-color: var(--gray-00);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-mono);
    font-size: calc(var(--cell-size) * 0.6);
    font-weight: 900;
    cursor: pointer;
    padding: 0;
    border-radius: 0;
    transition: background-color 0.1s;
    box-sizing: border-box;
    position: relative;
    z-index: 0;
    /* Prevent the browser from hijacking taps with double-tap-zoom / text selection */
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }

  /* Default thin shadows */
  .cell {
    --r-shadow: inset -1px 0 0 var(--gray-15);
    --b-shadow: inset 0 -1px 0 var(--gray-15);
    box-shadow: var(--r-shadow), var(--b-shadow);
  }

  /* Thick overrides and z-index boost */
  .cell.thick-border-right {
    --r-shadow: inset -4px 0 0 var(--gray-90);
    z-index: 1;
    /* When vertical is thick, prioritize it in the stack */
    box-shadow: var(--r-shadow), var(--b-shadow);
  }

  .cell.thick-border-bottom {
    --b-shadow: inset 0 -4px 0 var(--gray-90);
    z-index: 1;
    /* When horizontal is thick, prioritize it in the stack */
    box-shadow: var(--b-shadow), var(--r-shadow);
  }

  /* If both are thick, order is less critical but vertical remains primary */
  .cell.thick-border-right.thick-border-bottom {
    z-index: 2;
    box-shadow: var(--r-shadow), var(--b-shadow);
  }

  /* Handle filled state colors - keep dividers visible */
  .cell.filled {
    background-color: var(--gray-90);
    --r-shadow: inset -1px 0 0 var(--gray-75);
    --b-shadow: inset 0 -1px 0 var(--gray-75);
  }

  .cell.filled.thick-border-right {
    --r-shadow: inset -4px 0 0 var(--gray-75);
  }

  .cell.filled.thick-border-bottom {
    --b-shadow: inset 0 -4px 0 var(--gray-75);
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
    box-shadow: none;
  }

  .cell:not(:disabled):hover {
    background-color: var(--gray-10);
  }

  .cell.filled:not(:disabled):hover {
    background-color: var(--gray-85);
  }

  .cell:focus-visible {
    outline: 4px solid var(--yellow-gold);
    outline-offset: -4px;
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

  .dev-hint {
    font-size: 0.85rem;
    margin-top: 12px;
    color: var(--gray-45);
    border-top: 1px dashed var(--gray-75);
    padding-top: 10px;
  }

  .dev-hint kbd {
    display: inline-block;
    padding: 1px 6px;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    background-color: var(--gray-85);
    border: 1px solid var(--gray-45);
    border-radius: 3px;
  }

  /* Touch devices: surface the tap-mode hint, hide keyboard/mouse instructions. */
  @media (hover: none) and (pointer: coarse) {
    .touch-controls {
      display: block;
    }
    .desktop-controls {
      display: none;
    }
  }

  /* Phones / narrow viewports: scale the board to fit and tighten chrome. */
  @media (max-width: 600px) {
    .game-container {
      padding: 12px;
      /* Allow children to shrink below their content width so the board can
         be capped to the viewport and scroll internally. */
      max-width: 100%;
      min-width: 0;
    }

    .header-nav {
      flex-wrap: wrap;
      gap: 0.75rem;
      margin-bottom: 1.25rem;
      padding-bottom: 0.75rem;
    }

    .header-nav h1 {
      font-size: 1.3rem;
    }

    .back-btn {
      font-size: 0.9rem;
      padding: 6px 12px;
    }

    .stats-bar {
      gap: 1rem;
      padding: 8px 12px;
      margin-bottom: 1.25rem;
    }

    .stat-item {
      font-size: 1rem;
    }

    /* Keep cells finger-sized and let the board scroll instead of shrinking.
       The board becomes its own scroll viewport; the clue gutters are frozen
       via position: sticky so they stay aligned while the grid scrolls. */
    .nonogram-board {
      --clue-size: 48px;
      --clue-font: 0.8rem;
      --cell-size: 44px;
      padding: 0;
      max-width: 100%;
      min-width: 0;
      max-height: 72vh;
      overflow: auto;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
    }

    /* Gutters must sit above every cell z-index. Cells reach z-index 2 at the
       thick every-5 gridline intersections (and 10 on keyboard focus), so the
       frozen clues use higher values to avoid the grid bleeding past them. */
    .corner {
      position: sticky;
      top: 0;
      left: 0;
      z-index: 21;
      background-color: var(--gray-85);
    }

    .col-clues {
      position: sticky;
      top: 0;
      z-index: 20;
    }

    .row-clues {
      position: sticky;
      left: 0;
      z-index: 20;
    }

    .clue-group {
      padding: 4px;
    }

    .clue-group.row {
      gap: 3px;
    }

    .mode-btn {
      flex: 1;
      padding: 12px 16px;
    }

    .mode-toggle {
      width: 100%;
      max-width: 320px;
    }

    .controls {
      margin-top: 2rem;
    }

    .instructions {
      margin-top: 1.5rem;
      font-size: 0.95rem;
      line-height: 1.6;
    }
  }
</style>
