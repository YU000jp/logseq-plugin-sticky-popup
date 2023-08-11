

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

//ポジションを記録する (テキスト用)
export const stickyTextPosition = (elementId: string, message?: boolean) => {
  const element = parent.document.getElementById(elementId) as HTMLDivElement || null;
  if (!element) return;
  const { x, y, width, height } = getRect(element);
  logseq.updateSettings({
    screenX: x,
    screenY: y,
    screenWidth: width,
    screenHeight: height,
  });
  if (message) logseq.UI.showMsg("pinned", "success", { timeout: 1000 });
};

const getRect = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect() as DOMRect;
  return {
    x: Math.round(rect.x) as number,
    y: Math.round(rect.y) as number,
    width: element.style.width,
    height: element.style.height
  };
}
