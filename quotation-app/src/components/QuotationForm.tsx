import React, { useState, useEffect, useRef } from 'react';
import type { QuotationData, QuotationItem, Customer, BookletJob, BookletPart } from '../types';

interface Props {
  data: QuotationData;
  onChange: (data: QuotationData) => void;
  onReset: () => void;
}

interface SavedQuotation {
  id: string;
  timestamp: string;
  title: string;
  data: QuotationData;
}

const QuotationForm: React.FC<Props> = ({ data, onChange, onReset }) => {
  const [history, setHistory] = useState<SavedQuotation[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showCustomerList, setShowCustomerList] = useState(false);
  const customerListRef = useRef<HTMLDivElement>(null);

  // 建立隨機 ID
  const generateId = () => {
    return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
  };

  useEffect(() => {
    const savedHistory = localStorage.getItem('quotationHistory');
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) { console.error(e); }
    }
    const savedCustomers = localStorage.getItem('customerDatabase');
    if (savedCustomers) {
      try { setCustomers(JSON.parse(savedCustomers)); } catch (e) { console.error(e); }
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (customerListRef.current && !customerListRef.current.contains(event.target as Node)) {
        setShowCustomerList(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
    
    if (name === 'salesName') localStorage.setItem('lastSalesName', value);
    if (name === 'salesMobile') localStorage.setItem('lastSalesMobile', value);
    if (name === 'customerName' && value.length > 0) setShowCustomerList(true);
  };

  // --- 單張類處理邏輯 ---
  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [name]: value };
    onChange({ ...data, items: newItems });
  };

  const addItem = () => {
    const newItem: QuotationItem = {
      id: generateId(),
      jobName: '',
      sheetSize: '',
      printColor: '',
      paperName: '',
      processingDetails: '',
      quantity: '',
      unit: '份',
      unitPrice: '',
    };
    onChange({ ...data, items: [...data.items, newItem] });
  };

  const removeItem = (index: number) => {
    if (data.items.length <= 1) return;
    const newItems = data.items.filter((_, i) => i !== index);
    onChange({ ...data, items: newItems });
  };

  // --- 冊子類處理邏輯 ---
  const handleBookletJobChange = (jobIndex: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newJobs = [...data.bookletJobs];
    newJobs[jobIndex] = { ...newJobs[jobIndex], [name]: value };
    onChange({ ...data, bookletJobs: newJobs });
  };

  const handleBookletPartChange = (jobIndex: number, partIndex: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newJobs = [...data.bookletJobs];
    const newParts = [...newJobs[jobIndex].parts];
    newParts[partIndex] = { ...newParts[partIndex], [name]: value };
    newJobs[jobIndex] = { ...newJobs[jobIndex], parts: newParts };
    onChange({ ...data, bookletJobs: newJobs });
  };

  const addBookletPart = (jobIndex: number) => {
    const newJobs = [...data.bookletJobs];
    const newPart: BookletPart = {
      id: generateId(),
      partName: '',
      sheetSize: '',
      printColor: '',
      paperName: '',
      processingDetails: '',
    };
    newJobs[jobIndex].parts.push(newPart);
    onChange({ ...data, bookletJobs: newJobs });
  };

  const removeBookletPart = (jobIndex: number, partIndex: number) => {
    const newJobs = [...data.bookletJobs];
    if (newJobs[jobIndex].parts.length <= 1) return;
    newJobs[jobIndex].parts = newJobs[jobIndex].parts.filter((_, i) => i !== partIndex);
    onChange({ ...data, bookletJobs: newJobs });
  };

  // --- 通用存取邏輯 ---
  const updateCustomerDatabase = (newData: QuotationData) => {
    if (!newData.customerName) return;
    const newCustomer: Customer = {
      name: newData.customerName,
      contactPerson: newData.contactPerson,
      phone: newData.phone,
      mobile: newData.mobile,
      fax: newData.fax,
      deliveryLocation: newData.deliveryLocation
    };
    const existingIndex = customers.findIndex(c => c.name === newCustomer.name);
    let newCustomers = [...customers];
    if (existingIndex >= 0) newCustomers[existingIndex] = newCustomer;
    else newCustomers = [newCustomer, ...customers];
    setCustomers(newCustomers);
    localStorage.setItem('customerDatabase', JSON.stringify(newCustomers));
  };

  const handleExport = () => {
    const customer = data.customerName || '未命名客戶';
    const firstJob = data.quotationType === 'single' ? data.items[0]?.jobName : data.bookletJobs[0]?.jobName;
    const fileName = `報價資料_${customer}_${firstJob || '報價單'}.json`;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  const saveToHistory = () => {
    const firstJob = data.quotationType === 'single' ? data.items[0]?.jobName : data.bookletJobs[0]?.jobName;
    if (!data.customerName && !firstJob) {
      alert('請至少輸入客戶名稱或印件名稱再儲存');
      return;
    }
    const newSaved: SavedQuotation = {
      id: generateId(),
      timestamp: new Date().toLocaleString(),
      title: `${data.customerName || '未命名客戶'} - ${firstJob || '未命名印件'}`,
      data: { ...data }
    };
    const newHistory = [newSaved, ...history].slice(0, 20);
    setHistory(newHistory);
    localStorage.setItem('quotationHistory', JSON.stringify(newHistory));
    updateCustomerDatabase(data);
    handleExport();
    alert('儲存成功！(已儲存客戶資料、歷史紀錄並下載備份)');
  };

  const selectCustomer = (c: Customer) => {
    onChange({
      ...data,
      customerName: c.name,
      contactPerson: c.contactPerson,
      phone: c.phone,
      mobile: c.mobile,
      fax: c.fax,
      deliveryLocation: c.deliveryLocation
    });
    setShowCustomerList(false);
  };

  const loadHistory = (saved: SavedQuotation) => {
    if (confirm(`確定要載入「${saved.title}」嗎？這會覆蓋目前輸入的內容。`)) {
      onChange(saved.data);
      setShowHistory(false);
    }
  };

  const deleteHistory = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('確定要刪除這筆紀錄嗎？')) {
      const newHistory = history.filter(item => item.id !== id);
      setHistory(newHistory);
      localStorage.setItem('quotationHistory', JSON.stringify(newHistory));
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        if (importedData) {
          onChange(importedData);
          alert('匯入成功！');
        }
      } catch (err) { alert('解析失敗'); }
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(data.customerName.toLowerCase())
  );

  return (
    <div className="form-container no-print">
      <div className="form-header">
        <h2>{data.quotationType === 'single' ? '單張類' : data.quotationType === 'booklet' ? '冊子類' : '百貨類'}報價輸入</h2>
        <div className="header-actions">
          <button className="history-toggle-btn" onClick={() => setShowHistory(!showHistory)}>{showHistory ? '關閉紀錄' : '歷史紀錄'}</button>
          <label className="import-btn">匯入<input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} /></label>
          <button className="reset-btn" onClick={onReset}>清空</button>
        </div>
      </div>

      {showHistory && (
        <div className="history-panel">
          <h3>最近儲存的報價單</h3>
          {history.length === 0 ? <p className="no-history">尚無紀錄</p> : (
            <div className="history-list">
              {history.map(item => (
                <div key={item.id} className="history-item" onClick={() => loadHistory(item)}>
                  <div className="history-info">
                    <div className="history-title">{item.title}</div>
                    <div className="history-time">{item.timestamp}</div>
                  </div>
                  <button className="delete-history-btn" onClick={(e) => deleteHistory(e, item.id)}>刪除</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
      <div className="section-title">基本資訊</div>
      <div className="form-row">
        <div className="form-group"><label>業務人員 (自動記憶)</label><input type="text" name="salesName" value={data.salesName} onChange={handleChange} /></div>
        <div className="form-group"><label>業務電話 (自動記憶)</label><input type="text" name="salesMobile" value={data.salesMobile} onChange={handleChange} /></div>
      </div>
      
      <div className="form-group" style={{ position: 'relative' }}>
        <label>客戶名稱</label>
        <input type="text" name="customerName" value={data.customerName} onChange={handleChange} onFocus={() => customers.length > 0 && setShowCustomerList(true)} autoComplete="off" />
        {showCustomerList && filteredCustomers.length > 0 && (
          <div className="customer-dropdown" ref={customerListRef}>
            {filteredCustomers.map((c, idx) => (
              <div key={idx} className="customer-option" onClick={() => selectCustomer(c)}>
                <div className="c-name">{c.name}</div>
                <div className="c-info">{c.contactPerson} | {c.phone}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="form-row">
        <div className="form-group"><label>聯絡人</label><input type="text" name="contactPerson" value={data.contactPerson} onChange={handleChange} /></div>
        <div className="form-group"><label>電話</label><input type="text" name="phone" value={data.phone} onChange={handleChange} /></div>
      </div>
      <div className="form-row">
        <div className="form-group"><label>行動電話</label><input type="text" name="mobile" value={data.mobile} onChange={handleChange} /></div>
        <div className="form-group"><label>傳真</label><input type="text" name="fax" value={data.fax} onChange={handleChange} /></div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>訂印日期</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input type="text" name="orderYear" value={data.orderYear} onChange={handleChange} style={{ width: '40px' }} /><span>/</span>
            <input type="text" name="orderMonth" value={data.orderMonth} onChange={handleChange} style={{ width: '30px' }} /><span>/</span>
            <input type="text" name="orderDay" value={data.orderDay} onChange={handleChange} style={{ width: '30px' }} />
          </div>
        </div>
        <div className="form-group">
          <label>交貨日期</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <input type="text" name="deliveryYear" value={data.deliveryYear} onChange={handleChange} style={{ width: '40px' }} /><span>/</span>
            <input type="text" name="deliveryMonth" value={data.deliveryMonth} onChange={handleChange} style={{ width: '30px' }} /><span>/</span>
            <input type="text" name="deliveryDay" value={data.deliveryDay} onChange={handleChange} style={{ width: '30px' }} />
          </div>
        </div>
      </div>

      <div className="section-title">{data.quotationType === 'booklet' ? '冊子印件資訊' : '印件品項'}</div>
      
      {/* 渲染單張類品項 */}
      {data.quotationType === 'single' && data.items.map((item, index) => (
        <div key={item.id} className="item-form-box">
          <div className="item-header"><span>項目 {index + 1}</span>{data.items.length > 1 && <button className="remove-btn" onClick={() => removeItem(index)}>刪除</button>}</div>
          <div className="form-group"><label>印件名稱</label><input type="text" name="jobName" value={item.jobName} onChange={(e) => handleItemChange(index, e)} /></div>
          <div className="form-row">
            <div className="form-group"><label>開數</label><input type="text" name="sheetSize" value={item.sheetSize} onChange={(e) => handleItemChange(index, e)} /></div>
            <div className="form-group"><label>印色</label><input type="text" name="printColor" value={item.printColor} onChange={(e) => handleItemChange(index, e)} /></div>
          </div>
          <div className="form-group"><label>用紙名稱</label><input type="text" name="paperName" value={item.paperName} onChange={(e) => handleItemChange(index, e)} /></div>
          <div className="form-group"><label>加工內容</label><textarea name="processingDetails" value={item.processingDetails} onChange={(e) => handleItemChange(index, e)} rows={2} /></div>
          <div className="form-row">
            <div className="form-group"><label>數量</label><div style={{ display: 'flex', gap: '0.5rem' }}><input type="text" name="quantity" value={item.quantity} onChange={(e) => handleItemChange(index, e)} style={{ flex: 1 }} /><select name="unit" value={item.unit} onChange={(e) => handleItemChange(index, e)} style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}><option value="份">份</option><option value="張">張</option><option value="本">本</option><option value="個">個</option></select></div></div>
            <div className="form-group"><label>單價</label><input type="text" name="unitPrice" value={item.unitPrice} onChange={(e) => handleItemChange(index, e)} /></div>
          </div>
        </div>
      ))}
      {data.quotationType === 'single' && <button className="add-btn" onClick={addItem}>+ 新增品項</button>}

      {/* 渲染冊子類品項 */}
      {data.quotationType === 'booklet' && data.bookletJobs.map((job, jobIndex) => (
        <div key={job.id} className="booklet-job-box" style={{ background: '#fff', border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <div className="form-group"><label>冊子名稱</label><input type="text" name="jobName" value={job.jobName} onChange={(e) => handleBookletJobChange(jobIndex, e)} /></div>
          <div className="form-group"><label>裝訂方法</label><input type="text" name="bindingMethod" value={job.bindingMethod} onChange={(e) => handleBookletJobChange(jobIndex, e)} placeholder="例如：無線膠裝、騎馬釘" /></div>
          <div className="form-row">
            <div className="form-group"><label>總數量</label><div style={{ display: 'flex', gap: '0.5rem' }}><input type="text" name="quantity" value={job.quantity} onChange={(e) => handleBookletJobChange(jobIndex, e)} style={{ flex: 1 }} /><select name="unit" value={job.unit} onChange={(e) => handleBookletJobChange(jobIndex, e)} style={{ padding: '0.6rem', borderRadius: '4px', border: '1px solid #ccc' }}><option value="本">本</option><option value="份">份</option></select></div></div>
            <div className="form-group"><label>每本單價</label><input type="text" name="unitPrice" value={job.unitPrice} onChange={(e) => handleBookletJobChange(jobIndex, e)} /></div>
          </div>
          
          <div className="parts-list" style={{ marginTop: '1rem' }}>
            {job.parts.map((part, partIndex) => (
              <div key={part.id} className="part-item-box" style={{ borderLeft: '4px solid #646cff', paddingLeft: '1rem', marginBottom: '1rem', background: '#fcfcff', padding: '0.5rem' }}>
                <div className="item-header" style={{ marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span>結構：</span>
                    {partIndex === 1 ? (
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <select name="partName" value={part.partName} onChange={(e) => handleBookletPartChange(jobIndex, partIndex, e)}>
                          <option value="扉頁">扉頁</option><option value="蝴蝶頁">蝴蝶頁</option><option value="自訂">自訂</option>
                        </select>
                        {part.partName === '自訂' && <input type="text" placeholder="輸入名稱" onChange={(e) => {
                          const val = e.target.value;
                          const newJobs = [...data.bookletJobs];
                          newJobs[jobIndex].parts[partIndex].partName = val;
                          onChange({ ...data, bookletJobs: newJobs });
                        }} />}
                      </div>
                    ) : (
                      <input type="text" name="partName" value={part.partName} onChange={(e) => handleBookletPartChange(jobIndex, partIndex, e)} style={{ width: '100px' }} />
                    )}
                  </div>
                  {job.parts.length > 1 && <button className="remove-btn" onClick={() => removeBookletPart(jobIndex, partIndex)}>刪除部分</button>}
                </div>
                <div className="form-row">
                  <div className="form-group"><label>開數</label><input type="text" name="sheetSize" value={part.sheetSize} onChange={(e) => handleBookletPartChange(jobIndex, partIndex, e)} /></div>
                  <div className="form-group"><label>印色</label><input type="text" name="printColor" value={part.printColor} onChange={(e) => handleBookletPartChange(jobIndex, partIndex, e)} /></div>
                </div>
                <div className="form-group"><label>用紙名稱</label><input type="text" name="paperName" value={part.paperName} onChange={(e) => handleBookletPartChange(jobIndex, partIndex, e)} /></div>
                <div className="form-group"><label>加工內容 (含頁數)</label><textarea name="processingDetails" value={part.processingDetails} onChange={(e) => handleBookletPartChange(jobIndex, partIndex, e)} rows={2} /></div>
              </div>
            ))}
            <button className="add-btn" onClick={() => addBookletPart(jobIndex)}>+ 新增結構部分</button>
          </div>
        </div>
      ))}

      <div className="section-title">其他條款</div>
      <div className="form-group"><label>其他備註</label><textarea name="remarks" value={data.remarks} onChange={handleChange} rows={2} /></div>
      <div className="form-row">
        <div className="form-group"><label>付款辦法</label><input type="text" name="paymentMethod" value={data.paymentMethod} onChange={handleChange} /></div>
        <div className="form-group"><label>交貨地點</label><input type="text" name="deliveryLocation" value={data.deliveryLocation} onChange={handleChange} /></div>
      </div>

      <div className="action-buttons">
        <button className="save-btn" onClick={saveToHistory}>儲存此報價單</button>
        <button className="print-button" onClick={() => window.print()}>列印報價單 (PDF)</button>
      </div>
    </div>
  );
};

export default QuotationForm;
