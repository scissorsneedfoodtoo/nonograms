<script lang="ts">
  import Nonogram from './Nonogram.svelte';
  import PuzzlePreview from './lib/components/PuzzlePreview.svelte';
  import { ALL_PUZZLES } from './lib/puzzles';
  import type { Puzzle } from './lib/types';
  import { getProgress } from './lib/storage';
  import { formatTime } from './lib/gameLogic';

  let view = $state<'level-select' | 'game'>('level-select');
  let selectedPuzzle = $state<Puzzle | null>(null);
  let userProgress = $state(getProgress());

  function selectPuzzle(puzzle: Puzzle) {
    selectedPuzzle = puzzle;
    view = 'game';
  }

  function goBack() {
    userProgress = getProgress();
    view = 'level-select';
    selectedPuzzle = null;
  }
</script>

<main>
  {#if view === 'level-select'}
    <div class="level-select-container">
      <header class="fcc-header">
        <h1>Nonogram Puzzles</h1>
        <p>Challenge yourself with these 5x5 puzzles. Accurate moves earn you the fastest times!</p>
      </header>

      <div class="puzzle-grid">
        {#each ALL_PUZZLES as puzzle (puzzle.id)}
          {@const stats = userProgress.stats[puzzle.id]}
          {@const inProgress = userProgress.inProgress[puzzle.id]}
          {@const completed = !!stats?.completed}

          <button class="puzzle-square" onclick={() => selectPuzzle(puzzle)}>
            <div class="square-header">
              <span class="puzzle-id">#{puzzle.id}</span>
              <span class="puzzle-size">{puzzle.width}x{puzzle.height}</span>
            </div>

            <div class="preview-wrapper">
              <PuzzlePreview {puzzle} {completed} inProgress={!!inProgress} size={140} />
            </div>

            <div class="square-footer">
              <div class="puzzle-name">
                {completed ? puzzle.name : '???'}
              </div>
              {#if completed && stats?.bestTime}
                <div class="best-time">
                  Best: {formatTime(stats.bestTime)}
                </div>
              {:else if inProgress}
                <div class="status-hint">In Progress</div>
              {:else}
                <div class="status-hint">Not Started</div>
              {/if}
            </div>
          </button>
        {/each}
      </div>

      <footer class="fcc-footer">
        <p>Built with Svelte & freeCodeCamp Design System</p>
      </footer>
    </div>
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

  .puzzle-square {
    background-color: var(--gray-85);
    border: 3px solid var(--gray-00);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transition:
      transform 0.1s,
      background-color 0.1s;
    cursor: pointer;
    color: var(--gray-00);
    position: relative;
    aspect-ratio: 1 / 1.3;
  }

  .puzzle-square:hover {
    transform: scale(1.02);
    background-color: var(--gray-80);
  }

  .puzzle-square:active {
    transform: scale(0.98);
  }

  .puzzle-square:focus-visible {
    outline: 5px solid var(--yellow-gold);
    outline-offset: 5px;
    z-index: 10;
  }

  .square-header {
    display: flex;
    justify-content: space-between;
    width: 100%;
    margin-bottom: 0.75rem;
    font-family: var(--font-mono);
    font-size: 0.85rem;
    color: var(--gray-45);
    font-weight: 700;
  }

  .preview-wrapper {
    margin-bottom: 1rem;
    background-color: var(--gray-00);
    padding: 2px;
  }

  .square-footer {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .puzzle-name {
    font-weight: 900;
    font-size: 1rem;
    color: var(--gray-00);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .best-time {
    font-family: var(--font-mono);
    font-size: 0.85rem;
    color: var(--yellow-gold);
    font-weight: 700;
  }

  .status-hint {
    font-size: 0.75rem;
    color: var(--gray-45);
    text-transform: uppercase;
    font-weight: 700;
  }

  .fcc-footer {
    border-top: 3px solid var(--gray-75);
    width: 100%;
    padding-top: 2rem;
    color: var(--gray-45);
    font-size: 0.9rem;
    text-align: center;
  }
</style>
