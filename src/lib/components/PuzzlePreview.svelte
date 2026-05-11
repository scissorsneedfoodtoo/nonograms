<script lang="ts">
  import type { Puzzle } from '../types';

  interface Props {
    puzzle: Puzzle;
    completed: boolean;
    inProgress: boolean;
    size?: number;
  }

  let { puzzle, completed, inProgress, size = 100 }: Props = $props();
</script>

<div
  class="preview-container"
  style="width: {size}px; height: {size}px;"
  class:completed
  class:in-progress={inProgress && !completed}
>
  {#if completed}
    <div class="mini-grid" style="grid-template-columns: repeat({puzzle.width}, 1fr);">
      {#each puzzle.solution as row, r (r)}
        {#each row as _, c (c)}
          <div
            class="mini-cell"
            style="background-color: {puzzle.colorSolution?.[r][c] || (puzzle.solution[r][c] === 1 ? 'var(--gray-90)' : 'transparent')}"
          ></div>
        {/each}
      {/each}
    </div>
  {:else}
    <div class="question-mark">?</div>
  {/if}
</div>

<style>
  .preview-container {
    background-color: var(--gray-75);
    border: 2px solid var(--gray-00);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }

  .preview-container.completed {
    background-color: var(--gray-90);
  }

  .preview-container.in-progress {
    border-color: var(--yellow-gold);
    border-width: 3px;
  }

  .mini-grid {
    display: grid;
    width: 100%;
    height: 100%;
    gap: 0;
  }

  .mini-cell {
    width: 100%;
    height: 100%;
  }

  .question-mark {
    font-size: 3rem;
    font-weight: 900;
    color: var(--gray-45);
  }
</style>
