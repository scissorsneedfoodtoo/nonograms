<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { createEmptyGrid } from '../gameLogic';
  import { TUTORIAL_PUZZLE as puzzle, TUTORIAL_STEPS as steps } from '../tutorial';
  import type { CellState } from '../types';

  interface Props {
    onBack: () => void;
  }

  let { onBack }: Props = $props();

  let grid = $state<CellState[][]>(createEmptyGrid(puzzle.width, puzzle.height));
  let stepIndex = $state(0);
  let headingEl = $state<HTMLElement | null>(null);

  const isDone = $derived(stepIndex >= steps.length);
  const step = $derived(isDone ? null : steps[stepIndex]);

  // Cell patterns for the 'overlap' diagram: a [4] block in a column of 5, shown
  // slid all the way up, slid all the way down, and the cells covered in both
  // (always filled). Mirrors the overlapping step's reasoning.
  const overlapColumns = [
    { label: 'Slid up', tone: 'up', cells: [true, true, true, true, false] },
    { label: 'Slid down', tone: 'down', cells: [false, true, true, true, true] },
    { label: 'Always filled', tone: 'both', cells: [false, true, true, true, false] },
  ];

  // "r-c" -> expected state for the cells the current step asks the player to act
  // on. Fills become 'filled', crosses become 'marked'.
  const activeCells = $derived.by(() => {
    const map: Record<string, CellState> = {};
    if (step) {
      for (const [r, c] of step.fills) map[`${r}-${c}`] = 'filled';
      for (const [r, c] of step.crosses) map[`${r}-${c}`] = 'marked';
    }
    return map;
  });

  const activeCount = $derived(Object.keys(activeCells).length);

  // Cells that MUST be set to finish the step. Normally every active cell, but on
  // a completeOnFill step the crosses are optional, so only the fills are required.
  const requiredCells = $derived.by(() => {
    const map: Record<string, CellState> = {};
    if (step) {
      for (const [r, c] of step.fills) map[`${r}-${c}`] = 'filled';
      if (!step.completeOnFill) for (const [r, c] of step.crosses) map[`${r}-${c}`] = 'marked';
    }
    return map;
  });

  // The step is complete once every required cell matches its expected state.
  // Steps with no required cells (the intro) are complete immediately.
  const stepComplete = $derived(
    Object.entries(requiredCells).every(([key, expected]) => {
      const [r, c] = key.split('-').map(Number);
      return grid[r][c] === expected;
    }),
  );

  // On the final step, filling the last image cell ends the tutorial right away —
  // like winning the real game, where the optional X marks never gate the win.
  $effect(() => {
    if (!isDone && step?.completeOnFill && stepComplete) {
      stepIndex = steps.length;
    }
  });

  // Announced to screen readers whenever the step changes. The body may be split
  // into paragraphs and contain markup (e.g. <pre> clue chips), so flatten it to
  // a single plain-text string before announcing.
  const liveMessage = $derived.by(() => {
    if (isDone) return `Puzzle solved. It's a ${puzzle.name}. Well done!`;
    if (!step) return '';
    const body = step.body.join(' ').replace(/<[^>]+>/g, '');
    return `Step ${stepIndex + 1} of ${steps.length}. ${step.technique}: ${step.title}. ${body}`;
  });

  function setCells(cells: [number, number][], value: CellState) {
    for (const [r, c] of cells) grid[r][c] = value;
  }

  function applyStep(i: number) {
    setCells(steps[i].fills, 'filled');
    setCells(steps[i].crosses, 'marked');
  }

  function revertStep(i: number) {
    setCells([...steps[i].fills, ...steps[i].crosses], 'empty');
  }

  // Invariant: steps before stepIndex are applied; the current step starts empty
  // so the player can perform it. Next/Back preserve this so navigation is stable.
  function next() {
    if (!stepComplete || isDone) return;
    stepIndex += 1;
  }

  function back() {
    if (stepIndex === 0) return;
    if (stepIndex < steps.length) revertStep(stepIndex); // clear partial progress
    stepIndex -= 1;
    revertStep(stepIndex); // make the step we land on the fresh current step
  }

  function showMe() {
    if (!step) return;
    applyStep(stepIndex);
  }

  function restart() {
    grid = createEmptyGrid(puzzle.width, puzzle.height);
    stepIndex = 0;
    focusHeading();
  }

  function toggleCell(r: number, c: number) {
    const expected = activeCells[`${r}-${c}`];
    if (!expected) return; // only the highlighted cells respond
    grid[r][c] = grid[r][c] === expected ? 'empty' : expected;
  }

  async function focusHeading() {
    await tick();
    headingEl?.focus();
  }

  onMount(focusHeading);
