import '@logseq/libs'; //https://plugins-doc.logseq.com/
import { AppGraphInfo, BlockEntity, LSPluginBaseInfo, PageEntity } from "@logseq/libs/dist/LSPlugin.user";
import { loadStickyText, stickyTextOpenUI } from './stickyText';
import { loadMainCSS, setCSSclass } from './mainCSS';
import { loadStickyCalendar } from './stickyCalendar';
import { stickyTextPosition, stickyCalendarPosition } from './lib';
import { fromJournals } from "./dailyMessage";
import { settingsTemplate } from './settings';
import { setUIoverdue } from "./overdue";
import { onSettingsChangedForDayOfWeekMessage, dailyMessageOpenUI, } from "./dailyMessage";
export let graphName = "";//For command pallet


//main
const main = () => {
  const stickyID = `${logseq.baseInfo.id}--sticky`;
  const stickyCalendarID = `${logseq.baseInfo.id}--sticky-calendar`;
  //check current graph
  logseq.App.getCurrentGraph().then((graph) => {
    if (graph)  //デモグラフの場合は返り値がnull
      graphName = graph.name;
  });
  //ユーザー設定
  logseq.useSettingsSchema(settingsTemplate);
  if (!logseq.settings) setTimeout(() => logseq.showSettingsUI(), 300);

  //sticky text
  if (logseq.settings!.stickyTextVisible !== "None") loadStickyText();

  //Sticky Calendar
  if (logseq.settings!.stickyCalendarVisible !== "None") loadStickyCalendar();


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
  logseq.App.registerUIItem('toolbar', {
    key: 'openOverdue',
    template: `<div><a class="button icon" data-on-click="overdueFromToolbar" title="Open overdue task board ( for check )" style="font-size:19px">⏳</a></div>`,
  });
  logseq.App.registerUIItem('toolbar', {
    key: 'openMessageBox',//その日のみ表示
    template: `<div><a class="button icon" data-on-click="messageBoxFromToolbar" title="Open daily message board ( only today )" style="font-size:19px">💬</a></div>`,
  });
  logseq.App.registerUIItem("toolbar", {
    key: "Sticky-Popup",
    template: `<div><a class="button icon" data-on-click="popupOpenFromToolbar" title="Open popups ( if close them )" style="font-size:19px">📌</a></div>`,
  });

  logseq.App.onTodayJournalCreated(async ({ title }) => await fromJournals(title));

  if (logseq.settings!.enableOverdueLogseqLoaded === true) setTimeout(() => setUIoverdue(false), 300);
  if (logseq.settings!.enableMessageBoxLogseqLoaded === true) setTimeout(() => dailyMessageOpenUI(new Date()), 300);


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
    overdueFromToolbar: () => setUIoverdue(false),
    messageBoxFromToolbar: () => {
      if (logseq.settings!.toggleSunday === false &&
        logseq.settings!.toggleMonday === false &&
        logseq.settings!.toggleTuesday === false &&
        logseq.settings!.toggleWednesday === false &&
        logseq.settings!.toggleThursday === false &&
        logseq.settings!.toggleFriday === false &&
        logseq.settings!.toggleSaturday === false) {
        //いずれの曜日にもDaily Messageが設定されていない場合
        logseq.UI.showMsg("Daily messages need to be set for each day of the week on plugin settings.", "warning", { timeout: 3000 });
        return;
      }
      dailyMessageOpenUI(new Date());
    },
    stickyPinned: () => stickyTextPosition(stickyID, true),
    stickyCalendarPinned: () => stickyCalendarPosition(stickyCalendarID, true),
    stickyCalendarReset: () => {
      setTimeout(() => {
        logseq.App.setRightSidebarVisible("toggle");
        setTimeout(() => logseq.App.setRightSidebarVisible("toggle"), 30);
      }, 10);
    },
    ActionUnlock: () => {
      stickyTextPosition(stickyID);
      logseq.updateSettings({
        stickyLock: false,
        screenPage: "",
        screenUuid: "",
        screenText: "",
      });
      const stickyLock = parent.document.getElementById("stickyLock") as HTMLSpanElement | null;
      if (stickyLock) stickyLock.style.display = "none";
      const stickyUnlock = parent.document.getElementById("stickyUnlock") as HTMLSpanElement | null;
      if (stickyUnlock) stickyUnlock.style.display = "none";
      const textElement = parent.document.getElementById(`${stickyID}--text`) as HTMLDivElement | null;
      if (textElement) textElement.innerHTML = "";
      logseq.UI.showMsg("Unlocked", "success");
    },
    popupOpenFromToolbar: () => {
      if (logseq.settings!.stickyTextVisible !== "None") loadStickyText();
      if (logseq.settings!.stickyCalendarVisible !== "None") {
        const div = parent.document.getElementById(stickyCalendarID) as HTMLDivElement | null;
        if (!div) {
          loadStickyCalendar();
          setTimeout(() => {
            logseq.App.setRightSidebarVisible("toggle");
            setTimeout(() => logseq.App.setRightSidebarVisible("toggle"), 30);
          }, 10);
        }
      }
    },
  });//end model


  logseq.beforeunload(async () => {
    await stickyTextPosition(stickyID);
  });


    //If change settings, show message box
    onSettingsChangedForDayOfWeekMessage();

  //Setting changed
  logseq.onSettingsChanged((newSet: LSPluginBaseInfo['settings'], oldSet: LSPluginBaseInfo['settings']) => {
    if (oldSet.stickyTextVisible && newSet.stickyTextVisible) {
      parent.document.body.classList.remove(`sp-textVisible-${oldSet.stickyTextVisible}`);
      parent.document.body.classList.add(`sp-textVisible-${newSet.stickyTextVisible}`);
    }
    if (oldSet.stickyCalendarVisible && newSet.stickyCalendarVisible) {
      parent.document.body.classList.remove(`sp-calendarVisible-${oldSet.stickyCalendarVisible}`);
      parent.document.body.classList.add(`sp-calendarVisible-${newSet.stickyCalendarVisible}`);
    }
    if (oldSet.stickyTextZIndex === false && newSet.stickyTextZIndex === true) parent.document.body.classList.add("sp-textZIndex");
    else if (oldSet.stickyTextZIndex === true && newSet.stickyTextZIndex === false) parent.document.body.classList.remove("sp-textZIndex");
    if (oldSet.stickyCalendarZIndex === false && newSet.stickyCalendarZIndex === true) parent.document.body.classList.add("sp-calendarZIndex");
    else if (oldSet.stickyCalendarZIndex === true && newSet.stickyCalendarZIndex === false) parent.document.body.classList.remove("sp-calendarZIndex");
  });


}

logseq.ready(main).catch(console.error);
