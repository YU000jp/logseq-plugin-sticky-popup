

function removeMarkdownLink(blockContent: string) {
  if (blockContent.includes("[[")) {
    blockContent = blockContent.replaceAll(/\[\[/g, "");
  }
  if (blockContent.includes("]]")) {
    blockContent = blockContent.replaceAll(/\]\]/g, "");
  }
  return blockContent;
}
function removeMarkdownAliasLink(blockContent: string) {
  //マークダウン形式の[タイトル](リンク名)の場合、正規表現で[と]と(リンク名)を取り除く
  if (blockContent.includes("[")) {
    blockContent = blockContent.replaceAll(/\[([^\]]+)\]\(([^\)]+)\)/g, "$1");
  }
  return blockContent;
}
function replaceOverCharacters(blockContent: string, maxLength: number) {
  if (blockContent.length > maxLength) {
    blockContent = blockContent.substring(0, maxLength) + "...";
  }
  return blockContent;
}
function removeMarkdownImage(blockContent: string) {
  if (blockContent.includes("![")) {
    blockContent = blockContent.replaceAll(/!\[[^\]]+\]\([^\)]+\)/g, "");
  }
  return blockContent;
}

export function removeMarkdown(blockContent: string, maxLength: number) {
  blockContent = removeMarkdownLink(blockContent);
  blockContent = removeMarkdownAliasLink(blockContent);
  blockContent = removeMarkdownImage(blockContent);
  return replaceOverCharacters(blockContent, maxLength);
}