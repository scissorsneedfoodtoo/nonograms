import type { Action } from 'svelte/action';

interface FocusTrapParams {
  /** Called when Escape is pressed inside the trapped element. */
  onEscape?: () => void;
  /**
   * Element to restore focus to on close. Pass this explicitly when the trigger
   * is made `inert` while the dialog is open — by then it has already lost
   * focus, so capturing `document.activeElement` here would be too late.
   */
  returnFocus?: HTMLElement | null;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Traps keyboard focus within a dialog: moves focus inside on mount, cycles
 * Tab/Shift+Tab within the node, closes on Escape, and restores focus to the
 * previously focused element on destroy. The node should be focusable
 * (tabindex="-1") as a fallback when it has no focusable children.
 */
export const focusTrap: Action<HTMLElement, FocusTrapParams | undefined> = (node, params) => {
  const previouslyFocused = document.activeElement as HTMLElement | null;

  const getFocusable = () =>
    Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null,
    );

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.stopPropagation();
      params?.onEscape?.();
      return;
    }

    if (event.key !== 'Tab') return;

    const focusable = getFocusable();
    if (focusable.length === 0) {
      event.preventDefault();
      node.focus();
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || active === node)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  // Move focus into the dialog (first focusable, else the dialog itself).
  const focusable = getFocusable();
  (focusable[0] ?? node).focus();

  node.addEventListener('keydown', handleKeydown);

  return {
    update(newParams) {
      params = newParams;
    },
    destroy() {
      node.removeEventListener('keydown', handleKeydown);
      const target = params?.returnFocus ?? previouslyFocused;
      // Defer until after the current DOM flush: closing the dialog also removes
      // `inert` from the restore target's container in the same update, and
      // focus() is a no-op on a still-inert element.
      requestAnimationFrame(() => target?.focus?.());
    },
  };
};
