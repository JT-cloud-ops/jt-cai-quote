import React, { useState, useEffect, useRef } from 'react';
import type { QuotationData, Customer, Party, QuotationItem, BookletPart } from '../types';
import SingleSheetForm from './forms/SingleSheetForm';
import BookletForm from './forms/BookletForm';
import { normalizePartyB, normalizeQuotationData, upsertPartyBRecord } from '../domain/partyB';
import { formatValidationErrors, parseQuotationJson } from '../domain/quotationValidation';
import { useLineShare } from '../hooks/useLineShare';
import { initLiff, isLiffClient } from '../shared/utils/liff';
import HistoryPanel from './HistoryPanel';
import CustomerFields from './CustomerFields';
import PartyBFields from './PartyBFields';
import QuotationMetaFields from './QuotationMetaFields';
import QuotationActions from './QuotationActions';
import ImportExportActions from './ImportExportActions';
import { useQuotationStorage } from '../hooks/useQuotationStorage';
import { createEmptyBookletPart, createEmptyItem } from '../domain/quotationFactory';
import {
  saveCustomers,
  savePartyBRecords,
  saveQuotationHistory,
  setLastSalesMobile,
  setLastSalesName,
  type SavedQuotation,
} from '../storage/localStorageRepository';

interface Props {
  data: QuotationData;
  onChange: (data: QuotationData) => void;
  onReset: () => void;
  onClearLocalData: () => void;
}

