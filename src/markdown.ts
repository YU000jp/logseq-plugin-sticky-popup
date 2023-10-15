
const removeMarkdownLink = (blockContent: string) => {
  if (blockContent.includes("[[")) blockContent = blockContent.replaceAll(/\[\[/g, "");
  if (blockContent.includes("]]")) blockContent = blockContent.replaceAll(/\]\]/g, "");
  return blockContent;
};

const removeMarkdownAliasLink = (blockContent: string) => {
  //マークダウン形式の[タイトル](リンク名)の場合、正規表現で[と]と(リンク名)を取り除く
  if (blockContent.includes("[")) blockContent = blockContent.replaceAll(/\[([^\]]+)\]\(([^\)]+)\)/g, "$1");
  return blockContent;
};

const replaceOverCharacters = (blockContent: string, maxLength: number) => {
  if (blockContent.length > maxLength) blockContent = blockContent.substring(0, maxLength) + "...";
  return blockContent;
};

const removeMarkdownImage = (blockContent: string) => {
  if (blockContent.includes("![")) blockContent = blockContent.replaceAll(/!\[[^\]]+\]\([^\)]+\)/g, "");
  return blockContent;
};

export const removeMarkdown = (blockContent: string, maxLength: number) => {
  blockContent = removeMarkdownLink(blockContent);
  blockContent = removeMarkdownAliasLink(blockContent);
  blockContent = removeMarkdownImage(blockContent);
  return replaceOverCharacters(blockContent, maxLength);
};
