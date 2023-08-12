import { getWeekdayString } from "./lib";
import { closeUI } from "./lib";
import { LSPluginBaseInfo, PageEntity } from "@logseq/libs/dist/LSPlugin.user";
import { getDateInputJournalDay } from "./lib";
import { setUIoverdue } from "./overdue";
import { keyStickyDailyMessage } from ".";
import { getRect } from "./lib";



export const dailyMessageOpenUI = (targetDay: Date, demo?: number) => {
  //曜日を確認
  const dayOfWeek: number = (demo || demo === 0) ? demo : targetDay.getDay();
  //曜日に応じてメッセージを表示
  switch (dayOfWeek) {
    case 0:
      if (logseq.settings!.toggleSunday)
        dailyMessageSetUI(
          getWeekdayString(targetDay),
          logseq.settings!.sunday,
          true,
          false
        );
      break;
    case 1:
      if (logseq.settings!.toggleMonday)
        dailyMessageSetUI(
          getWeekdayString(targetDay),
          logseq.settings!.monday,
          true,
          false
        );
      break;
    case 2:
      if (logseq.settings!.toggleTuesday)
        dailyMessageSetUI(
          getWeekdayString(targetDay),
          logseq.settings!.tuesday,
          true,
          false
        );
      break;
    case 3:
      if (logseq.settings!.toggleWednesday)
        dailyMessageSetUI(
          getWeekdayString(targetDay),
          logseq.settings!.wednesday,
          true,
          false
        );
      break;
    case 4:
      if (logseq.settings!.toggleThursday)
        dailyMessageSetUI(
          getWeekdayString(targetDay),
          logseq.settings!.thursday,
          true,
          false
        );
      break;
    case 5:
      if (logseq.settings!.toggleFriday)
        dailyMessageSetUI(
          getWeekdayString(targetDay),
          logseq.settings!.friday,
          true,
          false
        );
      break;
    case 6:
      if (logseq.settings!.toggleSaturday)
        dailyMessageSetUI(
          getWeekdayString(targetDay),
          logseq.settings!.saturday,
          false,
          false
        );
      break;
  }
};


export const dailyMessageSetUI = (title: string, print: string, timeoutCancel: boolean, demo: boolean) => {
  if (print === undefined) return;
  const width: string = logseq.settings?.dailyMessageScreenWidth || "300px"; //300-900
  const height: string = logseq.settings?.dailyMessageScreenHeight || "300px"; //300-900
  const left: string = logseq.settings!.dailyMessageScreenX ? logseq.settings?.dailyMessageScreenX+"px" : "300px";
  const top: string = logseq.settings!.dailyMessageScreenY ? logseq.settings!.dailyMessageScreenY+"px" :"calc(2vh + 50px)";
  const backgroundColor = (logseq.settings?.backgroundColor as string) || "var(--ls-primary-background-color)";
  const color = (logseq.settings?.fontColor as string) || "var(--ls-primary-text-color)";
  let right = "unset";
  let bottom = "unset";
  const show = (demo: boolean) => {
    closeUI("messageBox");
    logseq.provideUI({
      key: keyStickyDailyMessage,
      reset: true,
      template: `
    <div style="padding:0.5em">
    ${print}
    </div>
    <div id="sticky-event-button">
    <button data-on-click="stickyPinnedDailyMessage" title="Pin: saves the position of this popup">📌</button>
  </div>
  `,
      style: {
        padding: "0.5em",
        left,
        top,
        right,
        bottom,
        width,
        height,
        backgroundColor,
        color,
        boxShadow: "1px 2px 5px var(--ls-secondary-background-color)",
        zIndex: demo === true ? "var(--ls-z-index-level-5)" : "9",
      },
      attrs: {
        title: '💬' + title,
      },
    });
    const element = parent.document.getElementById(logseq.baseInfo.id + "--messageBox") as HTMLDivElement;
    if (logseq.settings!.enableMessageBoxTimeout === true) setTimeout(() => {
      let closeCancel: boolean = false;
      element.onclick = () => {
        closeCancel = true;
        if (element) element.style.borderColor = "unset";
      };
      element.onclose = () => closeCancel = true;
      setTimeout(() => {
        if (closeCancel === false && element) element.style.borderColor = "red";
      }, (logseq.settings!.messageBoxTimeout as number) - 2000);
      setTimeout(() => {
        if (closeCancel === false && element) element.remove();
      }, logseq.settings!.messageBoxTimeout as number || 6000);
    }, 100);
    //TODO: なぜか、エラーになってondragendが動作しない
    //https://www.smpl-rfrns.net/DOM/ondragend.html
    // element.addEventListener("dragend", () => {
    //   console.log("moved");
    //     logseq.updateSettings({
    //       UIoverdueWidth: calculateRangeBarForSettingUI(300, 900, Number(element.style.width.slice(0, -2))),
    //       UIoverdueHeight: calculateRangeBarForSettingUI(300, 900, Number(element.style.height.slice(0, -2))),
    //       UIoverdueX: Number(element.style.left.slice(0, -2)),
    //       UIoverdueY: Number(element.style.top.slice(0, -2)),
    //     });
    // });
  };
  timeoutCancel === true ? show(demo) : setTimeout(() => show(demo), 1500);
};


