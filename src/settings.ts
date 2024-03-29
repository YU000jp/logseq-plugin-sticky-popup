import { SettingSchemaDesc } from "@logseq/libs/dist/LSPlugin.user";
//user setting
//https://logseq.github.io/plugins/types/SettingSchemaDesc.html
export const settingsTemplate: SettingSchemaDesc[] = [
  {
    key: "headerForStickyText",
    title: "--- Sticky Text ---",
    type: "heading",
    default: "",
    description: "Select string and click the same block. Registered in pop-ups and automatically locked. Markdown is not reflected. Can be called from 📌 button on toolbar.",
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
    title: "(Sticky Text) Show over sidebar or not",
    type: "boolean",
    default: true,
    description: "",
  },
  {
    key: "headerForStickyCalendar",
    title: "--- Sticky Calendar ---",
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
    title: "(Sticky Calendar) Show over sidebar or not",
    type: "boolean",
    default: true,
    description: "",
  },
  {
    key: "headerForStickyOverdue",
    title: "--- Overdue task board ---",
    type: "heading",
    default: "",
    description: `
    Display overdue tasks from yesterday (If found).
    Enabled when toggles are on. Can be called from ⏳ button on toolbar.`
    ,
  },
  {
    key: "enableOverdueOnJournalTemplate",
    type: "boolean",
    title: "Show the board when journal template is loaded",
    description: "",
    default: false,
  },
  {
    key: "enableOverdueLogseqLoaded",
    type: "boolean",
    title: "Show the board when Logseq is loaded",
    description: "",
    default: false,
  },
  {
    key: "headerForStickyMessage",
    title: "--- Daily message board ---",
    type: "heading",
    default: "",
    description: `
    Display user message each day.
    Enabled when toggles are on. Can be called from 💬 button on toolbar.

    ⚠️Supports HTML instead of markdown. Use direct file paths instead of indirect.
    `,
  },
  {
    //messageBoard
    key: "enableMessageBox",
    type: "boolean",
    title: "Show the board when today journal is created",
    description: "",
    default: true,
  },
  {
    //messageBoard Logseq loaded
    key: "enableMessageBoxLogseqLoaded",
    type: "boolean",
    title: "Show the board when Logseq loaded",
    description: "",
    default: true,
  },
  {
    key: "enableMessageBoxTimeout",
    type: "boolean",
    title: "Enable close the board timeout",
    description: "",
    default: true,
  },
  {
    //close timeout
    key: "messageBoxTimeout",
    type: "enum",
    title: "Close the board timeout [ms]",
    enumChoices: ["8000", "9000", "10000", "12000", "14000", "16000", "18000", "20000"],
    description: "default: 10000",
    default: "10000",
  },
  {
    //background color
    key: "backgroundColor",
    type: "enum",
    title: "Background color (from theme)",
    enumChoices: [
      "var(--ls-primary-background-color)",
      "var(--ls-secondary-background-color)",
      "var(--ls-tertiary-background-color)",
      "var(--ls-quaternary-background-color)",
      "var(--ls-table-tr-even-background-color)",
      "var(--ls-block-properties-background-color)",
      "var(--ls-page-properties-background-color)",
    ],
    description: "default: var(--ls-primary-background-color)",
    default: "var(--ls-primary-background-color)",
  },

  {
    //color
    key: "fontColor",
    type: "enum",
    title: "Font Color (from theme)",
    enumChoices: [
      "var(--ls-primary-text-color)",
      "var(--ls-secondary-text-color)",
      "var(--ls-title-text-color)",
      "var(--ls-link-text-color)",
    ],
    description: "default: var(--ls-primary-text-color)",
    default: "var(--ls-primary-text-color)",
  },
  {
    key: "localizeOrEnglish",
    type: "enum",
    title: "The board title, select localize (your language) or English",
    enumChoices: ["default", "en"],
    description: "",
    default: "default",
  },
  {
    key: "toggleMonday",
    type: "boolean",
    title: "Show Monday message board",
    description: "",
    default: false,
  },
  {
    key: "monday",
    type: "string",
    inputAs: "textarea",
    title: "Message (HTML) for Monday ⚠️",
    description: "To view the modified content, toggle it off and then on again.",
    default: "",
  },
  {
    key: "toggleTuesday",
    type: "boolean",
    title: "Show Tuesday message board",
    description: "",
    default: false,
  },
  {
    key: "tuesday",
    type: "string",
    inputAs: "textarea",
    title: "Message (HTML) for Tuesday ⚠️",
    description: "To view the modified content, toggle it off and then on again.",
    default: "",
  },
  {
    key: "toggleWednesday",
    type: "boolean",
    title: "Show Wednesday message board",
    description: "",
    default: false,
  },
  {
    key: "wednesday",
    type: "string",
    inputAs: "textarea",
    title: "Message (HTML) for Wednesday ⚠️",
    description: "To view the modified content, toggle it off and then on again.",
    default: "",
  },
  {
    key: "toggleThursday",
    type: "boolean",
    title: "Show Thursday message board",
    description: "",
    default: false,
  },
  {
    key: "thursday",
    type: "string",
    inputAs: "textarea",
    title: "Message (HTML) for Thursday ⚠️",
    description: "To view the modified content, toggle it off and then on again.",
    default: "",
  },
  {
    key: "toggleFriday",
    type: "boolean",
    title: "Show Friday message board",
    description: "",
    default: false,
  },
  {
    key: "friday",
    type: "string",
    inputAs: "textarea",
    title: "Message (HTML) for Friday ⚠️",
    description: "To view the modified content, toggle it off and then on again.",
    default: "",
  },
  {
    key: "toggleSaturday",
    type: "boolean",
    title: "Show Saturday message board",
    description: "",
    default: false,
  },
  {
    key: "saturday",
    type: "string",
    inputAs: "textarea",
    title: "Message (HTML) for Saturday ⚠️",
    description: "To view the modified content, toggle it off and then on again.",
    default: "",
  },
  {
    key: "toggleSunday",
    type: "boolean",
    title: "Show Sunday message board",
    description: "",
    default: false,
  },
  {
    key: "sunday",
    type: "string",
    inputAs: "textarea",
    title: "Message (HTML) for Sunday ⚠️",
    description: "To view the modified content, toggle it off and then on again.",
    default: "",
  },
];

