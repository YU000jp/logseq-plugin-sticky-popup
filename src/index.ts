import '@logseq/libs'; //https://plugins-doc.logseq.com/
import { BlockEntity, PageEntity, SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";

let graphName = "";//For command pallet

//main
const main = () => {


  //check current graph

  logseq.App.getCurrentGraph().then((graph) => {
    if (graph) {
      graphName = graph.name;

      //ユーザー設定
      userSettings();

      //Sticky Text グラフのロック
      if (!logseq.settings?.currentGraph) {//設定が存在しない場合
        logseq.updateSettings({ currentGraph: graph.name });
        mainStickyText(graph.name);
      } else if (logseq.settings?.currentGraph === graph.name) {//作成時のグラフと一致する場合
        mainStickyText(graph.name);
      } else if (logseq.settings?.graphLock === false) {//グラフのロックを解除する場合
        logseq.updateSettings({
          screenText: "",
          screenUuid: "",
          screenPage: "",
          stickyLock: false,
        });
        mainStickyText(graph.name);
      }
      //Sticky Calendar
      mainStickyCalendar();

    } else {
      //デモグラフの場合は返り値がnull
    }
  });


  //グラフの変更時
  graphChanged();

  //CSS
  mainCSS();


  //set CSS class
  setCSSclass();


  //toolbar-item
  logseq.App.registerUIItem("toolbar", {
    key: 'logseq-plugin-sticky-popup-open',
    template: `<div data-on-click="openFromToolbar" style="font-size:20px">📌</div>`,
  });


  //main support
  parent.document.body.classList.add('is-plugin-logseq-plugin-sticky-popup-enabled');
  logseq.beforeunload(async () => {
    parent.document.body.classList.remove('is-plugin-logseq-plugin-sticky-popup-enabled');
    await stickyPosition("logseq-plugin-sticky-popup--sticky");
  });


  //Setting changed
  logseq.onSettingsChanged((newSettings, oldSettings) => {
    onSettingsChangedCallback(newSettings, oldSettings);
  });


  //set CSS class
  function setCSSclass() {
    if (logseq.settings?.stickyTextVisible) {
      parent.document.body.classList.add(`sp-textVisible-${logseq.settings.stickyTextVisible}`);
    }
    if (logseq.settings?.stickyCalendarVisible) {
      parent.document.body.classList.add(`sp-calendarVisible-${logseq.settings.stickyCalendarVisible}`);
    }
    if (!logseq.settings?.stickyCalendarZIndex || logseq.settings?.stickyCalendarZIndex === true) {
      parent.document.body.classList.add("sp-calendarZIndex");
    }
    if (!logseq.settings?.stickyTextZIndex || logseq.settings?.stickyTextZIndex === true) {
      parent.document.body.classList.add("sp-textZIndex");
    }
  }
  //end set CSS class


  //main CSS
  function mainCSS() {
    logseq.provideStyle(String.raw`
  body.is-pdf-active div#logseq-plugin-sticky-popup--sticky,
  body.is-pdf-active div#logseq-plugin-sticky-popup--sticky-calendar,
  body:not([data-page="home"]).sp-textVisible-Journal div#logseq-plugin-sticky-popup--sticky,
  body:not([data-page="page"]).sp-textVisible-Not-Journal div#logseq-plugin-sticky-popup--sticky,
  body.sp-textVisible-None div#logseq-plugin-sticky-popup--sticky,
  body:not([data-page="home"]).sp-calendarVisible-Journal div#logseq-plugin-sticky-popup--sticky-calendar,
  body:not([data-page="page"]).sp-calendarVisible-Not-Journal div#logseq-plugin-sticky-popup--sticky-calendar,
  body.sp-calendarVisible-None div#logseq-plugin-sticky-popup--sticky-calendar {
    display: none;
  }

  /* TODO: Navigation menuが隠れる件(Sticky Textが上になる) */

  body:not(.sp-textZIndex) div#logseq-plugin-sticky-popup--sticky,
  body:not(.sp-calendarZIndex) div#logseq-plugin-sticky-popup--sticky-calendar {
    z-index: 1!important;
  }
  nav[aria-label="Navigation menu"]{ /* navigation menuのz-indexを変更 */
    z-index: var(--ls-z-index-level-5);
  }
  div#logseq-plugin-sticky-popup--sticky {
    min-width: 260px;
    max-width: 780px;
    min-height: 120px;
    max-height: 500px;
  }
  div#logseq-plugin-sticky-popup--sticky-calendar {
    min-width: 295px;
    max-width: 360px;
    min-height: 280px;
    max-height: 320px;
  }
  div#logseq-plugin-sticky-popup--sticky-calendar div.ls-ui-float-content {
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
  function userSettings() {
    //https://logseq.github.io/plugins/types/SettingSchemaDesc.html
    const settingsTemplate: SettingSchemaDesc[] = [
      {
        key: "graphLock",
        title: "Graph Lock",
        type: "boolean",
        default: true,
        description: "If Change the graph, [true]: Popup be hidden [false]: Clear selected text and popup be shown",
      },
      {
        key: "currentGraph",
        title: "Current Graph",
        type: "string",
        default: "",
        description: "Graph name to lock",
      },
      {
        key: "",
        title: "Sticky Text",
        type: "heading",
        default: "",
        description: `
      Select string and click the same block.\n
      Registered in pop-ups and automatically locked. Markdown is not reflected.
      `,
      },
      { //select ジャーナルのみ、ジャーナル以外、全てのページ
        key: "stickyTextVisible",
        title: "Sticky Text Visible",
        type: "enum",
        enumChoices: ["Journal", "Not-Journal", "All", "None"],
        default: "All",
        description: "Showing Sticky Text or not",
      },
      {
        key: "stickyTextZIndex",
        title: "Sticky Text Z-index",
        type: "boolean",
        default: true,
        description: "Showing over sidebar or not",
      },
      {
        key: "",
        title: "Sticky Calendar",
        type: "heading",
        default: "",
        description: `
      require rendering of Block Calendar Plugin\n
      Set 'custom' and '#StickyCalendar'(Provide CSS selector) on the plugin settings
      `,
      },
      {
        key: "stickyCalendarVisible",
        title: "Sticky Calendar Visible",
        type: "enum",
        enumChoices: ["Journal", "Not-Journal", "All", "None"],
        default: "Journal",
        description: "Showing Sticky Calendar or not",
      },
      {
        key: "stickyCalendarZIndex",
        title: "Sticky Calendar Z-index",
        type: "boolean",
        default: true,
        description: "Showing over sidebar or not",
      },
    ];
    logseq.useSettingsSchema(settingsTemplate);
  }
  //end user setting


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


  //graph changed
  function graphChanged() {
    logseq.App.onCurrentGraphChanged(() => {
      logseq.App.getCurrentGraph().then((graph) => {
        if (graph) { //デモグラフの場合は返り値がnull
          graphName = graph.name;

          if (!logseq.settings?.currentGraph) { //設定が存在しない場合
            return;
          } else if (logseq.settings?.graphLock === false) { //グラフのロックを解除する場合
            logseq.updateSettings({
              screenUuid: "",
              screenPage: "",
              stickyLock: false,
            });
            mainStickyText(graph.name);
          } else if (logseq.settings?.currentGraph === graph.name) { //作成時のグラフと一致する場合
            const divSticky = parent.document.getElementById("logseq-plugin-sticky-popup--sticky") as HTMLDivElement;
            if (divSticky) {
              divSticky.style.display = "unset";
            }
            mainStickyText(graph.name);
          } else {
            const divSticky = parent.document.getElementById("logseq-plugin-sticky-popup--sticky") as HTMLDivElement;
            if (divSticky) {
              divSticky.style.display = "none";
            }
          }

        }
      });
    });
  }
  //end graph changed

};

//end main



//Sticky Text
function mainStickyText(graph: string) {
  const dsl = (flag, text, x, y, width, height, uuid, pageName) => {
    if (flag.lock === true) {

    } else if (logseq.settings?.stickyLock === true) {
      const stickyUnlock = parent.document.getElementById("stickyUnlock") as HTMLSpanElement;
      if (stickyUnlock) {
        stickyUnlock.style.display = "unset";
      }
    } else {
      stickyPosition("logseq-plugin-sticky-popup--sticky");
      logseq.updateSettings({
        currentGraph: graph,
        screenText: text,
        screenUuid: uuid,
        screenPage: pageName,
        stickyLock: true,
      });
    }
    let toPage = "";
    if (pageName) {

      toPage = `<button data-on-click="ActionToPage" title="To the page [[${encodeHtml(pageName)}]]" style="overflow:auto">📄${pageName}</button>`;
    }
    let toRightSidebar = "";
    if (uuid) {
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
  //選択したテキストをdraggableゾーン(Sticky)に表示
  logseq.Editor.onInputSelectionEnd(async (event) => {
    const divSticky = parent.document.getElementById("logseq-plugin-sticky-popup--sticky") as HTMLDivElement;
    if (logseq.settings?.stickyLock === true && divSticky) {
      return;
    } else if (logseq.settings?.ScreenText) {
      logseq.provideUI(dsl({ lock: true, }, logseq.settings?.screenText, logseq.settings?.screenX, logseq.settings?.screenY, logseq.settings?.screenWidth, logseq.settings?.screenHeight, logseq.settings?.screenUuid, logseq.settings?.screenPage));
    } else {
      const current = await logseq.Editor.getCurrentBlock() as BlockEntity;
      const currentPage = await logseq.Editor.getCurrentPage() as PageEntity;
      if (current) {
        const PageName = currentPage?.name || "";
        const x = logseq.settings?.screenX || 5;//event.point.x + 100
        const y = logseq.settings?.screenY || 695;//event.point.y + 100
        const width = logseq.settings?.screenWidth || "195px";
        const height = logseq.settings?.screenHeight || "225px";
        await logseq.provideUI(dsl({}, event.text, x, y, width, height, current.uuid, PageName));
      }
    }
  });

  //読み込み時
  if (logseq.settings?.screenText) {
    logseq.provideUI(dsl({ lock: true, }, logseq.settings.screenText, logseq.settings.screenX, logseq.settings.screenY, logseq.settings.screenWidth, logseq.settings.screenHeight, logseq.settings.screenUuid, logseq.settings.screenPage));
  } else {//値がない場合(初回)
    const dsl = () => {
      const x = (logseq.settings?.screenX || 5) + 'px';
      const y = (logseq.settings?.screenY || 695) + 'px';
      const width = logseq.settings?.screenWidth || "195px";
      const height = logseq.settings?.screenHeight || "225px";
      return {
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
          left: x,
          top: y,
          width: width,
          height: height,
          backgroundColor: 'var(--ls-primary-background-color)',
          color: 'var(--ls-primary-text-color)',
          boxShadow: '1px 2px 5px var(--ls-secondary-background-color)',
        },
        attrs: {
          title: 'Sticky Text',
        },
      }
    }
    logseq.provideUI(dsl());
  }

}
//end Sticky Text


//Sticky Calendar
function mainStickyCalendar() {
  const dsl = () => {
    const x = logseq.settings?.calendarScreenX || 700;
    const y = logseq.settings?.calendarScreenY || 700;
    const width = logseq.settings?.calendarScreenWidth || "320px";
    const height = logseq.settings?.calendarScreenHeight || "300px";
    return {
      key: `sticky-calendar`,
      reset: true,
      template: `
    <div id="StickyCalendar" style="overflow:hidden"></div>
    <div style="position:absolute;bottom:0;right:0.15em;font-size:small">
      <button data-on-click="stickyCalendarReset" title="Reload: For re-rendering">🎮Reload</button> <button data-on-click="stickyCalendarPinned" title="Pin: saves the position of this popup">📌Pin</button>
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
        title: 'Sticky Calendar',
      },
    }
  }
  logseq.provideUI(dsl());
}


