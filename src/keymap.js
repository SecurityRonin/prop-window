// Address-bar Enter semantics for the prop browser.

/**
 * Classify an Enter keypress on the address bar:
 *   - Shift+Enter -> 'navigate' (actually load the typed URL into the view)
 *   - plain Enter -> 'spoof'    (change only the displayed URL; content unchanged)
 *   - any other key -> null
 */
export function classifyEnter(event) {
  if (event.key !== 'Enter') return null;
  return event.shiftKey ? 'navigate' : 'spoof';
}
