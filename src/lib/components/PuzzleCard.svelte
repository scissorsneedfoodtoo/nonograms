<script lang="ts">
  import PuzzlePreview from './PuzzlePreview.svelte';
  import { formatTime } from '../gameLogic';
  import type { Puzzle, PuzzleStats } from '../types';

  interface Props {
    puzzle: Puzzle;
    order: number;
    stats: PuzzleStats | undefined;
    inProgress: boolean;
    completed: boolean;
    onclick: () => void;
  }

  let { puzzle, order, stats, inProgress, completed, onclick }: Props = $props();
</script>

<button class="puzzle-square" {onclick}>
  <div class="square-header">
    <span class="puzzle-id">#{order}</span>
    <span class="puzzle-size">{puzzle.width}x{puzzle.height}</span>
  </div>

  <div class="preview-wrapper">
    <PuzzlePreview {puzzle} {completed} {inProgress} size={140} />
  </div>

  <div class="square-footer">
    <div class="puzzle-name">
      {completed ? puzzle.name : '???'}
    </div>
    {#if completed && stats}
      <div class="best-time">Best: {formatTime(stats.bestTime)}</div>
    {:else if inProgress}
      <div class="status-hint">In Progress</div>
    {:else}
      <div class="status-hint">Not Started</div>
    {/if}
  </div>
</button>

<style>
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
    will-change: transform;
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
</style>
