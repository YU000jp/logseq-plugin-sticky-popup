
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
  const stickyID = `${logseq.baseInfo.id}--sticky`;
  const stickyCalendarID = `${logseq.baseInfo.id}--sticky-calendar`;
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
  }import { stickyID } from '.';
import { stickyCalendarID } from '.';

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
  `);
}