export function onSettingsChangedForDayOfWeekMessage() {
  logseq.onSettingsChanged((newSet: LSPluginBaseInfo["settings"], oldSet: LSPluginBaseInfo["settings"]) => {
    if (newSet.width !== oldSet.width || newSet.height !== oldSet.height) {
      dailyMessageSetUI(
        getWeekdayString(new Date()),
        "Change size of message box",
        true,
        true
      );
    } else if (newSet.backgroundColor !== oldSet.backgroundColor) {
      dailyMessageSetUI(
        getWeekdayString(new Date()),
        "Change background color of message box",
        true,
        true
      );
    } else if (newSet.fontColor !== oldSet.fontColor) {
      dailyMessageSetUI(
        getWeekdayString(new Date()),
        "Change font color of message box",
        true,
        true
      );
    } else if (newSet.localizeOrEnglish !== oldSet.localizeOrEnglish) {
      dailyMessageSetUI(
        getWeekdayString(new Date()),
        "Change language of message box",
        true,
        true
      );
    }
    if (oldSet.toggleMonday === false && newSet.toggleMonday === true) {
      const monday = new Date();
      monday.setDate(monday.getDate() - monday.getDay() + 1);
      dailyMessageSetUI(
        getWeekdayString(monday),
        newSet.monday,
        true,
        true
      );
    } else if (oldSet.toggleTuesday === false && newSet.toggleTuesday === true) {
      const tuesday = new Date();
      tuesday.setDate(tuesday.getDate() - tuesday.getDay() + 2);
      dailyMessageSetUI(
        getWeekdayString(tuesday),
        newSet.tuesday,
        true,
        true
      );
    } else if (oldSet.toggleWednesday === false && newSet.toggleWednesday === true) {
      const wednesday = new Date();
      wednesday.setDate(wednesday.getDate() - wednesday.getDay() + 3);
      dailyMessageSetUI(getWeekdayString(wednesday),
        newSet.wednesday,
        true,
        true
      );
    } else if (oldSet.toggleThursday === false && newSet.toggleThursday === true) {
      const thursday = new Date();
      thursday.setDate(thursday.getDate() - thursday.getDay() + 4);
      dailyMessageSetUI(getWeekdayString(thursday),
        newSet.thursday,
        true,
        true
      );
    } else if (oldSet.toggleFriday === false && newSet.toggleFriday === true) {
      const friday = new Date();
      friday.setDate(friday.getDate() - friday.getDay() + 5);
      dailyMessageSetUI(getWeekdayString(friday),
        newSet.friday,
        true,
        true
      );
    } else if (oldSet.toggleSaturday === false && newSet.toggleSaturday === true) {
      const saturday = new Date();
      saturday.setDate(saturday.getDate() - saturday.getDay() + 6);
      dailyMessageSetUI(getWeekdayString(saturday),
        newSet.saturday,
        true,
        true
      );
    } else if (oldSet.toggleSunday === false && newSet.toggleSunday === true) {
      const sunday = new Date();
      sunday.setDate(sunday.getDate() - sunday.getDay() + 7);
      dailyMessageSetUI(getWeekdayString(sunday),
        newSet.sunday,
        true,
        true
      );
    }
  }
  );
}


export const fromJournals = async (title: string) => {
  if (!logseq.settings) return;
  await logseq.Editor.restoreEditingCursor();
  //Load message box
  if (logseq.settings!.enableMessageBox === true) {
    if (logseq.settings!.toggleSunday === false ||
      logseq.settings!.toggleMonday === false ||
      logseq.settings!.toggleTuesday === false ||
      logseq.settings!.toggleWednesday === false ||
      logseq.settings!.toggleThursday === false ||
      logseq.settings!.toggleFriday === false ||
      logseq.settings!.toggleSaturday === false) return;
    const page = (await logseq.Editor.getPage(title)) as PageEntity | null;
    if (page && page!.journalDay) dailyMessageOpenUI(getDateInputJournalDay(String(page.journalDay)) as Date);
  }
  //Load overdue
  if (logseq.settings!.enableOverdueOnJournalTemplate === true) await setUIoverdue(false);
};
export const stickyDailyMessagePosition = (elementId: string, message?: boolean) => {
  const element = parent.document.getElementById(elementId) as HTMLDivElement || null;
  if (!element) return;
  const { x, y, width, height } = getRect(element);
  logseq.updateSettings({
    dailyMessageScreenX: x,
    dailyMessageScreenY: y,
    dailyMessageScreenWidth: width,
    dailyMessageScreenHeight: height,
  });
  if (message) logseq.UI.showMsg("pinned", "success", { timeout: 1000 });
};

