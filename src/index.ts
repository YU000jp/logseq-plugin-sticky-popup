import '@logseq/libs'; //https://plugins-doc.logseq.com/
import { AppGraphInfo, BlockEntity, PageEntity, SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";
const stickyID = `${logseq.baseInfo.id}--sticky`;
const stickyCalendarID = `${logseq.baseInfo.id}--sticky-calendar`;
let graphName = "";//For command pallet

//main
const main = () => {

  //check current graph
  logseq.App.getCurrentGraph().then((graph) => {
    if (graph) { //デモグラフの場合は返り値がnull
      graphName = graph.name;

      //ユーザー設定
      logseq.useSettingsSchema(settingsTemplate);

      //sticky text
      if (logseq.settings!.stickyTextVisible !== "None") mainStickyText();

      //Sticky Calendar
      if (logseq.settings!.stickyCalendarVisible !== "None") mainStickyCalendar();
    }
  });

  logseq.App.onCurrentGraphChanged(async () => {//グラフの変更時
    const graph = await logseq.App.getCurrentGraph() as AppGraphInfo | null;
    if (graph) { //デモグラフの場合は返り値がnull
      graphName = graph.name;
      //sticky text
      if (logseq.settings!.stickyTextVisible !== "None") mainStickyText();
    }
  });

  //CSS
  mainCSS();

  //set CSS class
  setCSSclass();


  //toolbar-item
  logseq.App.registerUIItem("toolbar", {
    key: "Sticky-Popup",
    template: `<div><a class="button icon" data-on-click="popupOpenFromToolbar" title="Open popups if close them" style="font-size:18px">📌</a></div>`,
  });


  logseq.beforeunload(async () => {
    await stickyPosition(stickyID);
  });


  //Setting changed
  logseq.onSettingsChanged((newSettings, oldSettings) => {
    onSettingsChangedCallback(newSettings, oldSettings);
  });


  //選択したテキストをdraggableゾーン(Sticky)に表示
  logseq.Editor.onInputSelectionEnd(async (event) => {
    if (logseq.settings?.stickyLock === true) {
      return;
    } else if (logseq.settings?.ScreenText) {
      logseq.provideUI(dsl({ lock: true, }, logseq.settings?.screenText, logseq.settings?.screenX, logseq.settings?.screenY, logseq.settings?.screenWidth, logseq.settings?.screenHeight, logseq.settings?.screenUuid, logseq.settings?.screenPage));
    } else {
      const current = await logseq.Editor.getCurrentBlock() as BlockEntity;
      const currentPage = await logseq.Editor.getCurrentPage() as PageEntity;
      if (current) {
        const PageName = currentPage?.name || "";
        const x = logseq.settings?.screenX || 5;
        const y = logseq.settings?.screenY || 695;
        const width = logseq.settings?.screenWidth || "195px";
        const height = logseq.settings?.screenHeight || "225px";
        await logseq.provideUI(dsl({}, event.text, x, y, width, height, current.uuid, PageName));
      }
    }
  });


  //model
  logseq.provideModel({
    stickyPinned() {
      stickyPosition(stickyID);
      logseq.UI.showMsg("pinned", "success");
    },
    stickyCalendarPinned() {
      stickyPosition(stickyCalendarID);
      logseq.UI.showMsg("pinned", "success");
    },
    stickyCalendarReset() {
      setTimeout(() => {
        logseq.App.setRightSidebarVisible("toggle");
      }, 10);
      setTimeout(() => {
        logseq.App.setRightSidebarVisible("toggle");
      }, 30);
    },
    ActionUnlock() {
      stickyPosition(stickyID);
      logseq.updateSettings({
        stickyLock: false,
      });
      const stickyLock = parent.document.getElementById("stickyLock") as HTMLSpanElement;
      if (stickyLock) {
        stickyLock.style.display = "none";
      }
      const stickyUnlock = parent.document.getElementById("stickyUnlock") as HTMLSpanElement;
      if (stickyUnlock) {
        stickyUnlock.style.display = "none";
      }
      logseq.UI.showMsg("Unlocked", "success");
    },
    ActionToRightSidebar() {
      stickyPosition(`${logseq.baseInfo.id}--popup--sticky`);
      logseq.Editor.openInRightSidebar(logseq.settings?.screenUuid);
    },
    async ActionToPage() {
      stickyPosition(stickyID);
      const getPage = await logseq.Editor.getPage(logseq.settings?.screenPage) as PageEntity | null;
      if (getPage) {
        logseq.Editor.scrollToBlockInPage(logseq.settings?.screenPage, logseq.settings?.screenUuid);
      } else {
        logseq.UI.showMsg("Page not found", "error");
      }
    },
    popupOpenFromToolbar() {
      if (logseq.settings!.stickyTextVisible !== "None") mainStickyText();
      if (logseq.settings!.stickyCalendarVisible !== "None") {
        const div = parent.document.getElementById(stickyCalendarID) as HTMLDivElement;
        if (!div) {
          mainStickyCalendar();
          setTimeout(() => {
            logseq.App.setRightSidebarVisible("toggle");
          }, 10);
          setTimeout(() => {
            logseq.App.setRightSidebarVisible("toggle");
          }, 30);
        }
      }
    },
  });
  //end model


}
//end main


// Setting changed
const onSettingsChangedCallback = (newSet, oldSet) => {
  if (oldSet.stickyTextVisible && newSet.stickyTextVisible) {
    parent.document.body.classList.remove(`sp-textVisible-${oldSet.stickyTextVisible}`);
    parent.document.body.classList.add(`sp-textVisible-${newSet.stickyTextVisible}`);
  }
  if (oldSet.stickyCalendarVisible && newSet.stickyCalendarVisible) {
    parent.document.body.classList.remove(`sp-calendarVisible-${oldSet.stickyCalendarVisible}`);
    parent.document.body.classList.add(`sp-calendarVisible-${newSet.stickyCalendarVisible}`);
  }
  if (oldSet.stickyTextZIndex === false && newSet.stickyTextZIndex === true) {
    parent.document.body.classList.add("sp-textZIndex");
  } else if (oldSet.stickyTextZIndex === true && newSet.stickyTextZIndex === false) {
    parent.document.body.classList.remove("sp-textZIndex");
  }
  if (oldSet.stickyCalendarZIndex === false && newSet.stickyCalendarZIndex === true) {
    parent.document.body.classList.add("sp-calendarZIndex");
  } else if (oldSet.stickyCalendarZIndex === true && newSet.stickyCalendarZIndex === false) {
    parent.document.body.classList.remove("sp-calendarZIndex");
  }
}
//end Setting changed


//set CSS class
function setCSSclass() {
  if (logseq.settings?.stickyTextVisible) {
    parent.document.body.classList.add(`sp-textVisible-${logseq.settings.stickyTextVisible}`);
  }
  if (logseq.settings?.stickyCalendarVisible) {
    parent.document.body.classList.add(`sp-calendarVisible-${logseq.settings.stickyCalendarVisible}`);
  }
  if (!logseq.settings?.stickyTextZIndex || logseq.settings?.stickyTextZIndex === true) {
    parent.document.body.classList.add("sp-textZIndex");
  }
  if (!logseq.settings?.stickyCalendarZIndex || logseq.settings?.stickyCalendarZIndex === true) {
    parent.document.body.classList.add("sp-calendarZIndex");
  }
}
//end set CSS class


//main CSS
function mainCSS() {
  logseq.provideStyle(String.raw`
  body.is-pdf-active div#${stickyID},
  body.is-pdf-active div#${stickyCalendarID},
  body:not([data-page="home"]).sp-textVisible-Journal div#${stickyID},
  body:not([data-page="page"]).sp-textVisible-Not-Journal div#${stickyID},
  body.sp-textVisible-None div#${stickyID},
  body:not([data-page="home"]).sp-calendarVisible-Journal div#${stickyCalendarID},
  body:not([data-page="page"]).sp-calendarVisible-Not-Journal div#${stickyCalendarID},
  body.sp-calendarVisible-None div#${stickyCalendarID} {
    display: none;
  }

  /* TODO: awesome UIプラグインで、Navigation menuが隠れる件(Sticky Textが上になる) */

  body:not(.sp-textZIndex) div#${stickyID},
  body:not(.sp-calendarZIndex) div#${stickyCalendarID} {
    z-index: 1!important;
  }
  body.sp-textZIndex div#${stickyID},
  body.sp-calendarZIndex div#${stickyCalendarID} {
    z-index: var(--ls-z-index-level-1)!important;
  }
  nav[aria-label="Navigation menu"]{ /* navigation menuのz-indexを変更 */
    z-index: var(--ls-z-index-level-5);
  }
  div#${stickyID} {
    min-width: 260px;
    max-width: 780px;
    min-height: 120px;
    max-height: 500px;
  }
  div#${stickyCalendarID} {
    min-width: 295px;
    max-width: 360px;
    min-height: 280px;
    max-height: 320px;
  }
  div#${stickyCalendarID} div.ls-ui-float-content {
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  div#sticky-actions-left {
    position:absolute;
    bottom:0;
    font-size:small;
    background:var(--ls-primary-background-color);
    margin-right:6.5em;
  }
  div#sticky-actions-right {
    position: absolute;
    bottom: 0;
    right: .15em;
    font-size: small;
    background:var(--ls-primary-background-color);
  }
  `);
}
//end main CSS


//user setting
//https://logseq.github.io/plugins/types/SettingSchemaDesc.html
const settingsTemplate: SettingSchemaDesc[] = [
  {
    key: "",
    title: "Sticky Text",
    type: "heading",
    default: "",
    description: "Select string and click the same block. Registered in pop-ups and automatically locked. Markdown is not reflected.",
  },
  { //select ジャーナルのみ、ジャーナル以外、全てのページ
    key: "stickyTextVisible",
    title: "(Sticky Text) Visible or not",
    type: "enum",
    enumChoices: ["Journal", "Not-Journal", "All", "None"],
    default: "All",
    description: "",
  },
  {
    key: "stickyTextZIndex",
    title: "(Sticky Text) Showing over sidebar or not",
    type: "boolean",
    default: true,
    description: "",
  },
  {
    key: "",
    title: "Sticky Calendar",
    type: "heading",
    default: "",
    description: "Require rendering of Block Calendar Plugin. Set `custom` and `#StickyCalendar`(Provide CSS selector) on the plugin settings.",
  },
  {
    key: "stickyCalendarVisible",
    title: "(Sticky Calendar) Visible or not",
    type: "enum",
    enumChoices: ["Journal", "Not-Journal", "All", "None"],
    default: "Journal",
    description: "",
  },
  {
    key: "stickyCalendarZIndex",
    title: "(Sticky Calendar) Showing over sidebar or not",
    type: "boolean",
    default: true,
    description: "",
  },
];



const dsl = (flag, text, x, y, width, height, uuid, pageName) => {
  if (flag.lock === true) {
    //
  } else if (logseq.settings?.stickyLock === true) {
    const stickyUnlock = parent.document.getElementById("stickyUnlock") as HTMLSpanElement;
    if (stickyUnlock) {
      stickyUnlock.style.display = "unset";
    }
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
  if (pageName && logseq.settings?.currentGraph === graphName) {
    toPage = `<button data-on-click="ActionToPage" title="To the page [[${encodeHtml(pageName)}]]" style="overflow:auto">📄${pageName}</button>`;
  }
  let toRightSidebar = "";
  if (uuid && logseq.settings?.currentGraph === graphName) {
    toRightSidebar = `<button data-on-click="ActionToRightSidebar" title="On right sidebar">👉On right-Sidebar</button><br/>`;
  }
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
      width: width,
      height: height,
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
function mainStickyText() {
  //読み込み時
  if (logseq.settings?.screenText) {
    logseq.provideUI(dsl({ lock: true, }, logseq.settings.screenText, logseq.settings.screenX, logseq.settings.screenY, logseq.settings.screenWidth, logseq.settings.screenHeight, logseq.settings.screenUuid, logseq.settings.screenPage));
  } else {//値がない場合(初回)
    newStickyText();
  }
}//end


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

//end Sticky Text


//Sticky Calendar
function mainStickyCalendar() {
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


//ポジションを記録する
const stickyPosition = (elementId: string) => {
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
      } else if (elementId === stickyCalendarID) {
        logseq.updateSettings({
          calendarScreenX: x || logseq.settings?.calendarScreenX,
          calendarScreenY: y || logseq.settings?.calendarScreenY,
          calendarScreenWidth: width || logseq.settings?.calendarScreenWidth,
          calendarScreenHeight: height || logseq.settings?.calendarScreenHeight,
        });
      }
    }
  }
};
//end


//encodeHtml
function encodeHtml(str: string): string {
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


logseq.ready(main).catch(console.error);