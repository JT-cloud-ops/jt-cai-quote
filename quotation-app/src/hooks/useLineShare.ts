import { useState } from 'react';
import html2canvas from 'html2canvas';
import type { QuotationData } from '../types';
import { buildQuotationShareMessage } from '../shared/utils/lineShareMessage';

export const createSharePayload = (customerName: string, jobName: string) => {
  const customer = customerName || '未命名客戶';
  const job = jobName || '未命名印件';
  return { customer, job, fileName: `報價單_${customer}_${job}.jpg`, title: '報價單圖檔', text: buildQuotationShareMessage(customer, job) };
};

export const useLineShare = (data: QuotationData) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const shareToLine = async () => {
    const previewElement = document.querySelector('.preview-container') as HTMLElement | null;
    if (!previewElement) { alert('找不到預覽畫面，無法轉圖。'); return; }
    setIsGenerating(true);
    try {
      const canvas = await html2canvas(previewElement, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      const customer = data.customerName || '未命名客戶';
      const firstJob = data.quotationType === 'single' ? data.items[0]?.jobName : data.bookletJobs[0]?.jobName;
      const payload = createSharePayload(customer, firstJob || '');
      const fileName = payload.fileName;
      if (navigator.share && navigator.canShare) {
        const blob = await (await fetch(imgData)).blob();
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        if (navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], title: payload.title, text: payload.text }); return; }
      }
      const newWindow = window.open();
      if (newWindow) { newWindow.document.write(`<img src="${imgData}" style="width:100%" />`); newWindow.document.write('<p style="text-align:center; font-size:1.5rem;">請長按圖片進行分享或儲存</p>'); }
      else alert('請允許彈出視窗以查看產生的報價單圖檔。');
    } catch (err) { console.error('Image generation error:', err); alert('圖檔產生失敗，請再試一次。'); }
    finally { setIsGenerating(false); }
  };
  return { shareToLine, isGenerating };
};
