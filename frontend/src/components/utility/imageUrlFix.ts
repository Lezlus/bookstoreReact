function imageUrlFix(url: string): string {
  let fixedUrl = url.replaceAll(' ', '%20');
  return fixedUrl;
}

export { imageUrlFix };