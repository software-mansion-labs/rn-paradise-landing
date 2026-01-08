export function parseToHtml(input: string): string {
  return (
    input
      // bold
      .replace(/<b>(.*?)<\/b>/gs, "<b>$1</b>")
      // italic
      .replace(/<i>(.*?)<\/i>/gs, "<i>$1</i>")
      // underline
      .replace(/<u>(.*?)<\/u>/gs, "<u>$1</u>")
      // link: <a href="...">label</a>
      .replace(
        /<a\s+href=['"]([^'"]+)['"]>(.*?)<\/a>/gs,
        (_m, href, label) =>
          `<a href="${href}" target="_blank" rel="noopener noreferrer">${label}</a>`,
      )
      // underline link: <ua href="...">label</ua>
      .replace(
        /<ua\s+href=['"]([^'"]+)['"]>(.*?)<\/ua>/gs,
        (_m, href, label) =>
          `<a href="${href}" target="_blank" rel="noopener noreferrer"><u>${label}</u></a>`,
      )
  );
}
