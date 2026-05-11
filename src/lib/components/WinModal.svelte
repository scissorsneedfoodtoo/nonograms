<script lang="ts">
  import PuzzlePreview from './PuzzlePreview.svelte';
  import { formatTime } from '../gameLogic';
  import type { Puzzle } from '../types';

  interface Props {
    puzzle: Puzzle;
    seconds: number;
    penalties: number;
    totalPenaltyTime: number;
    totalTime: number;
    onClose: () => void;
  }

  let { puzzle, seconds, penalties, totalPenaltyTime, totalTime, onClose }: Props = $props();
</script>

<div class="modal-backdrop" aria-live="polite">
  <div class="win-message" role="dialog" aria-modal="true" aria-labelledby="win-title">
    <h2 id="win-title">Puzzle Completed! 🎉</h2>
    <h3>{puzzle.name}</h3>
    <div class="win-preview">
      <PuzzlePreview {puzzle} completed={true} inProgress={false} size={150} />
    </div>
    <div class="stats-summary">
      <p>Base Time: <span class="mono">{formatTime(seconds)}</span></p>
      <p>
        Penalties: <span class="mono error-text">{penalties}</span> ({formatTime(totalPenaltyTime)})
      </p>
      <p class="final-total">Total Time: <span class="mono">{formatTime(totalTime)}</span></p>
    </div>
    <button class="primary" onclick={onClose} style="margin-top: 2rem;">Back to Levels</button>
  </div>
</div>

<style>
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

  .mono {
    font-family: var(--font-mono);
  }

  .error-text {
    color: var(--warning-orange);
  }
</style>