</script>

<div class="tutorial">
  <div class="sr-only" role="status" aria-live="polite" aria-atomic="true">{liveMessage}</div>

  <div class="header-nav">
    <button class="back-btn" onclick={onBack}>
      <span aria-hidden="true">&larr;</span> Exit to Menu
    </button>
    <h1 bind:this={headingEl} tabindex="-1" class="focus-target">How to Play</h1>
  </div>

  <div class="layout">
    <!-- Step panel (placed before the board so reading order matches the visual
         order: panel-left on desktop, panel-on-top when stacked on narrow screens). -->
    <div class="panel">
      {#if isDone}
        <p class="badge">Done</p>
        <h2>You solved it! 🎉</h2>
        <p class="reveal-name">It's a {puzzle.name}!</p>
        <p class="body">
          That is every core technique: full lines, overlapping, crosses, and joining and splitting.
          Real puzzles hide a picture like this one — you are ready to play.
        </p>
        <div class="actions">
          <button class="btn primary" onclick={onBack}>Back to puzzles</button>
          <button class="btn" onclick={restart}>Replay tutorial</button>
        </div>
      {:else if step}
        <p class="badge">{step.technique}</p>
        <h2>{step.title}</h2>
        {#each step.body as paragraph, i (i)}
          <!-- A diagram, if any, sits just before the final (actionable) paragraph. -->
          {#if step.diagram === 'overlap' && i === step.body.length - 1}
            <!-- Illustrative only; the body paragraphs describe it for screen readers. -->
            <div class="overlap-diagram" aria-hidden="true">
              {#each overlapColumns as col (col.label)}
                <div class="od-col">
                  <div class="od-cells">
                    {#each col.cells as on, r (r)}
                      <span class="od-cell {on ? col.tone : ''}"></span>
                    {/each}
                  </div>
                  <span class="od-label">{col.label}</span>
                </div>
              {/each}
            </div>
          {/if}
          <!-- Body text is static, trusted content from tutorial.ts (only <pre> clue
               chips), never user input, so {@html} is safe here. -->
          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
          <p class="body">{@html paragraph}</p>
        {/each}

        {#if activeCount > 0 && !stepComplete}
          <p class="hint">Click the highlighted cells, or use “Show me”.</p>
        {:else if activeCount > 0 && stepComplete}
          <p class="hint done">Nice — that is the move. Click Next.</p>
        {/if}

        <div class="actions">
          <button class="btn" onclick={back} disabled={stepIndex === 0}>&lsaquo; Back</button>
          {#if activeCount > 0}
            <button class="btn" onclick={showMe} disabled={stepComplete}>Show me</button>
          {/if}
          <button class="btn primary" onclick={next} disabled={!stepComplete}>
            {stepIndex === steps.length - 1 ? 'Finish' : 'Next'} &rsaquo;
          </button>
        </div>

        <p class="progress" aria-hidden="true">Step {stepIndex + 1} of {steps.length}</p>
      {/if}
    </div>

    <!-- Board -->
    <div class="board" style="--cols: {puzzle.width}; --rows: {puzzle.height};">
      <div class="corner"></div>

      <div
        class="col-clues"
        style="grid-template-columns: repeat({puzzle.width}, var(--cell-size));"
      >
        {#each puzzle.colClues as col, i (i)}
          <div class="clue-group col" class:highlight={step?.highlightCols?.includes(i)}>
            {#each col as num, j (j)}
              <span>{num}</span>
            {/each}
          </div>
        {/each}
      </div>

      <div class="row-clues" style="grid-template-rows: repeat({puzzle.height}, var(--cell-size));">
        {#each puzzle.rowClues as row, i (i)}
          <div class="clue-group row" class:highlight={step?.highlightRows?.includes(i)}>
            {#each row as num, j (j)}
              <span>{num}</span>
            {/each}
          </div>
        {/each}
      </div>

      <div class="grid">
        {#each grid as gridRow, r (r)}
          <div class="grid-row">
            {#each gridRow as cell, c (c)}
              {@const expected = activeCells[`${r}-${c}`]}
              {@const isTarget = expected !== undefined}
              {@const pending = isTarget && cell !== expected}
              {@const reveal = isDone ? puzzle.revealColors?.[r][c] : undefined}
              <button
                class="cell"
                class:empty={cell === 'empty'}
                class:filled={cell === 'filled'}
                class:marked={cell === 'marked'}
                class:target={isTarget}
                class:target-cross={expected === 'marked'}
                class:pending
                class:revealed={isDone}
                style:background-color={reveal}
                data-cell="{r}-{c}"
                aria-disabled={!isTarget}
                tabindex={isTarget ? 0 : -1}
                onclick={() => toggleCell(r, c)}
                aria-label="Row {r + 1}, Column {c + 1}: {cell}{isTarget
                  ? expected === 'marked'
                    ? '. Mark this cell with an X'
                    : '. Fill this cell'
                  : ''}"
              >
                {#if cell === 'marked' && !isDone}
                  <span aria-hidden="true">&times;</span>
                {/if}
              </button>
            {/each}
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .tutorial {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: var(--gray-90);
    width: 100%;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .header-nav {
    display: flex;
    width: 100%;
    max-width: 900px;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    border-bottom: 3px solid var(--gray-75);
    padding-bottom: 1rem;
  }

  .header-nav h1 {
    font-size: 1.75rem;
    color: var(--yellow-gold);
    text-transform: uppercase;
  }

  .back-btn {
    padding: 8px 16px;
    font-size: 1rem;
    border-width: 2px;
  }

  .layout {
    display: flex;
    flex-wrap: wrap;
    gap: 2.5rem;
    justify-content: center;
    align-items: flex-start;
    width: 100%;
    max-width: 900px;
  }

  /* ---- Board (mirrors the game board) ---- */
  .board {
    --cell-size: 48px;
    --clue-size: 90px;
    --clue-font: 1.2rem;
    display: grid;
    grid-template-areas:
      'corner col-clues'
      'row-clues grid';
    gap: 0;
    border: 4px solid var(--gray-90);
    padding: 16px;
    background-color: var(--gray-85);
  }

  .corner {
    grid-area: corner;
    border-right: 1px solid var(--clue-divider);
    border-bottom: 1px solid var(--clue-divider);
  }

  .col-clues {
    grid-area: col-clues;
    display: grid;
    align-items: end;
    border-bottom: 4px solid var(--gray-90);
  }

  .row-clues {
    grid-area: row-clues;
    display: grid;
    justify-items: end;
    border-right: 4px solid var(--gray-90);
  }

  .grid {
    grid-area: grid;
    display: flex;
    flex-direction: column;
    background-color: var(--gray-90);
  }

  .grid-row {
    display: flex;
  }

  .clue-group {
    display: flex;
    font-family: var(--font-mono);
    font-size: var(--clue-font);
    font-weight: 700;
    color: var(--gray-00);
    padding: 8px;
    box-sizing: border-box;
    transition: all 0.15s;
  }

  .clue-group.col {
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    min-height: var(--clue-size);
    box-shadow: inset -1px 0 0 var(--clue-divider);
  }

  .clue-group.row {
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    min-width: var(--clue-size);
    gap: 6px;
    box-shadow: inset 0 -1px 0 var(--clue-divider);
  }

  .clue-group.highlight {
    background-color: var(--yellow-gold);
    color: var(--gray-90);
    border-radius: 4px;
  }

  .cell {
    width: var(--cell-size);
    height: var(--cell-size);
    /* Normalize native button rendering so author backgrounds always win. */
    appearance: none;
    -webkit-appearance: none;
    background-color: var(--gray-00);
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-mono);
    font-size: calc(var(--cell-size) * 0.6);
    font-weight: 900;
    padding: 0;
    box-sizing: border-box;
    position: relative;
    z-index: 0;
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    box-shadow:
      inset -1px 0 0 var(--cell-divider),
      inset 0 -1px 0 var(--cell-divider);
  }

  .cell[aria-disabled='true'] {
    cursor: default;
  }

  .cell.target {
    cursor: pointer;
  }

  .cell.filled {
    background-color: var(--gray-90);
    box-shadow:
      inset -1px 0 0 var(--cell-divider-filled),
      inset 0 -1px 0 var(--cell-divider-filled);
  }

  .cell.marked {
    color: var(--gray-90);
  }

  /* Final reveal: the revealColors paints each cell, so soften the grid lines
     to near-invisible and let the picture read as a whole. */
  .cell.revealed {
    box-shadow:
      inset -1px 0 0 rgba(0, 0, 0, 0.08),
      inset 0 -1px 0 rgba(0, 0, 0, 0.08);
  }

  /* Ring on cells the current step still needs the player to act on. The static
     box-shadow is the baseline cue; the animation only pulses it, so the
     highlight survives when prefers-reduced-motion disables animations. */
  .cell.pending {
    --pulse-color: var(--yellow-gold);
    z-index: 5;
    box-shadow: inset 0 0 0 4px var(--pulse-color);
    animation: pulse 1.2s ease-in-out infinite;
  }

  .cell.pending.target-cross {
    --pulse-color: #7ec8ff;
  }

  @keyframes pulse {
    0%,
    100% {
      box-shadow: inset 0 0 0 3px var(--pulse-color);
    }
    50% {
      box-shadow: inset 0 0 0 6px var(--pulse-color);
    }
  }

  .cell.target:hover {
    background-color: var(--gray-10);
  }

  .cell.target.filled:hover {
    background-color: var(--gray-85);
  }

  .cell:focus-visible {
    outline: 3px solid var(--gray-90);
    outline-offset: -3px;
    box-shadow: inset 0 0 0 6px var(--yellow-gold);
    z-index: 10;
  }

  /* ---- Step panel ---- */
  .panel {
    flex: 1 1 320px;
    max-width: 420px;
    min-width: 280px;
    background-color: var(--gray-85);
    border: 3px solid var(--gray-00);
    padding: 1.5rem;
    color: var(--gray-00);
  }

  .badge {
    display: inline-block;
    font-family: var(--font-mono);
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--gray-90);
    background-color: var(--yellow-gold);
    padding: 3px 10px;
    margin: 0 0 0.75rem;
  }

  .panel h2 {
    font-size: 1.4rem;
    margin: 0 0 0.75rem;
    color: var(--gray-00);
  }

  .reveal-name {
    font-size: 1.15rem;
    font-weight: 700;
    color: var(--yellow-gold);
    margin: 0 0 1rem;
  }

  .body {
    font-size: 1.05rem;
    line-height: 1.7;
    color: var(--gray-05);
    margin: 0 0 1rem;
  }

  /* Clue chips written as <pre> inside body text (injected via {@html}, so they
     need :global). Styled like freeCodeCamp inline code: a dark rounded chip that
     stays inline within the sentence instead of breaking onto its own line. */
  .body :global(pre) {
    display: inline;
    margin: 0;
    padding: 1px 4px;
    font-family: var(--font-mono);
    font-size: 0.95em;
    white-space: nowrap;
    color: var(--gray-10);
    background: #2a2a40;
    border: 1px solid var(--gray-45);
  }

  /* Overlap technique illustration: a [4] block slid up (blue), slid down (pink),
     and the cells covered both ways (purple = always filled). Each column takes
     an equal share of the width so the three strips are evenly spaced. */
  .overlap-diagram {
    display: flex;
    /* Equal-width columns keep the strips evenly spaced; the capped, centered
       width keeps the three grouped together rather than spread across the panel. */
    max-width: 260px;
    margin: 0 auto 1.25rem;
  }

  .od-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.4rem;
  }

  .od-cells {
    width: max-content;
    /* Dark, board-matching frame so the light cells stand out on the panel. */
    border: 2px solid var(--gray-90);
  }

  .od-cell {
    display: block;
    width: 22px;
    height: 22px;
    background: var(--gray-00); /* empty cells read white, like the real board */
    border-bottom: 1px solid var(--gray-90);
  }

  .od-cell:last-child {
    border-bottom: none;
  }

  /* freeCodeCamp style-guide palette. */
  .od-cell.up {
    background: var(--fcc-blue);
  }

  .od-cell.down {
    /* A light pink that, blended 50/50 with --fcc-blue, lands on --fcc-purple —
       so the overlap reads as "blue + pink = purple". */
    background: #ffa7ff;
  }

  .od-cell.both {
    background: var(--fcc-purple);
  }

  .od-label {
    font-size: 0.8rem;
    color: var(--gray-15);
  }

  .hint {
    font-size: 0.95rem;
    color: var(--gray-15);
    margin: 0 0 1rem;
  }

  .hint.done {
    color: var(--yellow-gold);
    font-weight: 700;
  }

  .actions {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .btn {
    padding: 10px 18px;
    font-size: 1rem;
    font-weight: 700;
    border: 3px solid var(--gray-45);
    background: var(--gray-90);
    color: var(--gray-00);
    cursor: pointer;
  }

  .btn:hover:not(:disabled) {
    border-color: var(--yellow-gold);
    color: var(--yellow-gold);
  }

  .btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .btn.primary {
    background: var(--yellow-gold);
    border-color: var(--yellow-gold);
    color: var(--gray-90);
  }

  .btn.primary:hover:not(:disabled) {
    background: var(--yellow-hover);
    border-color: var(--yellow-hover);
    color: var(--gray-90);
  }

  .progress {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    color: var(--gray-45);
    margin: 0;
  }

  @media (max-width: 600px) {
    .board {
      --cell-size: 40px;
      --clue-size: 64px;
      --clue-font: 1rem;
    }

    .header-nav h1 {
      font-size: 1.3rem;
    }
  }
</style>
