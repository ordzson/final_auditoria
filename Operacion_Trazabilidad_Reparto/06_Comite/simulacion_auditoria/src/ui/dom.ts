export function escapeHtml(value: unknown): string {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export function icon(name: 'play' | 'pause' | 'previous' | 'next' | 'close' | 'clipboard' | 'download' | 'print' | 'check' | 'sound' | 'muted' | 'code' | 'folder' | 'search' | 'compare' | 'open'): string {
  const paths = {
    play: '<path d="m9 6 10 6-10 6Z"/>',
    pause: '<path d="M9 6v12M15 6v12"/>',
    previous: '<path d="m15 6-8 6 8 6M7 6v12"/>',
    next: '<path d="m9 6 8 6-8 6M17 6v12"/>',
    close: '<path d="m7 7 10 10M17 7 7 17"/>',
    clipboard: '<path d="M8 5H6v15h12V5h-2M9 3h6v4H9zM9 12h6M9 16h6"/>',
    download: '<path d="M12 3v12m-4-4 4 4 4-4M5 19h14"/>',
    print: '<path d="M7 8V3h10v5M7 17H4V9h16v8h-3M7 14h10v7H7z"/>',
    check: '<path d="m5 12 4 4L19 6"/>',
    sound: '<path d="M4 10v4h4l5 4V6L8 10H4zM16 9c2 2 2 4 0 6M18 6c4 4 4 8 0 12"/>',
    muted: '<path d="M4 10v4h4l5 4V6L8 10H4zM16 10l5 5M21 10l-5 5"/>',
    code: '<path d="m8 7-5 5 5 5m8-10 5 5-5 5M14 4l-4 16"/>',
    folder: '<path d="M3 6h7l2 3h9v11H3zM3 6V4h7l2 2h7v3"/>',
    search: '<circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/>',
    compare: '<path d="M4 5h6v14H4zM14 5h6v14h-6zM10 12h4"/>',
    open: '<path d="M14 4h6v6m0-6-9 9M9 4H4v16h16v-5"/>',
  };
  return `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`;
}

export function refLabel(ref: { sourceId: string; sourceVersion: string; rowId?: string }): string {
  return `${ref.sourceId}@${ref.sourceVersion}${ref.rowId ? `#${ref.rowId}` : ''}`;
}
