import { getRect } from "./lib";


//Sticky Calendar
export function loadStickyCalendar() {
  logseq.provideUI({
    key: `sticky-calendar`,
    reset: true,
    template: `
    <div id="StickyCalendar" style="overflow:hidden"></div>
    <div id="sticky-event-button">
      <button data-on-click="stickyCalendarReset" title="Reload: For re-rendering">🎮Reload</button> <button data-on-click="stickyCalendarPinned" title="Pin: saves the position of this popup">📌</button>
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

//ポジションを記録する (カレンダー用)
export const stickyCalendarPosition = (elementId: string, message?: boolean) => {
  const element = parent.document.getElementById(elementId) as HTMLDivElement || null;
  if (!element) return;
  const { x, y, width, height } = getRect(element);
  logseq.updateSettings({
    calendarScreenX: x,
    calendarScreenY: y,
    calendarScreenWidth: width,
    calendarScreenHeight: height,
  });
  if (message) logseq.UI.showMsg("pinned", "success", { timeout: 1000 });
};
