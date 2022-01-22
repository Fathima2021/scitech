export const convertToImageFiles = async (dataUrl: string, fileName: string): Promise<File> => {
  const res: Response = await fetch(dataUrl);
  const blob: Blob = await res.blob();
  return new File([blob], fileName, { type: 'image/png' });
};

export const replaceBase64ToUrl = async (htmlString: string): Promise<any> => {
  let count = 0;
  const urls: any = [];
  const htmlObject: any = document.createElement('div');
  htmlObject.innerHTML = htmlString;
  const images: any = (htmlObject as HTMLElement).getElementsByTagName('img');
  for (const img of images) {
    count++;
    const _d = await convertToImageFiles(img.src, img.alt);
    urls.push(_d);
    img.src = `{{Figure_${count}}}`;
  }
  return { figures: urls, content: htmlObject.outerHTML };
};
