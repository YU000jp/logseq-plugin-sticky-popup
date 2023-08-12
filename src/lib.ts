
export const getWeekdayString = (targetDay: Date): string => new Intl.DateTimeFormat((logseq.settings?.localizeOrEnglish as string) || "default", { weekday: "long" }).format(targetDay);

//yyyymmdd形式をDateに変換
export const getDateInputJournalDay = (str: string): Date => new Date(
  Number(str.slice(0, 4)),
  Number(str.slice(4, 6)) - 1,
  Number(str.slice(6)),
  0, 0, 0, 0
);

//Dateをyyyymmdd形式の文字列に変換
export const getStringInputDate = (date: Date): string => `${date.getFullYear()}${("0" + (date.getMonth() + 1)).slice(-2)}${("0" + date.getDate()).slice(-2)}`;

//encodeHtml
export function encodeHtml(str: string): string {
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

// export async function removeProperties(properties, blockContent: string): Promise<string> {
//   if (!properties) return blockContent;
//   const keys = Object.keys(properties);
//   for (let j = 0; j < keys.length; j++) {
//     let key = keys[j];
//     const values = properties[key];
//     //backgroundColorをbackground-colorにする
//     //キーの途中で一文字大文字になっている場合は小文字にしてその前にハイフンを追加する
//     key = key.replace(/([A-Z])/g, "-$1").toLowerCase();
//     blockContent = blockContent.replace(`${key}:: ${values}`, "");
//     blockContent = blockContent.replace(`${key}::`, "");
//   }
//   return blockContent;
// }

//位置データの返却
export const getRect = (element: HTMLElement) => {
  const rect = element.getBoundingClientRect() as DOMRect;
  return {
    x: Math.round(rect.x) as number,
    y: Math.round(rect.y) as number,
    width: element.style.width,
    height: element.style.height
  };
}

export const closeUI = (key: string) => {
  const element = parent.document.getElementById(logseq.baseInfo.id + `--${key}`) as HTMLDivElement;
  if (element) element.remove();
};
//for setting UI


//レンジバー計算用
// export const calculateRangeBarForSettingUI = (min: number, max: number, value: number): number => {
//   if (value < 1) value = 1;
//   return (value * (max - min) / 100) + min;
// };