//ポジションを記録する
const stickyPosition = (elementId: string) => {
  const element = parent.document.getElementById(elementId) as HTMLDivElement;
  if (element) {
    const rect = element.getBoundingClientRect();
    if (rect) {
      const x: number = Math.round(rect.x);
      const y: number = Math.round(rect.y);
      const width = element.style.width;
      const height = element.style.height;
      if (elementId === "logseq-plugin-sticky-popup--sticky") {
        logseq.updateSettings({
          screenX: x || logseq.settings?.screenX,
          screenY: y || logseq.settings?.screenY,
          screenWidth: width || logseq.settings?.screenWidth,
          screenHeight: height || logseq.settings?.screenHeight,
        });
      } else if (elementId === "logseq-plugin-sticky-popup--sticky-calendar") {
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
//end Sticky Calendar


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


//model
const model = {
  stickyPinned() {
    stickyPosition("logseq-plugin-sticky-popup--sticky");
    logseq.UI.showMsg("pinned", "success");
  },
  stickyCalendarPinned() {
    stickyPosition("logseq-plugin-sticky-popup--sticky-calendar");
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
    stickyPosition("logseq-plugin-sticky-popup--sticky");
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
    stickyPosition("logseq-plugin-sticky-popup--sticky");
    logseq.Editor.openInRightSidebar(logseq.settings?.screenUuid);
  },
  async ActionToPage() {
    stickyPosition("logseq-plugin-sticky-popup--sticky");
    const getPage = await logseq.Editor.getPage(logseq.settings?.screenPage);
    if(getPage){
    logseq.Editor.scrollToBlockInPage(logseq.settings?.screenPage, logseq.settings?.screenUuid);
    }else{
      logseq.UI.showMsg("Page not found", "error");
    }
  },
  async openFromToolbar() {
    if (logseq.settings?.graphLock === true && logseq.settings?.currentGraph !== graphName) {
      logseq.UI.showMsg("Sticky Text popup is locked for the graph");
      logseq.showSettingsUI();
    } else {
      mainStickyText(graphName);
    }
    const div = parent.document.getElementById("logseq-plugin-sticky-popup--sticky-calendar") as HTMLDivElement;
    if (!div) {
      await mainStickyCalendar();
      setTimeout(() => {
        logseq.App.setRightSidebarVisible("toggle");
      }, 10);
      setTimeout(() => {
        logseq.App.setRightSidebarVisible("toggle");
      }, 30);
    }
  },
};
//end model


logseq.ready(model, main).catch(console.error);