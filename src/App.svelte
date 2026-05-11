<script lang="ts">
  import Nonogram from './Nonogram.svelte';
  import PuzzleCard from './lib/components/PuzzleCard.svelte';
  import ConfirmModal from './lib/components/ConfirmModal.svelte';
  import { ALL_PUZZLES } from './lib/puzzles';
  import type { Puzzle } from './lib/types';
  import { getProgress, clearAllProgress } from './lib/storage';

  let view = $state<'level-select' | 'game'>('level-select');
  let selectedPuzzle = $state<Puzzle | null>(null);
  let userProgress = $state(getProgress());
  let showResetConfirm = $state(false);

  function selectPuzzle(puzzle: Puzzle) {
    selectedPuzzle = puzzle;
    view = 'game';
  }

  function goBack() {
    userProgress = getProgress();
    view = 'level-select';
    selectedPuzzle = null;
  }

  function handleResetAll() {
    clearAllProgress();
    userProgress = getProgress();
    showResetConfirm = false;
  }
</script>

<main>
  {#if view === 'level-select'}
    <div class="level-select-container">
      <header class="fcc-header">
        <h1>Nonogram Puzzles</h1>
        <p>Challenge yourself with these logic puzzles. Accurate moves earn you the fastest times!</p>
      </header>

      <div class="puzzle-grid">
        {#each ALL_PUZZLES as puzzle (puzzle.id)}
          {@const stats = userProgress.stats[puzzle.id]}
          {@const inProgress = userProgress.inProgress[puzzle.id]}
          {@const completed = !!stats?.completed}

          <PuzzleCard {puzzle} {stats} inProgress={!!inProgress} {completed} onclick={() => selectPuzzle(puzzle)} />
        {/each}
      </div>

      <footer class="fcc-footer">
        <p>Built with Svelte & freeCodeCamp Design System</p>
        <button class="reset-all-btn" onclick={() => (showResetConfirm = true)}>
          Reset All Progress
        </button>
      </footer>
    </div>

    {#if showResetConfirm}
      <ConfirmModal
        title="Reset All Progress?"
        message="This will permanently delete all your best times and puzzle progress. This action cannot be undone."
        confirmLabel="Yes, Reset Everything"
        onConfirm={handleResetAll}
        onCancel={() => (showResetConfirm = false)}
      />
    {/if}
  {:else if view === 'game' && selectedPuzzle}
    <Nonogram puzzle={selectedPuzzle} onBack={goBack} />
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
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1.5rem;
    width: 100%;
    margin-bottom: 4rem;
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
    border-color: var(--error-red);
    color: var(--error-red);
    font-size: 0.9rem;
    padding: 8px 16px;
    font-weight: 700;
    cursor: pointer;
  }

  .reset-all-btn:hover {
    background: var(--error-red);
    color: var(--gray-00);
  }

</style>
