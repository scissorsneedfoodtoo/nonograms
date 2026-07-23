import type { Action } from 'svelte/action';

/**
 * Locks background scroll for as long as the node is mounted. A fixed-position
 * modal has no scrollable content of its own to claim a touch-drag/wheel
 * gesture, so without this the gesture falls through to the page behind it.
 */
export const scrollLock: Action<HTMLElement> = () => {
  const previousOverflow = document.body.style.overflow;
  document.body.style.overflow = 'hidden';

  return {
    destroy() {
      document.body.style.overflow = previousOverflow;
    },
  };
};
