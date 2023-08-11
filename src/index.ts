import '@logseq/libs'; //https://plugins-doc.logseq.com/
import { AppGraphInfo, BlockEntity, LSPluginBaseInfo, PageEntity } from "@logseq/libs/dist/LSPlugin.user";
import { settingsTemplate } from './setting';
import { loadStickyText, stickyTextOpenUI } from './stickyText';
import { loadMainCSS, setCSSclass } from './mainCSS';
import { loadStickyCalendar } from './stickyCalendar';
import { stickyPosition } from './lib';
import { onSettingsChangedCallback } from './setting';

export let graphName = "";//For command pallet

//main
const main = () => {
  const stickyID = `${logseq.baseInfo.id}--sticky`;
  const stickyCalendarID = `${logseq.baseInfo.id}--sticky-calendar`;
  //check current graph
  logseq.App.getCurrentGraph().then((graph) => {
    if (graph) { //デモグラフの場合は返り値がnull
      graphName = graph.name;

      //ユーザー設定
      logseq.useSettingsSchema(settingsTemplate);

      //sticky text
      if (logseq.settings!.stickyTextVisible !== "None") loadStickyText();

      //Sticky Calendar
      if (logseq.settings!.stickyCalendarVisible !== "None") loadStickyCalendar();
    }
  });

  logseq.App.onCurrentGraphChanged(async () => {//グラフの変更時
    const graph = await logseq.App.getCurrentGraph() as AppGraphInfo | null;
    if (graph) { //デモグラフの場合は返り値がnull
      graphName = graph.name;
      //sticky text
      if (logseq.settings!.stickyTextVisible !== "None") loadStickyText();
    }
  });

  //CSS
  loadMainCSS();

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
  logseq.onSettingsChanged((newSettings: LSPluginBaseInfo['settings'], oldSettings: LSPluginBaseInfo['settings']) => {
    onSettingsChangedCallback(newSettings, oldSettings);
  });


  //選択したテキストをdraggableゾーン(Sticky)に表示
  logseq.Editor.onInputSelectionEnd(async (event) => {
    if (logseq.settings?.stickyLock === true) {
      return;
    } else if (logseq.settings?.ScreenText) {
      await stickyTextOpenUI({ lock: true, }, logseq.settings?.screenText, logseq.settings?.screenX, logseq.settings?.screenY, logseq.settings?.screenWidth, logseq.settings?.screenHeight, logseq.settings?.screenUuid, logseq.settings?.screenPage);
    } else {
      const current = await logseq.Editor.getCurrentBlock() as BlockEntity;
      const currentPage = await logseq.Editor.getCurrentPage() as PageEntity;
      if (current) {
        const PageName = currentPage?.name || "";
        const x = logseq.settings?.screenX || 5;
        const y = logseq.settings?.screenY || 695;
        const width = logseq.settings?.screenWidth || "195px";
        const height = logseq.settings?.screenHeight || "225px";
        await stickyTextOpenUI({}, event.text, x, y, width, height, current.uuid, PageName);
      }
    }
  });


  //model
  logseq.provideModel({
    stickyPinned() {
      stickyPosition(stickyID);
    },
    stickyCalendarPinned() {
      stickyPosition(stickyCalendarID);
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
        screenPage: "",
        screenUuid: "",
        screenText: "",
      });
      const stickyLock = parent.document.getElementById("stickyLock") as HTMLSpanElement;
      if (stickyLock) {
        stickyLock.style.display = "none";
      }
      const stickyUnlock = parent.document.getElementById("stickyUnlock") as HTMLSpanElement;
      if (stickyUnlock) {
        stickyUnlock.style.display = "none";
      }
      const textElement = parent.document.getElementById(`${stickyID}--text`) as HTMLDivElement;
      if (textElement) {
        textElement.innerHTML = "";
      }
      logseq.UI.showMsg("Unlocked", "success");
    },
    popupOpenFromToolbar() {
      if (logseq.settings!.stickyTextVisible !== "None") loadStickyText();
      if (logseq.settings!.stickyCalendarVisible !== "None") {
        const div = parent.document.getElementById(stickyCalendarID) as HTMLDivElement;
        if (!div) {
          loadStickyCalendar();
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


logseq.ready(main).catch(console.error);