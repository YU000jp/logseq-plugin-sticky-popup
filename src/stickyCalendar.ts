//Sticky Calendar
export function loadStickyCalendar() {
  logseq.provideUI({
    key: `sticky-calendar`,
    reset: true,
    template: `
    <div id="StickyCalendar" style="overflow:hidden"></div>
    <div style="position:absolute;bottom:0;right:0.15em;font-size:small">
      <button data-on-click="stickyCalendarReset" title="Reload: For re-rendering">🎮Reload</button> <button data-on-click="stickyCalendarPinned" title="Pin: saves the position of this popup">📌Pin</button>
    </div>
  `,
    style: {
      left: (logseq.settings?.calendarScreenX || 700) + 'px',
      top: (logseq.settings?.calendarScreenY || 700) + 'px',
      width: logseq.settings?.calendarScreenWidth || "320px",
      height: logseq.settings?.calendarScreenHeight || "300px",
      backgroundColor: 'var(--ls-primary-background-color)',
      color: 'var(--ls-primary-text-color)',
      boxShadow: '1px 2px 5px var(--ls-secondary-background-color)',
    },
    attrs: {
      title: 'Sticky Calendar',
    },
  });
}
