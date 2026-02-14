import { toPng } from 'html-to-image';

export const downloadImage = async (elementId: string, fileName: string = 'product-mockup.png') => {
  const node = document.getElementById(elementId);
  if (!node) return;

  try {
    const dataUrl = await toPng(node, {
      quality: 1.0,
      pixelRatio: 1, // 1:1 since we are rendering at 1080px native
      cacheBust: true,
    });

    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('Failed to generate image', err);
    // Don't alert on bulk download to avoid spamming alerts
    if (!fileName.startsWith('BULK_')) {
       alert('حدث خطأ أثناء إنشاء الصورة. يرجى المحاولة مرة أخرى.');
    }
  }
};

export const downloadAllImages = async (idsAndNames: { id: string, name: string }[]) => {
  for (const item of idsAndNames) {
    await downloadImage(item.id, item.name);
    // Small delay to prevent browser from blocking multiple downloads
    await new Promise(resolve => setTimeout(resolve, 500));
  }
};