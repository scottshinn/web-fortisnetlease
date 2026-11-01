/* Local-only click hook: no network, storage, identifiers, or call-completion claim. */
document.addEventListener('click', (event) => {
  const link = event.target instanceof Element
    ? event.target.closest('a[data-event="lead_call"]')
    : null;
  if (!link) return;
  window.dispatchEvent(new CustomEvent('lead_call', {
    detail: { path: window.location.pathname, placement: link.dataset.placement }
  }));
});