const QuotationForm: React.FC<Props> = ({ data, onChange, onReset, onClearLocalData }) => {
  const { history, setHistory, customers, setCustomers, partyBRecords, setPartyBRecords } = useQuotationStorage();
  const [showHistory, setShowHistory] = useState(false);
  const [showCustomerList, setShowCustomerList] = useState(false);
  const [showPartyBList, setShowPartyBList] = useState(false);
  const { shareToLine, isGenerating: isGeneratingImg } = useLineShare(data);
  const customerListRef = useRef<HTMLDivElement>(null);
  const partyBListRef = useRef<HTMLDivElement>(null);

  const generateId = () => Math.random().toString(36).substring(2, 11) + Date.now().toString(36);

  useEffect(() => {

    initLiff()?.catch(() => undefined);

    const handleClickOutside = (event: MouseEvent) => {
      if (customerListRef.current && !customerListRef.current.contains(event.target as Node)) setShowCustomerList(false);
      if (partyBListRef.current && !partyBListRef.current.contains(event.target as Node)) setShowPartyBList(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
    if (name === 'salesName') setLastSalesName(value);
    if (name === 'salesMobile') setLastSalesMobile(value);
    if (name === 'customerName' && value.length > 0) setShowCustomerList(true);
  };

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [name]: value };
    onChange({ ...data, items: newItems });
  };

  const handlePartyBChange = (field: keyof Party, value: string) => {
    onChange({ ...data, partyB: { ...data.partyB, [field]: value } });
    if (field === 'name' && partyBRecords.length > 0) setShowPartyBList(true);
  };

  const handleItemFieldChange = (index: number, fieldName: keyof QuotationItem, value: string) => {
    const newItems = [...data.items];
    newItems[index] = { ...newItems[index], [fieldName]: value };
    onChange({ ...data, items: newItems });
  };

  const addItem = () => {
    onChange({ ...data, items: [...data.items, createEmptyItem()] });
  };

  const removeItem = (index: number) => {
    if (data.items.length <= 1) return;
    onChange({ ...data, items: data.items.filter((_, i) => i !== index) });
  };

  const handleBookletJobChange = (jobIndex: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const newJobs = [...data.bookletJobs];
    newJobs[jobIndex] = { ...newJobs[jobIndex], [e.target.name]: e.target.value };
    onChange({ ...data, bookletJobs: newJobs });
  };

  const handleBookletPartChange = (jobIndex: number, partIndex: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const newJobs = [...data.bookletJobs];
    newJobs[jobIndex].parts[partIndex] = { ...newJobs[jobIndex].parts[partIndex], [e.target.name]: e.target.value };
    onChange({ ...data, bookletJobs: newJobs });
  };

  const handleBookletPartFieldChange = (jobIndex: number, partIndex: number, fieldName: keyof BookletPart, value: string) => {
    const newJobs = [...data.bookletJobs];
    newJobs[jobIndex].parts[partIndex] = { ...newJobs[jobIndex].parts[partIndex], [fieldName]: value };
    onChange({ ...data, bookletJobs: newJobs });
  };

  const addBookletPart = (jobIndex: number) => {
    const newJobs = [...data.bookletJobs];
    newJobs[jobIndex].parts.push(createEmptyBookletPart(''));
    onChange({ ...data, bookletJobs: newJobs });
  };

  const removeBookletPart = (jobIndex: number, partIndex: number) => {
    const newJobs = [...data.bookletJobs];
    if (newJobs[jobIndex].parts.length <= 1) return;
    newJobs[jobIndex].parts = newJobs[jobIndex].parts.filter((_, i) => i !== partIndex);
    onChange({ ...data, bookletJobs: newJobs });
  };

  const updateCustomerDatabase = (newData: QuotationData) => {
    if (!newData.customerName) return;
    const newCustomer: Customer = { name: newData.customerName, contactPerson: newData.contactPerson, phone: newData.phone, mobile: newData.mobile, fax: newData.fax, deliveryLocation: newData.deliveryLocation };
    const newCustomers = [...customers];
    const idx = newCustomers.findIndex(c => c.name === newCustomer.name);
    if (idx >= 0) newCustomers[idx] = newCustomer; else newCustomers.unshift(newCustomer);
    setCustomers(newCustomers);
    saveCustomers(newCustomers);
  };

  const updatePartyBDatabase = (newData: QuotationData) => {
    if (!newData.partyB.name.trim()) return;
    const newRecords = upsertPartyBRecord(partyBRecords, newData.partyB);
    setPartyBRecords(newRecords);
    savePartyBRecords(newRecords);
  };

  const handleExport = (askName = true) => {
    const customer = data.customerName || '未命名客戶';
    const firstJob = data.quotationType === 'single' ? data.items[0]?.jobName : data.bookletJobs[0]?.jobName;
    const defaultName = `報價資料_${customer}_${firstJob || '報價單'}`;
    
    let fileName = `${defaultName}.json`;
    if (askName) {
      const customName = prompt("請輸入 JSON 備份檔名稱：", defaultName);
      if (customName === null) return null;
      fileName = `${customName}.json`;
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = fileName; link.click();
    URL.revokeObjectURL(url);
    return fileName;
  };

  /* shareToLine is provided by useLineShare. */
  /*
    const previewElement = document.querySelector('.preview-container') as HTMLElement;
    
    if (!previewElement) {
      alert("找不到預覽畫面，無法轉圖。");
      return;
    }

    setIsGeneratingImg(true);
    try {
      // 使用 html2canvas 將預覽畫面轉為圖片
      const canvas = await html2canvas(previewElement, {
        scale: 2, // 提高解析度
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 0.8);
      const customer = data.customerName || '未命名客戶';
      const firstJob = data.quotationType === 'single' ? data.items[0]?.jobName : data.bookletJobs[0]?.jobName;
      const fileName = `報價單_${customer}_${firstJob}.jpg`;

      // 檢查是否支援 Web Share API (大部分手機瀏覽器支援)
      if (navigator.share && navigator.canShare) {
        const blob = await (await fetch(imgData)).blob();
        const file = new File([blob], fileName, { type: 'image/jpeg' });
        
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: '報價單圖檔',
            text: buildQuotationShareMessage(customer, firstJob || '')
          });
          setIsGeneratingImg(false);
          return;
        }
      }

      // 如果不支援自動分享，則顯示圖片讓使用者手動儲存
      const newWindow = window.open();
      if (newWindow) {
        newWindow.document.write(`<img src="${imgData}" style="width:100%" />`);
        newWindow.document.write(`<p style="text-align:center; font-size:1.5rem;">請長按圖片進行分享或儲存</p>`);
      } else {
        alert("請允許彈出視窗以查看產生的報價單圖檔。");
      }

    } catch (err) {
      console.error("Image generation error:", err);
      alert("圖檔產生失敗，請再試一次。");
    }
    setIsGeneratingImg(false);
  */

  const validateForm = () => {
    if (!data.customerName || data.customerName.trim().length < 4) {
      alert('客戶名稱必須至少輸入 4 個字。');
      return false;
    }
    if (data.quotationType === 'dept' && data.bookletJobs.some(j => !j.hqQuantity || !j.hqQuantity.trim())) {
      alert('百貨類報價必須輸入「總公司量」，請填寫後再繼續。');
      return false;
    }
    return true;
  };

  const saveToHistory = (silent = false) => {
    if (!validateForm()) return;
    const firstJob = data.quotationType === 'single' ? data.items[0]?.jobName : data.bookletJobs[0]?.jobName;
    if (!data.customerName && !firstJob) { if(!silent) alert('請至少輸入客戶名稱或印件名稱再儲存'); return; }
    
    const newSaved: SavedQuotation = { id: generateId(), timestamp: new Date().toLocaleString(), title: `${data.customerName || '未命名客戶'} - ${firstJob || '未命名印件'}`, data: { ...data } };
    const newHistory = [newSaved, ...history];
    setHistory(newHistory.slice(0, 20)); saveQuotationHistory(newHistory);
    updateCustomerDatabase(data);
    updatePartyBDatabase(data);
    
    if (!silent) {
      handleExport();
      alert('已加入歷史紀錄並準備下載備份。');
    }
  };

  const handlePrint = () => {
    if (!validateForm()) return;
    
    // 同時執行儲存功能 (靜默模式儲存至歷史，但下載檔案時詢問檔名)
    saveToHistory(true);
    handleExport(true); 

    if (isLiffClient()) {
      alert("LINE 內部瀏覽器不支援直接列印。\n\n系統已為您自動儲存紀錄並準備下載 JSON 備份。\n請點擊右上角 [...] 並選擇「在預設瀏覽器開啟」即可列印 PDF。");
    } else {
      window.print();
    }
  };

  const selectCustomer = (c: Customer) => {
    onChange({ ...data, customerName: c.name, contactPerson: c.contactPerson, phone: c.phone, mobile: c.mobile, fax: c.fax, deliveryLocation: c.deliveryLocation });
    setShowCustomerList(false);
  };

  const selectPartyB = (partyB: Party) => {
    onChange({ ...data, partyB: normalizePartyB(partyB) });
    setShowPartyBList(false);
  };

  const loadHistory = (saved: SavedQuotation) => {
    if (confirm(`確定要載入「${saved.title}」嗎？這會覆蓋目前輸入的內容。`)) { onChange(normalizeQuotationData(saved.data)); setShowHistory(false); }
  };

  const deleteHistory = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm('確定要刪除這筆紀錄嗎？')) {
      const newHistory = history.filter(item => item.id !== id);
      setHistory(newHistory); saveQuotationHistory(newHistory);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = parseQuotationJson(typeof event.target?.result === 'string' ? event.target.result : '');
      if (result.success) {
        onChange(result.data);
        alert('匯入成功！');
      } else {
        alert(`匯入失敗：\n${formatValidationErrors(result.errors)}`);
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      if (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLButtonElement) return;
      e.preventDefault();
      const form = e.currentTarget;
      const elements = Array.from(form.querySelectorAll<HTMLElement>('input:not([type="hidden"]):not([style*="display: none"]), select, textarea, button.add-btn'));
      const index = elements.indexOf(e.target as HTMLElement);
      if (index > -1 && index < elements.length - 1) elements[index + 1].focus();
    }
  };

  return (
    <div className="form-container no-print" onKeyDown={handleKeyDown}>
      <div className="form-header">
        <h2>{data.quotationType === 'single' ? '單張類' : data.quotationType === 'booklet' ? '冊子類' : '百貨類'}報價輸入</h2>
        <div className="header-actions">
          <button className="history-toggle-btn" onClick={() => setShowHistory(!showHistory)}>{showHistory ? '關閉紀錄' : '歷史紀錄'}</button>
          <ImportExportActions onImport={handleImport} onExport={() => handleExport()} />
          <button className="reset-btn" onClick={onReset}>清空</button>
          <button className="reset-btn" onClick={onClearLocalData}>清除本機資料</button>
        </div>
      </div>

      {showHistory && <HistoryPanel history={history} onLoad={loadHistory} onDelete={deleteHistory} />}
      
      <div className="section-title">基本資訊</div>
      <QuotationMetaFields data={data} onChange={handleChange} />
      {/*
      <div className="form-row">
        <div className="form-group"><label>業務人員 (自動記憶)</label><input type="text" name="salesName" value={data.salesName} onChange={handleChange} /></div>
        <div className="form-group"><label>業務電話 (自動記憶)</label><input type="text" name="salesMobile" value={data.salesMobile} onChange={handleChange} /></div>
      </div> */}
      
      <CustomerFields data={data} customers={customers} listRef={customerListRef} showList={showCustomerList} onChange={handleChange} onFocus={() => customers.length > 0 && setShowCustomerList(true)} onSelect={selectCustomer} />
      <PartyBFields partyB={data.partyB} records={partyBRecords} listRef={partyBListRef} showList={showPartyBList} onChange={handlePartyBChange} onFocus={() => partyBRecords.length > 0 && setShowPartyBList(true)} onSelect={selectPartyB} />
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

      {data.quotationType === 'single' ? (
        <SingleSheetForm
          items={data.items}
          onChange={handleItemChange}
          onFieldChange={handleItemFieldChange}
          onAdd={addItem}
          onRemove={removeItem}
        />
      ) : (
        <BookletForm
          jobs={data.bookletJobs}
          isDept={data.quotationType === 'dept'}
          onJobChange={handleBookletJobChange}
          onPartChange={handleBookletPartChange}
          onPartFieldChange={handleBookletPartFieldChange}
          onAddPart={addBookletPart}
          onRemovePart={removeBookletPart}
        />
      )}

      {/* <div className="section-title">其他條款</div>
      <div className="form-group"><label>其他備註</label><textarea name="remarks" value={data.remarks} onChange={handleChange} rows={2} /></div>
      <div className="form-row">
        <div className="form-group"><label>付款辦法</label><input type="text" name="paymentMethod" value={data.paymentMethod} onChange={handleChange} /></div>
        <div className="form-group"><label>交貨地點</label><input type="text" name="deliveryLocation" value={data.deliveryLocation} onChange={handleChange} /></div>
      </div> */}

      <QuotationActions onSave={() => saveToHistory()} onShare={shareToLine} onPrint={handlePrint} isGenerating={isGeneratingImg} />
    </div>
  );
};

export default QuotationForm;
