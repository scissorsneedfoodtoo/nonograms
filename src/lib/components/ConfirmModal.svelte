<script lang="ts">
  import { focusTrap } from '../actions/focusTrap';

  interface Props {
    title: string;
    message: string;
    confirmLabel: string;
    onConfirm: () => void;
    onCancel: () => void;
  }

  let { title, message, confirmLabel, onConfirm, onCancel }: Props = $props();
</script>

<div class="modal-backdrop">
  <div
    class="modal-content"
    role="dialog"
    aria-modal="true"
    aria-labelledby="confirm-title"
    tabindex="-1"
    use:focusTrap={{ onEscape: onCancel }}
  >
    <h2 id="confirm-title">{title}</h2>
    <p>{message}</p>
    <div class="modal-actions">
      <button class="primary danger" onclick={onConfirm}>
        {confirmLabel}
      </button>
      <button onclick={onCancel}>Cancel</button>
    </div>
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
    padding: 20px;
  }

  .modal-content {
    background-color: var(--gray-85);
    border: 5px solid var(--yellow-gold);
    padding: 3rem;
    max-width: 500px;
    width: 100%;
    text-align: center;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  }

  .modal-content h2 {
    color: var(--yellow-gold);
    margin-bottom: 1.5rem;
    font-size: 2rem;
  }

  .modal-content p {
    color: var(--gray-00);
    margin-bottom: 2rem;
    font-size: 1.1rem;
    line-height: 1.6;
  }

  .modal-actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  button.danger {
    background-color: var(--error-red) !important;
    border-color: var(--error-red) !important;
    color: var(--gray-00) !important;
  }

  button.danger:hover {
    background-color: #a00000 !important;
    border-color: #a00000 !important;
  }
</style>
