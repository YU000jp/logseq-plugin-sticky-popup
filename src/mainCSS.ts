
//end Setting changed

//set CSS class
export function setCSSclass() {
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
export function loadMainCSS() {
  const baseId = logseq.baseInfo.id;
  if (baseId === undefined) throw new Error("baseId is undefined");
  const stickyId = `${baseId}--sticky`;
  const stickyCalendarId = `${baseId}--sticky-calendar`;
  logseq.provideStyle(String.raw`
  body.is-pdf-active div#${stickyId},
  body.is-pdf-active div#${stickyCalendarId},
  body:not([data-page="home"]).sp-textVisible-Journal div#${stickyId},
  body:not([data-page="page"]).sp-textVisible-Not-Journal div#${stickyId},
  body.sp-textVisible-None div#${stickyId},
  body:not([data-page="home"]).sp-calendarVisible-Journal div#${stickyCalendarId},
  body:not([data-page="page"]).sp-calendarVisible-Not-Journal div#${stickyCalendarId},
  body.sp-calendarVisible-None div#${stickyCalendarId} {
    display: none;
  }
  body:not(.sp-textZIndex) div#${stickyId},
  body:not(.sp-calendarZIndex) div#${stickyCalendarId} {
    z-index: 1!important;
  }
  body.sp-textZIndex div#${stickyId},
  body.sp-calendarZIndex div#${stickyCalendarId} {
    z-index: var(--ls-z-index-level-1)!important;
  }
  nav[aria-label="Navigation menu"]{ /* navigation menuのz-indexを変更 */
    z-index: var(--ls-z-index-level-5);
  }
  div#${stickyId} {
    min-width: 260px;
    max-width: 780px;
    min-height: 120px;
    max-height: 500px;
  }
  div#${stickyCalendarId} {
    min-width: 295px;
    max-width: 360px;
    min-height: 280px;
    max-height: 320px;
  }
  div#${stickyCalendarId} div.ls-ui-float-content {
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  div#sticky-event-left {
    position:absolute;
    bottom:0;
    font-size:small;
    background:var(--ls-primary-background-color);
    margin-right:.5em;
  }
  div#sticky-event-button {
    position: absolute;
    top: .2em;
    right: 3em;
    font-size: .94em;
    background:var(--ls-primary-background-color);
  }
  div#sticky-event-button button {
    margin-left: .2em;
  }


  div#${baseId}--overdue span.block-marker {
    cursor: pointer;
    text-decoration: underline;
    padding: 0 0.8em;
    border: 1px solid;
    margin-right: 0.8em;
  }
  div#${baseId}--overdue li {
    margin-bottom: 0.5em;
  }
  /* require Logseq v0.9.10 or later */
  body:has(div#root main.ls-right-sidebar-open) div:is(#${baseId}--overdue,#${baseId}--messageBox) {
    display: none;
  }
  div#root main div[data-id="${baseId}"] textarea.form-input {
    height: 12em;
    font-size: unset;
  }
  div#root main div[data-id="${baseId}"] div[data-key="backgroundColor"] select option[value="var(--ls-primary-background-color)"] {
    background:var(--ls-primary-background-color)
  }
  div#root main div[data-id="${baseId}"] div[data-key="backgroundColor"] select option[value="var(--ls-secondary-background-color)"] {
    background:var(--ls-secondary-background-color)
  }
  div#root main div[data-id="${baseId}"] div[data-key="backgroundColor"] select option[value="var(--ls-tertiary-background-color)"] {
    background:var(--ls-tertiary-background-color)
  }
  div#root main div[data-id="${baseId}"] div[data-key="backgroundColor"] select option[value="var(--ls-quaternary-background-color)"] {
    background:var(--ls-quaternary-background-color)
  }
  div#root main div[data-id="${baseId}"] div[data-key="backgroundColor"] select option[value="var(--ls-table-tr-even-background-color)"] {
    background:var(--ls-table-tr-even-background-color)
  }
  div#root main div[data-id="${baseId}"] div[data-key="backgroundColor"] select option[value="var(--ls-block-properties-background-color)"] {
    background:var(--ls-block-properties-background-color)
  }
  div#root main div[data-id="${baseId}"] div[data-key="backgroundColor"] select option[value="var(--ls-page-properties-background-color)"] {
    color:var(--ls-page-properties-background-color)
  }
  div#root main div[data-id="${baseId}"] div[data-key="fontColor"] select option[value="var(--ls-primary-text-color)"] {
    color:var(--ls-primary-text-color)
  }
  div#root main div[data-id="${baseId}"] div[data-key="fontColor"] select option[value="var(--ls-secondary-text-color)"] {
    color:var(--ls-secondary-text-color)
  }
  div#root main div[data-id="${baseId}"] div[data-key="fontColor"] select option[value="var(--ls-title-text-color)"] {
    color:var(--ls-title-text-color)
  }
  div#root main div[data-id="${baseId}"] div[data-key="fontColor"] select option[value="var(--ls-link-text-color)"] {
    color:var(--ls-link-text-color)
  }
  div#root main div[data-id="${baseId}"] div.cp__plugins-settings-inner div.heading-item {
    outline:2px solid;
  }
  `);
}
