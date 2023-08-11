import { BlockEntity, PageEntity } from "@logseq/libs/dist/LSPlugin.user";
import { format, subDays, subWeeks } from 'date-fns';
import { getStringInputDate, closeUI } from "./lib";
import removeMd from "remove-markdown";

//Overdue
export const setUIoverdue = async (demo: boolean) => {
  let print: string = "";
  //yyyymmdd形式で今日の日付を作成
  const today = new Date();

  const query = String.raw`
  [:find (pull ?b [*])
  :where
  [?b :block/marker ?marker]
  [(contains? #{"NOW" "LATER" "TODO" "DOING"} ?marker)]
  [?b :block/page ?p]
  (or
    (or
      [?b :block/scheduled ?d]
      [?b :block/deadline ?d]
    )
  )
  [(<= ?d ${getStringInputDate(subDays(today, 1))})]
  [(> ?d ${getStringInputDate(subWeeks(today, 4))})]
]
`;
  const res = await logseq.DB.datascriptQuery(query);
  if (!res || res.length === 0) {
    logseq.UI.showMsg("No find overdue tasks", "info", { timeout: 3000 });
    return;
  }
  //console.log(res);
  if (res) {
    print += `<ul title="">`;
    let itemList: string[] = [];
    let linkList: string[] = [];
    for (const [item] of res) {
      //「item.marker 」に一致するものをitem.contentから取り除く
      let content = item.content;
      if (item.marker) content = content.replace(item.marker + " ", "");
      //「:LOGBOOK:」とそれ以降を取り除く
      const propertyLogbook = content.indexOf(":LOGBOOK:");
      if (propertyLogbook !== -1) content = content.slice(0, propertyLogbook);
      // 「id::」とそれ以降を取り除く
      const propertyId = content.indexOf("id::");
      if (propertyId !== -1) content = content.slice(0, propertyId);
      // 「icon::」とそれ以降を取り除く
      const propertyIcon = content.indexOf("icon::");
      if (propertyIcon !== -1) content = content.slice(0, propertyIcon);
      // 「SCHEDULED:」を「<br/><>SCHEDULED:」に置き換える
      content = content.replace("SCHEDULED:", "<br/><span class='timestamp-label'>SCHEDULED:</span>");
      // 「DEADLINE:」を「<br/><span>DEADLINE:」に置き換える
      content = content.replace("DEADLINE:", "<br/><span class='timestamp-label'>DEADLINE:</span>");
      // [[タイトル]]のように[[と]]で囲まれた文字列が複数ある場合、[[と]]を削除し代わりに<a href="#/page/タイトル">リンクを追加、その文字列だけを全体からいくつか取り出す
      const propertyLink = content.match(/\[\[(.*?)\]\]/g);
      if (propertyLink) {
        for (const link of propertyLink) {
          const linkTitle = link.replace(/\[\[(.*?)\]\]/g, "$1");
          const page = await logseq.Editor.getPage(linkTitle) as PageEntity | null;
          if (!page) continue;
          content = content.replace(link, `<a title="${linkTitle}" id="overdueLink--${page.uuid}">${linkTitle}</a>`);
          linkList.push(page.uuid);
        }
      }

      //モジュールでマークダウンを取り除く
      content = removeMd(content);  

      print += `<li><span class="block-marker ${item.marker}" id="overdueBlock--${item.uuid}" title="Open in right sidebar">${item.marker}</span><span class="overDueContent">${content}</span>`;
      //item.scheduledをyyyy/mm/dd EEE形式に変換し、前後に<と>をつける
      print += `</li>`;
      itemList.push(item.uuid);
    };
    print += `</ul>`;
    const show = (demo: boolean) => {
      closeUI("overdue");
      logseq.provideUI({
        key: "overdue",
        reset: true,
        template: `
      <div style="padding:0.5em">
      ${print}
      </div>
      <div style="margin-top:1em" title="Click toolbar button to update">Last Update : ${format(today, "MM/dd HH:mm")}</div>
    `,
        style: {
          padding: "0.5em",
          right: "3px",
          left: "unset",
          top: "unset",
          bottom: "3px",
          width: `550px`,
          height: `500px`,
          backgroundColor: "var(--ls-primary-background-color)",
          color: "var(--ls-primary-text-color)",
          boxShadow: "1px 2px 5px var(--ls-secondary-background-color)",
          zIndex: demo === true ? "var(--ls-z-index-level-5)" : "9",
        },
        attrs: {
          title: "⏳Overdue task (4 weeks)",
        },
      });
    };
    show(demo);

    setTimeout(() => {

      //click event for task
      itemList.forEach((uuid) => {
        const element = parent.document.getElementById(`overdueBlock--${uuid}`) as HTMLSpanElement;
        if (element) element.onclick = async () => {
          const block = (await logseq.Editor.getBlock(uuid)) as BlockEntity | null;
          if (block) {
            logseq.Editor.openInRightSidebar(uuid);
          } else {
            logseq.UI.showMsg("Block not found", "warning", { timeout: 5000 });
          }
        };
      });
      //click event for link
      linkList.forEach((uuid) => {
        const element = parent.document.getElementById(`overdueLink--${uuid}`) as HTMLAnchorElement;
        if (element) element.onclick = async () => {
          const page = (await logseq.Editor.getPage(uuid)) as PageEntity | null;
          if (page) {
            logseq.Editor.openInRightSidebar(uuid);
          } else {
            logseq.UI.showMsg("Page not found", "warning", { timeout: 5000 });
          }
        };
      });
    }, 300);

  }
};
