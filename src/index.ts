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
  logseq.App.onCurrentGraphChanged(() => {
    logseq.App.getCurrentGraph().then((graph) => {
      if (graph) {//デモグラフの場合は返り値がnull
        graphName = graph.name;

        if (!logseq.settings?.currentGraph) {//設定が存在しない場合
          return;
        } else if (logseq.settings?.graphLock === false) {//グラフのロックを解除する場合
          logseq.updateSettings({
            screenUuid: "",
            screenPage: "",
            stickyLock: false,
          });
          mainStickyText(graph.name);
        } else if (logseq.settings?.currentGraph === graph.name) {//作成時のグラフと一致する場合
          const divSticky = parent.document.getElementById("sticky-popup--sticky") as HTMLDivElement;
          if (divSticky) {
            divSticky.style.visibility = "unset";
          }
          mainStickyText(graph.name);
        } else {
          const divSticky = parent.document.getElementById("sticky-popup--sticky") as HTMLDivElement;
          if (divSticky) {
            divSticky.style.visibility = "hidden";
          }
        }

      }
    });
  });

  //CSS
  mainCSS();


  //set CSS class
  setCSSclass();


  //toolbar-item
  logseq.App.registerUIItem("toolbar", {
    key: 'sticky-popup-open',
    template: `<div data-on-click="openFromToolbar" style="font-size:20px">📌</div>`,
  });


  //main support
  parent.document.body.classList.add('is-plugin-sticky-popup-enabled');
  logseq.beforeunload(async () => {
    parent.document.body.classList.remove('is-plugin-sticky-popup-enabled');
    await stickyPosition("sticky-popup--sticky");
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
    if (logseq.settings?.stickyCalendarZIndex) {
      parent.document.body.classList.add("sp-calendarZIndex");
    }
    if (logseq.settings?.stickyTextZIndex) {
      parent.document.body.classList.add("sp-textZIndex");
    }
  }
  //end set CSS class


  //main CSS
  function mainCSS() {
    logseq.provideStyle(String.raw`
  body.is-pdf-active div#sticky-popup--sticky,
  body.is-pdf-active div#sticky-popup--sticky-calendar,
  body:not([data-page="home"]).sp-textVisible-Journal div#sticky-popup--sticky,
  body:not([data-page="page"]).sp-textVisible-Not-Journal div#sticky-popup--sticky,
  body.sp-textVisible-None div#sticky-popup--sticky,
  body:not([data-page="home"]).sp-calendarVisible-Journal div#sticky-popup--sticky-calendar,
  body:not([data-page="page"]).sp-calendarVisible-Not-Journal div#sticky-popup--sticky-calendar,
  body.sp-calendarVisible-None div#sticky-popup--sticky-calendar {
    display: none;
  }

  /* TODO: Navigation menuが隠れる件(Sticky Textが上になる) */

  body:not(.sp-textZIndex) div#sticky-popup--sticky,
  body:not(.sp-calendarZIndex) div#sticky-popup--sticky-calendar {
    z-index: 1!important;
  }

  nav[aria-label="Navigation menu"]{ /* navigation menuのz-indexを変更 */
    z-index: var(--ls-z-index-level-5);
  }
  div#sticky-popup--sticky {
    min-width: 260px;
    max-width: 780px;
    min-height: 120px;
    max-height: 500px;
  }
  div#sticky-popup--sticky-calendar {
    min-width: 295px;
    max-width: 360px;
    min-height: 280px;
    max-height: 320px;
  }
  div#sticky-popup--sticky-calendar div.ls-ui-float-content {
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
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
      {
        key: "stickyTextVisible",
        title: "Sticky Text Visible",
        type: "enum",
        enumChoices: ["Journal", "Not-Journal", "All", "None"],
        default: "All",
        description: "Showing Sticky Text or not",
      },
      {
        //select ジャーナルのみ、ジャーナル以外、全てのページ
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
        default: "None",
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


};
//end main



//Sticky Text
function mainStickyText(graph: string) {
  const dsl = (flag, text: string, x: number, y: number, width, height, uuid, pageName) => {
    if (pageName === null) {
      pageName = "";
    }
    if (flag.lock === true) {
    } else if (logseq.settings?.stickyLock === true) {
      const stickyUnlock = parent.document.getElementById("stickyUnlock") as HTMLSpanElement;
      if (stickyUnlock) {
        stickyUnlock.style.display = "unset";
      }
    } else {
      stickyPosition("sticky-popup--sticky");
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
      toPage = `<button data-on-click="ActionToPage"> > 📄${pageName}</button>`;
    }
    let toRightSidebar = "";
    if (uuid) {
      toRightSidebar = `<button data-on-click="ActionToRightSidebar"> > 👉On right-Sidebar</button><br/>`;
    }
    return {
      key: `sticky`,
      reset: true,
      template: `
        <div style="padding:10px;overflow:auto">
            <p style="font-size:0.98em;margin-bottom:2em"><a style="cursor:default"><span id="stickyLock">🔒</span> ${text}</a></p>
          <div style="position:absolute;bottom:0;font-size:small">
            ${toRightSidebar}
            ${toPage}
          </div>
          <div style="position:absolute;bottom:0;right:0.15em;font-size:small">
            <button data-on-click="ActionUnlock" id="stickyUnlock"> > <span style="text-decoration:underline;font-size:1.2em">🔓Unlock</span></button><br/>
            <button data-on-click="stickyPinned"> > 📌pin</button>
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
    const divSticky = parent.document.getElementById("sticky-popup--sticky") as HTMLDivElement;
    if (logseq.settings?.stickyLock === true && divSticky) {
      return;
    } else if (logseq.settings?.ScreenText) {
      logseq.provideUI(dsl({ lock: true, }, logseq.settings?.screenText, logseq.settings?.screenX, logseq.settings?.screenY, logseq.settings?.screenWidth, logseq.settings?.screenHeight, logseq.settings?.screenUuid, logseq.settings?.screenPage));
    } else {
      const current = await logseq.Editor.getCurrentBlock() as BlockEntity;
      const currentPage = await logseq.Editor.getCurrentPage() as PageEntity;
      if (current) {
        const PageName = currentPage?.name || "";
        const x: number = logseq.settings?.screenX || event.point.x + 100;
        const y: number = logseq.settings?.screenY || event.point.y + 100;
        const width: number = logseq.settings?.screenWidth || 340;
        const height: number = logseq.settings?.screenHeight || 160;
        await logseq.provideUI(dsl({}, event.text, x, y, width, height, current.uuid, PageName));
      }
    }
  });

  //再開時に表示
  if (logseq.settings?.screenText) {
    logseq.provideUI(dsl({ lock: true, }, logseq.settings.screenText, logseq.settings.screenX, logseq.settings.screenY, logseq.settings.screenWidth, logseq.settings.screenHeight, logseq.settings.screenUuid, logseq.settings.screenPage));
  }
}
//end Sticky Text


