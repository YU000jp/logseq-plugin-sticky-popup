import { LSPluginBaseInfo, SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";

//end main CSS
//user setting
//https://logseq.github.io/plugins/types/SettingSchemaDesc.html
export const settingsTemplate: SettingSchemaDesc[] = [
  {
    key: "",
    title: "Sticky Text",
    type: "heading",
    default: "",
    description: "Select string and click the same block. Registered in pop-ups and automatically locked. Markdown is not reflected.",
  },
  {
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


// Setting changed
export const onSettingsChangedCallback = (newSet: LSPluginBaseInfo['settings'], oldSet: LSPluginBaseInfo['settings']) => {
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
};

