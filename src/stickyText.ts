import { graphName } from '.';
import { stickyID, stickyPosition } from './lib';
import { encodeHtml } from './lib';

export const stickyTextOpenUI = (flag, text, x, y, width, height, uuid, pageName) => {
  if (flag.lock === true) {
    //
  } else if (logseq.settings?.stickyLock === true) {
    const stickyUnlock = parent.document.getElementById("stickyUnlock") as HTMLSpanElement;
    if (stickyUnlock) stickyUnlock.style.display = "unset";
  } else {
    stickyPosition(stickyID);
    logseq.updateSettings({
      currentGraph: graphName,
      screenText: text,
      screenUuid: uuid,
      screenPage: pageName,
      stickyLock: true,
    });
  }
  let toPage = "";
  if (pageName && logseq.settings?.currentGraph === graphName) toPage = `<button data-on-click="ActionToPage" title="To the page [[${encodeHtml(pageName)}]]" style="overflow:auto">📄${pageName}</button>`;
  let toRightSidebar = "";
  if (uuid && logseq.settings?.currentGraph === graphName) toRightSidebar = `<button data-on-click="ActionToRightSidebar" title="On right sidebar">👉On right-Sidebar</button><br/>`;
  return {
    key: 'sticky',
    reset: true,
    template: `
      <div style="padding:10px;overflow:auto">
          <p style="font-size:0.98em;margin-bottom:2em"><span id="stickyLock" title="Lock">🔒</span> <a style="cursor:default" title="${encodeHtml(text)}">${text}</a></p>
        <div id="sticky-actions-left">
          ${toRightSidebar}${toPage}
        </div>
        <div id="sticky-actions-right">
          <button data-on-click="ActionUnlock" id="stickyUnlock"><span style="text-decoration:underline;font-size:1.2em" title="Unlock: Overwrites the next selected text">🔓Unlock</span></button><br/>
          <button data-on-click="stickyPinned" title="Pin: saves the position of this popup">📌Pin</button>
        </div>
      </div>
    `,
    style: {
      left: x + 'px',
      top: y + 'px',
      width,
      height,
      backgroundColor: 'var(--ls-primary-background-color)',
      color: 'var(--ls-primary-text-color)',
      boxShadow: '1px 2px 5px var(--ls-secondary-background-color)',
    },
    attrs: {
      title: 'Sticky Text',
    },
  };
};

//Sticky Text
export function loadStickyText() {
  //読み込み時
  if (logseq.settings?.screenText) {
    logseq.provideUI(stickyTextOpenUI({ lock: true, }, logseq.settings.screenText, logseq.settings.screenX, logseq.settings.screenY, logseq.settings.screenWidth, logseq.settings.screenHeight, logseq.settings.screenUuid, logseq.settings.screenPage));
  } else { //値がない場合(初回)
    newStickyText();
  }
} //end

//初回
function newStickyText() {
  logseq.provideUI({
    key: 'sticky',
    reset: true,
    template: `
          <div style="padding:10px;overflow:auto">
              <p style="font-size:0.98em;margin-bottom:2em"><a style="cursor:default" title="Select any text">📝Select any text</a></p>
            <div id="sticky-actions-right">
              <button data-on-click="stickyPinned" title="Pin: saves the position of this popup">📌Pin</button>
            </div>
          </div>
        `,
    style: {
      left: (logseq.settings?.screenX || 5) + 'px',
      top: (logseq.settings?.screenY || 695) + 'px',
      width: logseq.settings?.screenWidth || "195px",
      height: logseq.settings?.screenHeight || "225px",
      backgroundColor: 'var(--ls-primary-background-color)',
      color: 'var(--ls-primary-text-color)',
      boxShadow: '1px 2px 5px var(--ls-secondary-background-color)',
    },
    attrs: {
      title: 'Sticky Text',
    },
  });
}
