import React from 'react';
import type { QuotationData } from '../types';

interface Props {
  data: QuotationData;
  onChange: (data: QuotationData) => void;
}

const QuotationForm: React.FC<Props> = ({ data, onChange }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  return (
    <div className="form-container no-print">
      <h2>估價單輸入</h2>
      <div className="form-group">
        <label>客戶名稱</label>
        <input
          type="text"
          name="customerName"
          value={data.customerName}
          onChange={handleChange}
          placeholder="請輸入客戶名稱"
        />
      </div>
      <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label>聯絡人</label>
          <input
            type="text"
            name="contactPerson"
            value={data.contactPerson}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>電話</label>
          <input
            type="text"
            name="phone"
            value={data.phone}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label>行動電話</label>
          <input
            type="text"
            name="mobile"
            value={data.mobile}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>傳真</label>
          <input
            type="text"
            name="fax"
            value={data.fax}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="form-group">
        <label>印件名稱</label>
        <input
          type="text"
          name="jobName"
          value={data.jobName}
          onChange={handleChange}
          placeholder="請輸入印件名稱"
        />
      </div>
      <div className="form-group">
        <label>開數</label>
        <input
          type="text"
          name="sheetSize"
          value={data.sheetSize}
          onChange={handleChange}
          placeholder="例如：菊全、對開"
        />
      </div>
      <div className="form-group">
        <label>印色</label>
        <input
          type="text"
          name="printColor"
          value={data.printColor}
          onChange={handleChange}
          placeholder="例如：單色、4色"
        />
      </div>
      <div className="form-group">
        <label>用紙名稱</label>
        <input
          type="text"
          name="paperName"
          value={data.paperName}
          onChange={handleChange}
          placeholder="例如：100g道林"
        />
      </div>
      <div className="form-group">
        <label>加工內容</label>
        <textarea
          name="processingDetails"
          value={data.processingDetails}
          onChange={handleChange}
          placeholder="例如：上光、摺紙"
          rows={3}
        />
      </div>
      <div className="form-group">
        <label>數量</label>
        <input
          type="text"
          name="quantity"
          value={data.quantity}
          onChange={handleChange}
          placeholder="請輸入數量"
        />
      </div>
      <div className="form-group">
        <label>單價</label>
        <input
          type="text"
          name="unitPrice"
          value={data.unitPrice}
          onChange={handleChange}
          placeholder="請輸入單價"
        />
      </div>
      <div className="form-group">
        <label>其他備註</label>
        <textarea
          name="remarks"
          value={data.remarks}
          onChange={handleChange}
          placeholder="例如：含運費、急件"
          rows={2}
        />
      </div>
      <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label>付款辦法</label>
          <input
            type="text"
            name="paymentMethod"
            value={data.paymentMethod}
            onChange={handleChange}
            placeholder="例如：月結、現金"
          />
        </div>
        <div className="form-group">
          <label>交貨地點</label>
          <input
            type="text"
            name="deliveryLocation"
            value={data.deliveryLocation}
            onChange={handleChange}
          />
        </div>
      </div>
      <button className="print-button" onClick={() => window.print()}>
        列印報價單 (PDF)
      </button>
    </div>
  );
};

export default QuotationForm;
