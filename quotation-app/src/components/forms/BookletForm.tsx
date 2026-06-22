import React from 'react';
import type { BookletJob, BookletPart } from '../../types';
import PrintColorFields from './PrintColorFields';

interface Props {
  jobs: BookletJob[];
  isDept: boolean;
  onJobChange: (jobIndex: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onPartChange: (jobIndex: number, partIndex: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onPartFieldChange: (jobIndex: number, partIndex: number, fieldName: keyof BookletPart, value: string) => void;
  onAddPart: (jobIndex: number) => void;
  onRemovePart: (jobIndex: number, partIndex: number) => void;
}

const BookletForm: React.FC<Props> = ({
  jobs,
  isDept,
  onJobChange,
  onPartChange,
  onPartFieldChange,
  onAddPart,
  onRemovePart,
}) => {
  return (
    <>
      <div className="section-title">冊子項目</div>
      {jobs.map((job, jobIndex) => (
        <div key={job.id} className="booklet-job-box" style={{ background: '#fff', border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <div className="form-group">
            <label>冊子名稱</label>
            <input type="text" name="jobName" value={job.jobName} onChange={(e) => onJobChange(jobIndex, e)} />
          </div>

          <div className="form-row print-color-layout booklet-print-layout">
            <div className="print-color-control print-size-control">
              <span>開數</span>
              <input type="text" name="jobSheetSize" value={job.jobSheetSize} onChange={(e) => onJobChange(jobIndex, e)} placeholder="整本開數" />
            </div>
            <div className="form-group">
              <label>裝訂方式</label>
              <input type="text" name="bindingMethod" value={job.bindingMethod} onChange={(e) => onJobChange(jobIndex, e)} placeholder="騎馬釘、膠裝等" />
            </div>
          </div>
          {job.jobName.trim() !== '' && job.jobSheetSize.trim() === '' && (
            <div className="field-warning booklet-sheet-warning">沒有開數時請輸入成品公分數</div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label>總數量</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" name="quantity" value={job.quantity} onChange={(e) => onJobChange(jobIndex, e)} style={{ flex: 1 }} />
                <input type="text" name="unit" value={job.unit} onChange={(e) => onJobChange(jobIndex, e)} placeholder="單位" style={{ width: '80px' }} />
              </div>
            </div>
            <div className="form-group">
              <label>每本單價</label>
              <input type="text" name="unitPrice" value={job.unitPrice} onChange={(e) => onJobChange(jobIndex, e)} />
            </div>
          </div>

          {isDept && (
            <div className="form-group">
              <label style={{ color: '#d32f2f', fontWeight: 'bold' }}>總公司量 (必填)</label>
              <input
                type="text"
                name="hqQuantity"
                value={job.hqQuantity}
                onChange={(e) => onJobChange(jobIndex, e)}
                placeholder="請輸入總公司量"
                style={{ borderColor: !job.hqQuantity ? '#d32f2f' : '#ccc' }}
              />
            </div>
          )}

          <div className="parts-list" style={{ marginTop: '1rem' }}>
            {job.parts.map((part, partIndex) => {
              const showSheetWarning = part.partName.trim() !== '' && part.sheetSize.trim() === '';

              return (
                <div key={part.id} className="part-item-box" style={{ borderLeft: '4px solid #646cff', paddingLeft: '1rem', marginBottom: '1rem', background: '#fcfcff', padding: '0.5rem' }}>
                  <div className="item-header" style={{ marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span>結構：</span>
                      <input type="text" name="partName" value={part.partName} onChange={(e) => onPartChange(jobIndex, partIndex, e)} style={{ width: '100px' }} />
                    </div>
                    {job.parts.length > 1 && <button className="remove-btn" onClick={() => onRemovePart(jobIndex, partIndex)}>刪除結構</button>}
                  </div>

                  <div className="form-row print-color-layout booklet-print-layout">
                    <div className="print-color-control print-size-control">
                      <span>開數</span>
                      <input type="text" name="sheetSize" value={part.sheetSize} onChange={(e) => onPartChange(jobIndex, partIndex, e)} />
                    </div>
                    <PrintColorFields
                      frontColor={part.printColor ?? ''}
                      reverseColor={part.reverseColor ?? ''}
                      specialColor={part.specialColor ?? ''}
                      onColorChange={(fieldName, value) => onPartFieldChange(jobIndex, partIndex, fieldName, value)}
                    />
                  </div>
                  {showSheetWarning && <div className="field-warning booklet-sheet-warning">沒有開數時請輸入成品公分數</div>}

                  <div className="form-group">
                    <label>用紙名稱</label>
                    <input type="text" name="paperName" value={part.paperName} onChange={(e) => onPartChange(jobIndex, partIndex, e)} />
                  </div>
                  <div className="form-group">
                    <label>其他明細</label>
                    <textarea name="processingDetails" value={part.processingDetails} onChange={(e) => onPartChange(jobIndex, partIndex, e)} rows={2} />
                  </div>
                </div>
              );
            })}
            <button className="add-btn" onClick={() => onAddPart(jobIndex)}>+ 新增結構</button>
          </div>
        </div>
      ))}
    </>
  );
};

export default BookletForm;
