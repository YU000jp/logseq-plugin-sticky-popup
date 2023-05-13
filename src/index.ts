import '@logseq/libs'; //https://plugins-doc.logseq.com/
import { AppUserConfigs, BlockEntity, IBatchBlock, PageEntity, SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";
import { getDateForPage } from 'logseq-dateutils'; //https://github.com/hkgnp/logseq-dateutils
import moment from 'moment';

let graphName = "";//For command pallet

//main
const main = () => {

  //check current graph
  logseq.App.getCurrentGraph().then((graph) => {
    if (graph) { //デモグラフの場合は返り値がnull
      graphName = graph.name;
      //ユーザー設定
      userSettings();

      //sticky text
      mainStickyText();

      //Sticky Calendar
      mainStickyCalendar();

      //sticky Weekly
      mainStickyWeekly();
    }
  });

  logseq.App.onCurrentGraphChanged(() => {//グラフの変更時
    logseq.App.getCurrentGraph().then((graph) => {
      if (graph) { //デモグラフの場合は返り値がnull
        graphName = graph.name;
        //sticky text
        mainStickyText();
      }
    });
  });

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
      stickyPosition("logseq-plugin-sticky-popup--sticky");
      logseq.UI.showMsg("pinned", "success");
    },
    stickyCalendarPinned() {
      stickyPosition("logseq-plugin-sticky-popup--sticky-calendar");
      logseq.UI.showMsg("pinned", "success");
    },
    stickyWeeklyPinned() {
      stickyPosition("logseq-plugin-sticky-popup--sticky-weekly");
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
      if (getPage) {
        logseq.Editor.scrollToBlockInPage(logseq.settings?.screenPage, logseq.settings?.screenUuid);
      } else {
        logseq.UI.showMsg("Page not found", "error");
      }
    },
    async openFromToolbar() {
      mainStickyText();
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
      mainStickyWeekly();
    },
    async openWeekPage(e) {
      const { week } = e.dataset;
      // const page = await logseq.Editor.getPage(week);
      // if (page) {
      //   await logseq.App.pushState("page", { name: week });
      // } else {
      await createWeekPage(week);
      //}
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
  if (oldSet.stickyWeeklyVisible && newSet.stickyWeeklyVisible) {
    parent.document.body.classList.remove(`sp-WeeklyVisible-${oldSet.stickyWeeklyVisible}`);
    parent.document.body.classList.add(`sp-weeklyVisible-${newSet.stickyWeeklyVisible}`);
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
  if (oldSet.stickyWeeklyZIndex === false && newSet.stickyWeeklyZIndex === true) {
    parent.document.body.classList.add("sp-weeklyZIndex");
  } else if (oldSet.stickyWeeklyZIndex === true && newSet.stickyWeeklyZIndex === false) {
    parent.document.body.classList.remove("sp-weeklyZIndex");
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
  if (logseq.settings?.stickyWeeklyVisible) {
    parent.document.body.classList.add(`sp-weeklyVisible-${logseq.settings.stickyWeeklyVisible}`);
  }
  if (!logseq.settings?.stickyTextZIndex || logseq.settings?.stickyTextZIndex === true) {
    parent.document.body.classList.add("sp-textZIndex");
  }
  if (!logseq.settings?.stickyCalendarZIndex || logseq.settings?.stickyCalendarZIndex === true) {
    parent.document.body.classList.add("sp-calendarZIndex");
  }
  if (!logseq.settings?.stickyWeeklyZIndex || logseq.settings?.stickyWeeklyZIndex === true) {
    parent.document.body.classList.add("sp-weeklyZIndex");
  }
}
//end set CSS class


//main CSS
function mainCSS() {
  logseq.provideStyle(String.raw`
  body.is-pdf-active div#logseq-plugin-sticky-popup--sticky,
  body.is-pdf-active div#logseq-plugin-sticky-popup--sticky-calendar,
  body.is-pdf-active div#logseq-plugin-sticky-popup--sticky-weekly,
  body:not([data-page="home"]).sp-textVisible-Journal div#logseq-plugin-sticky-popup--sticky,
  body:not([data-page="page"]).sp-textVisible-Not-Journal div#logseq-plugin-sticky-popup--sticky,
  body.sp-textVisible-None div#logseq-plugin-sticky-popup--sticky,
  body:not([data-page="home"]).sp-calendarVisible-Journal div#logseq-plugin-sticky-popup--sticky-calendar,
  body:not([data-page="page"]).sp-calendarVisible-Not-Journal div#logseq-plugin-sticky-popup--sticky-calendar,
  body.sp-calendarVisible-None div#logseq-plugin-sticky-popup--sticky-calendar,
  body:not([data-page="home"]).sp-weeklyVisible-Journal div#logseq-plugin-sticky-popup--sticky-weekly,
  body:not([data-page="page"]).sp-weeklyVisible-Not-Journal div#logseq-plugin-sticky-popup--sticky-weekly,
  body.sp-weeklyVisible-None div#logseq-plugin-sticky-popup--sticky-weekly {
    display: none;
  }

  /* TODO: awesome UIプラグインで、Navigation menuが隠れる件(Sticky Textが上になる) */

  body:not(.sp-textZIndex) div#logseq-plugin-sticky-popup--sticky,
  body:not(.sp-calendarZIndex) div#logseq-plugin-sticky-popup--sticky-calendar,
  body:not(.sp-weeklyZIndex) div#logseq-plugin-sticky-popup--sticky-weekly {
    z-index: 1!important;
  }
  body.sp-textZIndex div#logseq-plugin-sticky-popup--sticky,
  body.sp-calendarZIndex div#logseq-plugin-sticky-popup--sticky-calendar,
  body.sp-weeklyZIndex div#logseq-plugin-sticky-popup--sticky-weekly {
    z-index: var(--ls-z-index-level-1)!important;
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
      key: "",
      title: "",
      type: "heading",
      default: "",
      description: "",
    },
    {
      key: "",
      title: "Sticky Text",
      type: "heading",
      default: "",
      description: `
      Select string and click the same block.
      Registered in pop-ups and automatically locked. Markdown is not reflected.
      `,
    },
    { //select ジャーナルのみ、ジャーナル以外、全てのページ
      key: "stickyTextVisible",
      title: "Visible or not",
      type: "enum",
      enumChoices: ["Journal", "Not-Journal", "All", "None"],
      default: "All",
      description: "",
    },
    {
      key: "stickyTextZIndex",
      title: "Showing over sidebar or not",
      type: "boolean",
      default: true,
      description: "",
    },
    {
      key: "",
      title: "",
      type: "heading",
      default: "",
      description: "",
    },
    {
      key: "",
      title: "Sticky Calendar",
      type: "heading",
      default: "",
      description: `
      Require rendering of Block Calendar Plugin
      Set 'custom' and '#StickyCalendar'(Provide CSS selector) on the plugin settings
      `,
    },
    {
      key: "stickyCalendarVisible",
      title: "Visible or not",
      type: "enum",
      enumChoices: ["Journal", "Not-Journal", "All", "None"],
      default: "Journal",
      description: "",
    },
    {
      key: "stickyCalendarZIndex",
      title: "Showing over sidebar or not",
      type: "boolean",
      default: true,
      description: "",
    },
    {
      key: "",
      title: "",
      type: "heading",
      default: "",
      description: "",
    },
    {
      key: "",
      title: "Sticky Weekly (Demo)",
      type: "heading",
      default: "",
      description: `
      Development stage👷🚧
      
      `,
    },//"Support ISO 8601" setting option should not be changed after the fact, as it has an impact on number of week in year. TODO:
    {
      key: "stickyWeeklyVisible",
      title: "Visible or not",
      type: "enum",
      enumChoices: ["Journal", "Not-Journal", "All", "None"],
      default: "None",
      description: "",
    },
    {
      key: "stickyWeeklyZIndex",
      title: "Showing over sidebar or not",
      type: "boolean",
      default: true,
      description: "",
    },
    // { TODO:
    //   key: "weeklyISO",
    //   title: "Support ISO 8601 (for week of year)",
    //   type: "boolean",
    //   default: false,
    //   description: "true: U.K. Europe / false: U.S. Japan (local)",
    // },
  ];
  logseq.useSettingsSchema(settingsTemplate);
}
//end user setting


const dsl = (flag, text, x, y, width, height, uuid, pageName) => {
  if (flag.lock === true) {
    //
  } else if (logseq.settings?.stickyLock === true) {
    const stickyUnlock = parent.document.getElementById("stickyUnlock") as HTMLSpanElement;
    if (stickyUnlock) {
      stickyUnlock.style.display = "unset";
    }
  } else {
    stickyPosition("logseq-plugin-sticky-popup--sticky");
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


//Sticky Weekly
async function mainStickyWeekly() {
  let left, top;
  if (logseq.settings?.weeklyScreenX) {
    left = logseq.settings?.weeklyScreenX + 'px';
  } else {
    left = '760px';
  }
  if (logseq.settings?.weeklyScreenY) {
    top = logseq.settings?.weeklyScreenY + 'px';
  } else {
    top = '20px';
  }
  const seek = await seekWeek();
  let weekString = "";
  const { preferredDateFormat } = await logseq.App.getUserConfigs();
  if (preferredDateFormat === 'yyyy-MM-dd' || preferredDateFormat === 'yyyy/MM/dd' || preferredDateFormat === 'yyyy.MM.dd') {
    weekString += `<span title="${seek.weekday}">${seek.weekday}</span>, `;
  }
  const weekPageName = `${seek.year}/W${seek.numberOfWeek}`;
  weekString += `<a data-on-click="openWeekPage" data-week="${weekPageName}" title="${weekPageName}">Week ${seek.numberOfWeek}</a>`; //dataは小文字
  logseq.provideUI({
    key: `sticky-weekly`,
    reset: true,
    template: `
    <main>
      ${weekString}
    </main>
    <div style="position:absolute;bottom:0;right:0.65em;font-size:small">
      <button data-on-click="stickyWeeklyPinned" title="Pin: saves the position of this popup">📌Pin</button>
    </div>
  `,
    style: {
      left,
      top,
      width: logseq.settings?.weeklyScreenWidth || "350px",
      height: logseq.settings?.weeklyScreenHeight || "120px",
      backgroundColor: 'var(--ls-primary-background-color)',
      color: 'var(--ls-primary-text-color)',
      borderRadius: '20px',
      boxShadow: 'box-shadow: inset -20px 20px 60px var(--ls-primary-background-color), inset 20px -20px 60px var(--ls-secondary-background-color)',
      paddingLeft: '0.5em',
      paddingRight: '0.5em',
    },
    attrs: {
      title: 'Sticky Weekly',
    },
  });


  //seek 週数など
  async function seekWeek(): Promise<{ year: number, numberOfWeek: number, weekday: string }> {
    let year, numberOfWeek, weekday;
    //ユーザー日付形式と週始めの曜日
    const { preferredStartOfWeek } = await logseq.App.getUserConfigs() as AppUserConfigs;

    // 週の開始曜日を設定（0 = 日曜日 US、1 = 月曜日 JP、2 = 火曜日、...、6 = 土曜日)
    const startOfWeek: number = Number(preferredStartOfWeek); //string型からnumber型に変換
    const today = await moment();
    weekday = today.format("dddd");
    // if (logseq.settings?.weeklyISO === true) { TODO:
    //   //ISO 8601週番号適用
    //   year = today.format("GGGG");
    //   numberOfWeek = Number(today.format("WW"));
    // } else {
      moment.updateLocale('en', {
        week: {
          dow: startOfWeek,
        },
      });
      year = today.format("gggg"); // 年を取得
      numberOfWeek = today.format("ww"); // 週を取得
    // }
    return {
      year,
      numberOfWeek,
      weekday,
    };
  }
}
//end


//Sticky Weekly: Weekly Page (ex. 2023/W17)
async function createWeekPage(weekName: string) {
  const page = await logseq.Editor.getPage(weekName) as PageEntity;
  if (page) {
    const block = await logseq.Editor.getPageBlocksTree(page.uuid) as BlockEntity[];
    if (block[1]?.content) {
      logseq.App.pushState("page", { name: weekName });
    } else {
      await createWeeklyTable(page.uuid);
      logseq.App.pushState("page", { name: weekName });
    }
  } else {
    const create = await logseq.Editor.createPage(weekName, "", { redirect: true, createFirstBlock: true, }) as PageEntity;
    if (create) {
      await createWeeklyTable(create.uuid);
    }
  }
}


//Sticky Weekly: Weekly Table
async function createWeeklyTable(uuid: any) {
  let ww = "ww"; //TODO: ISO 8601週番号適用できているか不明

  //ユーザー日付形式と週始めの曜日
  const { preferredDateFormat, preferredStartOfWeek } = await logseq.App.getUserConfigs() as AppUserConfigs;

  // 週の開始曜日を設定（0 = 日曜日 US、1 = 月曜日 JP、2 = 火曜日、...、6 = 土曜日)
  const startOfWeek: number = Number(preferredStartOfWeek); //string型からnumber型に変換
  const today = await moment(); // 今日の日付を取得
  // 週の始まりの日付を求める
  const startOfCurrentWeek = today.clone().startOf('week').add(startOfWeek, 'days');
  const startOfPreviousWeek = startOfCurrentWeek.clone().subtract(1, 'week');
  const startOfNextWeek = startOfCurrentWeek.clone().add(1, 'week');
  // 前月、今月、来月の日付を取得する
  const startOfPreviousMonth = today.clone().subtract(1, 'month').startOf('month');
  const startOfCurrentMonth = today.clone().startOf('month');
  const startOfNextMonth = today.clone().add(1, 'month').startOf('month');

  // 出力する文字列を生成する
  let batchLinks: IBatchBlock;
  if (preferredDateFormat === 'yyyy-MM-dd' || preferredDateFormat === 'yyyy/MM/dd' || preferredDateFormat === 'yyyy.MM.dd') {
    batchLinks = {
      content: "### Links",
      children: [
        { content: `[[${startOfPreviousMonth.format('gggg[/]MM')}]] < [[${startOfCurrentMonth.format('gggg[/]MM')}]] > [[${startOfNextMonth.format('gggg[/]MM')}]]` },
        { content: `[[${startOfPreviousWeek.format(`gggg[/W]${ww}`) || ' '}]] < ${startOfCurrentWeek.format(`gggg[/W]${ww}`)} > [[${startOfNextWeek.format(`gggg[/W]${ww}`)}]]` },
      ],
    };
  } else {
    batchLinks = {
      content: "### Links",
      children: [
        { content: `[[${startOfPreviousWeek.format(`gggg[/W]${ww}`) || ' '}]] < ${startOfCurrentWeek.format(`gggg[/W]${ww}`)} > [[${startOfNextWeek.format(`gggg[/W]${ww}`)}]]` },
      ],
    };
  }
  let batchDayLinks: IBatchBlock;
  if (preferredDateFormat === 'yyyy-MM-dd' || preferredDateFormat === 'yyyy/MM/dd' || preferredDateFormat === 'yyyy.MM.dd') {
    batchDayLinks = {
      content: `## Week ${startOfCurrentWeek.format(`${ww}`)}`,
      children: [
        { content: `### ${startOfCurrentWeek.format('dddd')} ${getDateForPage(new Date(startOfCurrentWeek.format('gggg/MM/DD')), preferredDateFormat)}` },
        { content: `### ${startOfCurrentWeek.clone().add(1, 'day').format('dddd')} ${getDateForPage(new Date(startOfCurrentWeek.clone().add(1, 'day').format('gggg/MM/DD')), preferredDateFormat)}` },
        { content: `### ${startOfCurrentWeek.clone().add(2, 'day').format('dddd')} ${getDateForPage(new Date(startOfCurrentWeek.clone().add(2, 'day').format('gggg/MM/DD')), preferredDateFormat)}` },
        { content: `### ${startOfCurrentWeek.clone().add(3, 'day').format('dddd')} ${getDateForPage(new Date(startOfCurrentWeek.clone().add(3, 'day').format('gggg/MM/DD')), preferredDateFormat)}` },
        { content: `### ${startOfCurrentWeek.clone().add(4, 'day').format('dddd')} ${getDateForPage(new Date(startOfCurrentWeek.clone().add(4, 'day').format('gggg/MM/DD')), preferredDateFormat)}` },
        { content: `### ${startOfCurrentWeek.clone().add(5, 'day').format('dddd')} ${getDateForPage(new Date(startOfCurrentWeek.clone().add(5, 'day').format('gggg/MM/DD')), preferredDateFormat)}` },
        { content: `### ${startOfCurrentWeek.clone().add(6, 'day').format('dddd')} ${getDateForPage(new Date(startOfCurrentWeek.clone().add(6, 'day').format('gggg/MM/DD')), preferredDateFormat)}` },
      ],
    };
  } else {
    batchDayLinks = {
      content: `## Week ${startOfCurrentWeek.format(`${ww}`)}`,
      children: [
        { content: `### ${getDateForPage(new Date(startOfCurrentWeek.format('gggg/MM/DD')), preferredDateFormat)}` },
        { content: `### ${getDateForPage(new Date(startOfCurrentWeek.clone().add(1, 'day').format('gggg/MM/DD')), preferredDateFormat)}` },
        { content: `### ${getDateForPage(new Date(startOfCurrentWeek.clone().add(2, 'day').format('gggg/MM/DD')), preferredDateFormat)}` },
        { content: `### ${getDateForPage(new Date(startOfCurrentWeek.clone().add(3, 'day').format('gggg/MM/DD')), preferredDateFormat)}` },
        { content: `### ${getDateForPage(new Date(startOfCurrentWeek.clone().add(4, 'day').format('gggg/MM/DD')), preferredDateFormat)}` },
        { content: `### ${getDateForPage(new Date(startOfCurrentWeek.clone().add(5, 'day').format('gggg/MM/DD')), preferredDateFormat)}` },
        { content: `### ${getDateForPage(new Date(startOfCurrentWeek.clone().add(6, 'day').format('gggg/MM/DD')), preferredDateFormat)}` },
      ],
    };
  }
  //console.log(batchLinks);
  //console.log(batchDayLinks);
  await logseq.Editor.insertBatchBlock(uuid, batchLinks, {});
  await logseq.Editor.insertBatchBlock(uuid, batchDayLinks, {});
  logseq.Editor.exitEditingMode();

}
//end


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
      } else if (elementId === "logseq-plugin-sticky-popup--sticky-weekly") {
        logseq.updateSettings({
          weeklyScreenX: x || logseq.settings?.weeklyScreenX,
          weeklyScreenY: y || logseq.settings?.weeklyScreenY,
          weeklyScreenWidth: width || logseq.settings?.weeklyScreenWidth,
          weeklyScreenHeight: height || logseq.settings?.weeklyScreenHeight,
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