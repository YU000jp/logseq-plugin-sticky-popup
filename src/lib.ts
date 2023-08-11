

//encodeHtml
export function encodeHtml(str: string): string {
  const htmlEntities = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  };
  return String(str).replace(/[&<>"'/]/g, function (s) {
    return htmlEntities[s];
  });
}


//ポジションを記録する
export const stickyPosition = (elementId: string) => {
  const stickyID = `${logseq.baseInfo.id}--sticky`;
  const stickyCalendarID = `${logseq.baseInfo.id}--sticky-calendar`;
  const element = parent.document.getElementById(elementId) as HTMLDivElement;
  if (element) {
    const rect = element.getBoundingClientRect() as DOMRect;
    if (rect) {
      const x: number = Math.round(rect.x);
      const y: number = Math.round(rect.y);
      const width = element.style.width;
      const height = element.style.height;
      if (elementId === stickyID) {
        logseq.updateSettings({
          screenX: x || logseq.settings?.screenX,
          screenY: y || logseq.settings?.screenY,
          screenWidth: width || logseq.settings?.screenWidth,
          screenHeight: height || logseq.settings?.screenHeight,
        });
        logseq.UI.showMsg("pinned", "success", { timeout: 1000 });
      } else if (elementId === stickyCalendarID) {
        logseq.updateSettings({
          calendarScreenX: x || logseq.settings?.calendarScreenX,
          calendarScreenY: y || logseq.settings?.calendarScreenY,
          calendarScreenWidth: width || logseq.settings?.calendarScreenWidth,
          calendarScreenHeight: height || logseq.settings?.calendarScreenHeight,
        });
        logseq.UI.showMsg("pinned", "success", { timeout: 1000 });
      }
    }
  }
};