//Sticky Calendar
function mainStickyCalendar() {
  const dsl = () => {
    const x = logseq.settings?.calendarScreenX || 700;
    const y = logseq.settings?.calendarScreenY || 700;
    const width = logseq.settings?.calendarScreenWidth || 320;
    const height = logseq.settings?.calendarScreenHeight || 300;
    return {
      key: `sticky-calendar`,
      reset: true,
      template: `
    <div id="StickyCalendar" style="overflow:hidden"></div>
    <div style="position:absolute;bottom:0;right:0.15em;font-size:small">
      <button data-on-click="stickyCalendarReset"> > 🎮reset</button> 
      <button data-on-click="stickyCalendarPinned"> > 📌pin</button>
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
      if (elementId === "sticky-popup--sticky") {
        logseq.updateSettings({
          screenX: x || logseq.settings?.screenX,
          screenY: y || logseq.settings?.screenY,
          screenWidth: width || logseq.settings?.screenWidth,
          screenHeight: height || logseq.settings?.screenHeight,
        });
      } else if (elementId === "sticky-popup--sticky-calendar") {
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


//model
const model = {
  stickyPinned() {
    stickyPosition("sticky-popup--sticky");
    logseq.UI.showMsg("pinned", "success");
  },
  stickyCalendarPinned() {
    stickyPosition("sticky-popup--sticky-calendar");
    logseq.UI.showMsg("pinned", "success");
  },
  stickyCalendarReset() {
    logseq.App.setRightSidebarVisible("toggle");
    setTimeout(() => {
      logseq.App.setRightSidebarVisible("toggle");
    }, 20);
  },
  ActionUnlock() {
    stickyPosition("sticky-popup--sticky");
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
    stickyPosition("sticky-popup--sticky");
    logseq.Editor.openInRightSidebar(logseq.settings?.screenUuid);
  },
  ActionToPage() {
    stickyPosition("sticky-popup--sticky");
    logseq.Editor.scrollToBlockInPage(logseq.settings?.screenPage, logseq.settings?.screenUuid);
  },
  openFromToolbar() {
    logseq.updateSettings({
      stickyLock: false,
    });
    if (logseq.settings?.graphLock === true && logseq.settings?.currentGraph !== graphName) {
      logseq.UI.showMsg("Sticky Text popup is locked for the graph");
      logseq.showSettingsUI();
    } else {
      mainStickyText(graphName);
    }
    const div = parent.document.getElementById("sticky-popup--sticky-calendar") as HTMLDivElement;
    if (!div) {
      mainStickyCalendar();
      logseq.App.setRightSidebarVisible("toggle");
      setTimeout(() => {
        logseq.App.setRightSidebarVisible("toggle");
      }, 20);
    }
  },
};
//end model


logseq.ready(model, main).catch(console.error);