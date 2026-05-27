import { useState, useEffect } from 'react'
import './App.css'
import './styles/Form.css'
import './styles/Preview.css'
import QuotationForm from './components/QuotationForm'
import QuotationPreview from './components/QuotationPreview'
import Dashboard from './components/Dashboard'
import type { QuotationData, QuotationItem, BookletJob, BookletPart } from './types'

type ViewMode = 'dashboard' | 'single' | 'booklet' | 'dept';

function App() {
  const [view, setView] = useState<ViewMode>('dashboard');

  const generateId = () => {
    return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
  };

  const createEmptyItem = (): QuotationItem => ({
    id: generateId(),
    jobName: '',
    sheetSize: '',
    printColor: '',
    specialColor: '',
    paperName: '',
    processingDetails: '',
    quantity: '',
    unit: '份',
    unitPrice: '',
    taxType: 'exclude',
    manualAmount: '',
  });

  const createEmptyBookletPart = (name: string): BookletPart => ({
    id: generateId(),
    partName: name,
    sheetSize: '',
    printColor: '',
    specialColor: '',
    paperName: '',
    processingDetails: '',
  });

  const createEmptyBookletJob = (): BookletJob => ({
    id: generateId(),
    jobName: '',
    jobSheetSize: '',
    bindingMethod: '',
    quantity: '',
    unit: '本',
    unitPrice: '',
    hqQuantity: '',
    parts: [
      createEmptyBookletPart('封面'),
      createEmptyBookletPart('扉頁'),
      createEmptyBookletPart('內頁'),
    ],
  });

  const getInitialData = (type: 'single' | 'booklet' | 'dept' = 'single'): QuotationData => ({
    companyId: localStorage.getItem('lastCompanyId') || 'jie-cai',
    quotationType: type,
    customerName: '',
    contactPerson: '',
    phone: '',
    mobile: '',
    fax: '',
    items: type === 'single' ? [createEmptyItem()] : [],
    bookletJobs: (type === 'booklet' || type === 'dept') ? [createEmptyBookletJob()] : [],
    remarks: '',
    orderYear: '',
    orderMonth: '',
    orderDay: '',
    paymentMethod: '',
    deliveryYear: '',
    deliveryMonth: '',
    deliveryDay: '',
    deliveryLocation: '',
    salesName: localStorage.getItem('lastSalesName') || '',
    salesMobile: localStorage.getItem('lastSalesMobile') || '',
  });

  const [quotationData, setQuotationData] = useState<QuotationData>(getInitialData());

  // 檢查 URL 是否含有分享的資料
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('import');
    
    if (sharedData) {
      try {
        // 解碼 Base64 資料 (使用 decodeURIComponent 處理多國語言)
        const jsonStr = decodeURIComponent(atob(sharedData));
        const data = JSON.parse(jsonStr);
        if (data && data.quotationType) {
          setQuotationData(data);
          setView(data.quotationType);
          // 清除 URL，避免重新整理時重複匯入提示
          window.history.replaceState({}, document.title, window.location.pathname);
          alert('已成功匯入分享的報價單資料！');
        }
      } catch (e) {
        console.error('Import Error:', e);
      }
    }
  }, []);

  // 當視圖切換時，如果類型不符則重置資料結構 (除非目前有資料)
  useEffect(() => {
    if (view !== 'dashboard' && view !== quotationData.quotationType) {
      // 如果目前的 Job 名稱為空，才自動切換結構，避免覆蓋剛匯入的資料
      const hasContent = quotationData.quotationType === 'single' 
        ? quotationData.items[0].jobName 
        : quotationData.bookletJobs[0].jobName;
        
      if (!hasContent) {
        setQuotationData(getInitialData(view as any));
      }
    }
  }, [view]);

  const handleReset = () => {
    if (confirm('確定要清空所有內容嗎？')) {
      setQuotationData(getInitialData(view === 'dashboard' ? 'single' : (view as any)));
    }
  };

  const handleSalesChange = (name: string, mobile: string) => {
    setQuotationData(prev => ({ ...prev, salesName: name, salesMobile: mobile }));
    localStorage.setItem('lastSalesName', name);
    localStorage.setItem('lastSalesMobile', mobile);
  };

  const handleCompanyChange = (companyId: string) => {
    setQuotationData(prev => ({ ...prev, companyId }));
    localStorage.setItem('lastCompanyId', companyId);
  };

  const backToDashboard = () => setView('dashboard');

  return (
    <div className="app-wrapper">
      {view === 'dashboard' ? (
        <Dashboard 
          companyId={quotationData.companyId}
          salesName={quotationData.salesName}
          salesMobile={quotationData.salesMobile}
          onCompanyChange={handleCompanyChange}
          onSalesChange={handleSalesChange}
          onSelectType={(type) => setView(type)}
        />
      ) : (
        <div className="workspace-container">
          <div className="view-header no-print" style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <button 
              onClick={backToDashboard}
              style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderRadius: '4px', border: '1px solid #ccc' }}
            >
              ← 返回主選單
            </button>
            <span style={{ marginLeft: '1rem', fontWeight: 'bold', color: '#666' }}>
              正在使用：{view === 'single' ? '單張類報價' : view === 'booklet' ? '冊子類報價' : '百貨類報價'}
            </span>
          </div>
          
          <div className="app-container quotation-layout">
            <QuotationForm 
              data={quotationData} 
              onChange={setQuotationData} 
              onReset={handleReset}
            />
            <div className="preview-wrapper" style={{ overflowX: 'auto' }}>
              <QuotationPreview 
                data={quotationData} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
