// Address-bar Enter semantics for the prop browser.

/**
 * Classify an Enter keypress on the address bar:
 *   - plain Enter  -> 'navigate' (go to the typed URL, like any browser)
 *   - Shift+Enter  -> 'spoof'    (change only the displayed URL; content unchanged)
 *   - any other key -> null
 */
export function classifyEnter(event) {
  if (event.key !== 'Enter') return null;
  return event.shiftKey ? 'spoof' : 'navigate';
}
