import React from 'react';
import type { QuotationItem } from '../../types';

interface Props {
  items: QuotationItem[];
  onChange: (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

const SingleSheetForm: React.FC<Props> = ({ items, onChange, onAdd, onRemove }) => {
  const formatNumber = (num: number) => {
    return num > 0 ? num.toLocaleString() : '';
  };

  return (
    <>
      <div className="section-title">印件品項</div>
      {items.map((item, index) => {
        const qty = parseFloat(item.quantity) || 0;
        const price = parseFloat(item.unitPrice) || 0;
        const amount = Math.round(qty * price);
        
        return (
          <div key={item.id} className="item-form-box">
            <div className="item-header">
              <span>項目 {index + 1}</span>
              {items.length > 1 && <button className="remove-btn" onClick={() => onRemove(index)}>刪除</button>}
            </div>
            <div className="form-group">
              <label>印件名稱</label>
              <input type="text" name="jobName" value={item.jobName} onChange={(e) => onChange(index, e)} />
            </div>
            <div className="form-row">
              <div className="form-group"><label>開數</label><input type="text" name="sheetSize" value={item.sheetSize} onChange={(e) => onChange(index, e)} /></div>
              <div className="form-group">
                <label>印色 / 特別色</label>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <input type="text" name="printColor" value={item.printColor} onChange={(e) => onChange(index, e)} placeholder="印色" style={{ flex: 1 }} />
                  <input type="text" name="specialColor" value={item.specialColor} onChange={(e) => onChange(index, e)} placeholder="特別色" style={{ flex: 1 }} />
                </div>
              </div>
            </div>
            <div className="form-group"><label>用紙名稱</label><input type="text" name="paperName" value={item.paperName} onChange={(e) => onChange(index, e)} /></div>
            <div className="form-group"><label>加工內容</label><textarea name="processingDetails" value={item.processingDetails} onChange={(e) => onChange(index, e)} rows={2} /></div>
            
            <div className="form-row">
              <div className="form-group">
                <label>數量 / 單位</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="text" name="quantity" value={item.quantity} onChange={(e) => onChange(index, e)} style={{ flex: 1 }} />
                  <select name="unit" value={item.unit} onChange={(e) => onChange(index, e)} style={{ width: '80px' }}>
                    <option value="份">份</option><option value="張">張</option><option value="本">本</option><option value="個">個</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>單價 / 稅制</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input type="text" name="unitPrice" value={item.unitPrice} onChange={(e) => onChange(index, e)} style={{ flex: 1 }} />
                  <select name="taxType" value={item.taxType} onChange={(e) => onChange(index, e)} style={{ width: '80px' }}>
                    <option value="exclude">未稅</option>
                    <option value="include">含稅</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label>小計金額 (自動計算)</label>
              <input type="text" value={formatNumber(amount)} disabled style={{ backgroundColor: '#f0f0f0', fontWeight: 'bold' }} />
            </div>
          </div>
        );
      })}
      <button className="add-btn" onClick={onAdd}>+ 新增品項</button>
    </>
  );
};

export default SingleSheetForm;
