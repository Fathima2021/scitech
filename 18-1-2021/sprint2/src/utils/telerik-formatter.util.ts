export const convertTelerikToHTML = (text: string | undefined): string => {
  if (!text) {
    return '';
  }
  if (!text.includes('t:Paragraph')) {
    return text;
  }
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, 'text/xml');
  const _para: any = xmlDoc.getElementsByTagName('t:Paragraph');
  let htmldoc = '<p>';
  for (const tag of _para) {
    for (const child of tag.children) {
      const _el: any = {};
      Array.from(child.attributes).forEach((ch: any) => {
        _el[ch.name] = ch.nodeValue;
      });
      if (_el.Text) {
        htmldoc += `<span style='font-size:${_el.FontSize}px; font-family:${_el.FontFamily}; background:${_el.HighlightColor}'>${_el.Text}</span>`;
      }
    }
  }
  htmldoc += '</p>';
  return htmldoc;
};
