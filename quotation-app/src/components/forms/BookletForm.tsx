import React from 'react';
import type { BookletJob } from '../../types';

interface Props {
  jobs: BookletJob[];
  isDept: boolean;
  onJobChange: (jobIndex: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onPartChange: (jobIndex: number, partIndex: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onAddPart: (jobIndex: number) => void;
  onRemovePart: (jobIndex: number, partIndex: number) => void;
}

const BookletForm: React.FC<Props> = ({ jobs, isDept, onJobChange, onPartChange, onAddPart, onRemovePart }) => {
  return (
    <>
      <div className="section-title">冊子印件資訊</div>
      {jobs.map((job, jobIndex) => (
        <div key={job.id} className="booklet-job-box" style={{ background: '#fff', border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <div className="form-group"><label>冊子名稱</label><input type="text" name="jobName" value={job.jobName} onChange={(e) => onJobChange(jobIndex, e)} /></div>
          <div className="form-row">
            <div className="form-group"><label>開數</label><input type="text" name="jobSheetSize" value={job.jobSheetSize} onChange={(e) => onJobChange(jobIndex, e)} placeholder="整本開數" /></div>
            <div className="form-group"><label>裝訂方法</label><input type="text" name="bindingMethod" value={job.bindingMethod} onChange={(e) => onJobChange(jobIndex, e)} placeholder="例如：無線膠裝" /></div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>總數量</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" name="quantity" value={job.quantity} onChange={(e) => onJobChange(jobIndex, e)} style={{ flex: 1 }} />
                <select name="unit" value={job.unit} onChange={(e) => onJobChange(jobIndex, e)} style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}>
                  <option value="本">本</option><option value="份">份</option>
                </select>
              </div>
            </div>
            <div className="form-group"><label>每本單價</label><input type="text" name="unitPrice" value={job.unitPrice} onChange={(e) => onJobChange(jobIndex, e)} /></div>
          </div>
          {isDept && (
            <div className="form-group">
              <label style={{ color: '#d32f2f', fontWeight: 'bold' }}>總公司量 (必填)</label>
              <input type="text" name="hqQuantity" value={job.hqQuantity} onChange={(e) => onJobChange(jobIndex, e)} placeholder="請輸入總公司量資訊" style={{ borderColor: !job.hqQuantity ? '#d32f2f' : '#ccc' }} />
            </div>
          )}
          
          <div className="parts-list" style={{ marginTop: '1rem' }}>
            {job.parts.map((part, partIndex) => (
              <div key={part.id} className="part-item-box" style={{ borderLeft: '4px solid #646cff', paddingLeft: '1rem', marginBottom: '1rem', background: '#fcfcff', padding: '0.5rem' }}>
                <div className="item-header" style={{ marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span>結構：</span>
                    {partIndex === 1 ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select name="partName" value={part.partName} onChange={(e) => onPartChange(jobIndex, partIndex, e)}>
                          <option value="扉頁">扉頁</option><option value="蝴蝶頁">蝴蝶頁</option><option value="自訂">自訂</option>
                        </select>
                        {part.partName === '自訂' && <input type="text" placeholder="輸入名稱" onChange={(e) => onPartChange(jobIndex, partIndex, e)} name="partName" />}
                      </div>
                    ) : (
                      <input type="text" name="partName" value={part.partName} onChange={(e) => onPartChange(jobIndex, partIndex, e)} style={{ width: '100px' }} />
                    )}
                  </div>
                  {job.parts.length > 1 && <button className="remove-btn" onClick={() => onRemovePart(jobIndex, partIndex)}>刪除部分</button>}
                </div>
                <div className="form-row">
                  <div className="form-group"><label>開數</label><input type="text" name="sheetSize" value={part.sheetSize} onChange={(e) => onPartChange(jobIndex, partIndex, e)} /></div>
                  <div className="form-group">
                    <label>印色 / 特別色</label>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <input type="text" name="printColor" value={part.printColor} onChange={(e) => onPartChange(jobIndex, partIndex, e)} placeholder="印色" style={{ flex: 1 }} />
                      <input type="text" name="specialColor" value={part.specialColor} onChange={(e) => onPartChange(jobIndex, partIndex, e)} placeholder="特別色" style={{ flex: 1 }} />
                    </div>
                  </div>
                </div>
                <div className="form-group"><label>用紙名稱</label><input type="text" name="paperName" value={part.paperName} onChange={(e) => onPartChange(jobIndex, partIndex, e)} /></div>
                <div className="form-group"><label>加工內容 (含頁數)</label><textarea name="processingDetails" value={part.processingDetails} onChange={(e) => onPartChange(jobIndex, partIndex, e)} rows={2} /></div>
              </div>
            ))}
            <button className="add-btn" onClick={() => onAddPart(jobIndex)}>+ 新增品項</button>
          </div>
        </div>
      ))}
    </>
  );
};

export default BookletForm;
