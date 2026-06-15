<script lang="ts">
  import { tick } from 'svelte';
  import Nonogram from './Nonogram.svelte';
  import PuzzleCard from './lib/components/PuzzleCard.svelte';
  import ConfirmModal from './lib/components/ConfirmModal.svelte';
  import { ALL_PUZZLES } from './lib/puzzles';
  import type { Puzzle } from './lib/types';
  import { getProgress, clearAllProgress } from './lib/storage';

  const PUZZLES_PER_PAGE = 12;

  let view = $state<'level-select' | 'game'>('level-select');
  let selectedPuzzle = $state<Puzzle | null>(null);
  let selectedPuzzleOrder = $state(0);
  let userProgress = $state(getProgress());
  let showResetConfirm = $state(false);
  let resetTrigger = $state<HTMLElement | null>(null);
  let currentPage = $state(0);
  let menuHeading = $state<HTMLElement | null>(null);

  const totalPages = $derived(Math.ceil(ALL_PUZZLES.length / PUZZLES_PER_PAGE));
  const visiblePuzzles = $derived(
    ALL_PUZZLES.slice(currentPage * PUZZLES_PER_PAGE, (currentPage + 1) * PUZZLES_PER_PAGE)
  );

  // Keep the document title in sync with the current view so screen-reader and
  // tab-switching users get orientation. The puzzle name stays hidden until won,
  // so the in-game title only references its number.
  $effect(() => {
    document.title =
      view === 'game' ? `Puzzle #${selectedPuzzleOrder} — Nonograms` : 'Nonograms';
  });

  function selectPuzzle(puzzle: Puzzle, order: number) {
    selectedPuzzle = puzzle;
    selectedPuzzleOrder = order;
    view = 'game';
    // Nonogram moves focus to its heading on mount.
  }

  async function goBack() {
    const returnTo = selectedPuzzleOrder;
    userProgress = getProgress();
    view = 'level-select';
    selectedPuzzle = null;

    // Return focus to the card that was open (or the menu heading as a fallback)
    // so keyboard/SR users land back where they were rather than at <body>.
    await tick();
    const card = document.querySelector<HTMLElement>(`.puzzle-square[data-order="${returnTo}"]`);
    (card ?? menuHeading)?.focus();
  }

  function handleResetAll() {
    clearAllProgress();
    userProgress = getProgress();
    showResetConfirm = false;
  }
</script>

<main>
  {#if view === 'level-select'}
    <!-- Make the page behind the confirm dialog inert (non-focusable + hidden
         from assistive tech) while it's open. -->
    <div class="level-select-container" inert={showResetConfirm}>
      <header class="fcc-header">
        <h1 bind:this={menuHeading} tabindex="-1" class="focus-target">Nonogram Puzzles</h1>
        <p>
          Challenge yourself with these logic puzzles. Accurate moves earn you the fastest times!
        </p>
      </header>

      <div class="puzzle-grid">
        {#each visiblePuzzles as puzzle, i (puzzle.id)}
          {@const stats = userProgress.stats[puzzle.id]}
          {@const inProgress = userProgress.inProgress[puzzle.id]}
          {@const completed = !!stats?.completed}
          {@const order = currentPage * PUZZLES_PER_PAGE + i + 1}

          <PuzzleCard
            {puzzle}
            {order}
            {stats}
            inProgress={!!inProgress}
            {completed}
            onclick={() => selectPuzzle(puzzle, order)}
          />
        {/each}
      </div>

      {#if totalPages > 1}
        <div class="pagination">
          <button
            class="page-btn"
            onclick={() => (currentPage -= 1)}
            disabled={currentPage === 0}
            aria-label="Previous page"
          >
            &lsaquo; Prev
          </button>
          <span class="page-indicator">Page {currentPage + 1} / {totalPages}</span>
          <button
            class="page-btn"
            onclick={() => (currentPage += 1)}
            disabled={currentPage === totalPages - 1}
            aria-label="Next page"
          >
            Next &rsaquo;
          </button>
        </div>
      {/if}

      <footer class="fcc-footer">
        <span>
          Made by <a href="https://www.freecodecamp.org/" target="_blank" rel="noopener noreferrer"
            >freeCodeCamp</a
          >
        </span>
        <button
          class="reset-all-btn"
          onclick={(e) => {
            resetTrigger = e.currentTarget;
            showResetConfirm = true;
          }}
        >
          Reset All Progress
        </button>
      </footer>
    </div>

    {#if showResetConfirm}
      <ConfirmModal
        title="Reset All Progress?"
        message="This will permanently delete all your best times and puzzle progress. This action cannot be undone."
        confirmLabel="Yes, Reset Everything"
        returnFocus={resetTrigger}
        onConfirm={handleResetAll}
        onCancel={() => (showResetConfirm = false)}
      />
    {/if}
  {:else if view === 'game' && selectedPuzzle}
    <Nonogram puzzle={selectedPuzzle} order={selectedPuzzleOrder} onBack={goBack} />
  {/if}
</main>

<style>
  main {
    min-height: 100vh;
    background-color: var(--gray-90);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2rem;
    box-sizing: border-box;
  }

  .level-select-container {
    width: 100%;
    max-width: 900px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .fcc-header {
    text-align: center;
    margin-bottom: 3rem;
    border-bottom: 3px solid var(--gray-75);
    width: 100%;
    padding-bottom: 2rem;
  }

  .fcc-header h1 {
    font-size: 3rem;
    color: var(--yellow-gold);
    margin-bottom: 1rem;
    text-transform: uppercase;
  }

  .fcc-header p {
    font-size: 1.25rem;
    color: var(--gray-15);
  }

  .puzzle-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 200px));
    justify-content: center;
    gap: 1.5rem;
    width: 100%;
    margin-bottom: 2rem;
  }

  .pagination {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 3rem;
  }

  .page-btn {
    background: transparent;
    border: 3px solid var(--gray-45);
    color: var(--gray-15);
    font-size: 0.9rem;
    font-weight: 700;
    padding: 8px 20px;
    cursor: pointer;
    transition:
      border-color 0.1s,
      color 0.1s;
  }

  .page-btn:hover:not(:disabled) {
    border-color: var(--yellow-gold);
    color: var(--yellow-gold);
  }

  .page-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .page-indicator {
    font-family: var(--font-mono);
    color: var(--gray-45);
    font-size: 0.9rem;
    font-weight: 700;
    min-width: 110px;
    text-align: center;
  }

  .fcc-footer {
    border-top: 3px solid var(--gray-75);
    width: 100%;
    padding-top: 2rem;
    color: var(--gray-45);
    font-size: 0.9rem;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .reset-all-btn {
    background: transparent;
    border-color: var(--error-red-text);
    color: var(--error-red-text);
    font-size: 0.9rem;
    padding: 8px 16px;
    font-weight: 700;
    cursor: pointer;
  }

  .reset-all-btn:hover {
    background: var(--error-red);
    color: var(--gray-00);
  }

  @media (max-width: 600px) {
    main {
      padding: 1rem;
    }

    .fcc-header {
      margin-bottom: 1.5rem;
      padding-bottom: 1.25rem;
    }

    .fcc-header h1 {
      font-size: 1.85rem;
    }

    .fcc-header p {
      font-size: 1rem;
    }

    .puzzle-grid {
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 1rem;
    }

    .pagination {
      margin-bottom: 2rem;
    }
  }
</style>
