import React from 'react';
interface Props { onSave: () => void; onShare: () => void; onPrint: () => void; isGenerating: boolean; }
const QuotationActions: React.FC<Props> = ({ onSave, onShare, onPrint, isGenerating }) => <div className="action-buttons">
  <button className="save-btn" onClick={onSave}>儲存此報價單</button>
  <button className="export-img-btn" onClick={onShare} disabled={isGenerating} style={{ backgroundColor: '#00b900', color: 'white' }}>{isGenerating ? '處理中...' : '儲存圖片 (JPG)'}</button>
  <button className="print-button" onClick={onPrint}>列印報價單 (PDF)</button>
</div>;
export default QuotationActions;
