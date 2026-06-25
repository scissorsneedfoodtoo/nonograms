<script lang="ts">
  import type { Puzzle } from '../types';

  interface Props {
    puzzle: Puzzle;
    completed: boolean;
    inProgress: boolean;
    size?: number;
  }

  let { puzzle, completed, inProgress, size = 100 }: Props = $props();

  let canvas = $state<HTMLCanvasElement | null>(null);

  $effect(() => {
    if (!completed || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, puzzle.width, puzzle.height);
    for (let r = 0; r < puzzle.height; r++) {
      for (let c = 0; c < puzzle.width; c++) {
        const color =
          puzzle.colorSolution?.[r][c] || (puzzle.solution[r][c] === 1 ? '#4a4a4a' : null);
        if (color) {
          ctx.fillStyle = color;
          ctx.fillRect(c, r, 1, 1);
        }
      }
    }
  });
</script>

<div
  class="preview-container"
  style="width: {size}px; height: {size}px;"
  class:completed
  class:in-progress={inProgress && !completed}
  aria-hidden="true"
>
  {#if completed}
    <canvas bind:this={canvas} width={puzzle.width} height={puzzle.height} class="mini-canvas">
    </canvas>
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

  .mini-canvas {
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
    image-rendering: crisp-edges;
  }

  .question-mark {
    font-size: 3rem;
    font-weight: 900;
    color: var(--gray-45);
  }
</style>
