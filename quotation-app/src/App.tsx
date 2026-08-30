import { useState, useEffect } from 'react'
import './App.css'
import './styles/Form.css'
import './styles/Preview.css'
import QuotationForm from './components/QuotationForm'
import QuotationPreview from './components/QuotationPreview'
import Dashboard from './components/Dashboard'
import type { QuotationData } from './types'
import { createEmptyQuotation } from './domain/quotationFactory'
import { formatValidationErrors, parseQuotationData } from './domain/quotationValidation'
import { clearLocalData, setLastCompanyId, setLastSalesMobile, setLastSalesName } from './storage/localStorageRepository'

type ViewMode = 'dashboard' | 'single' | 'booklet' | 'dept';

function App() {
  const [view, setView] = useState<ViewMode>('dashboard');

  const [quotationData, setQuotationData] = useState<QuotationData>(createEmptyQuotation());

  // 強化版：檢查 URL 是否含有分享的資料
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedData = urlParams.get('import');
    
    if (sharedData) {
      try {
        // 先嘗試直接 base64 解碼，若失敗則嘗試 URL 解碼後再處理
        let decodedStr = "";
        try {
          decodedStr = decodeURIComponent(atob(sharedData));
        } catch {
          decodedStr = decodeURIComponent(atob(decodeURIComponent(sharedData)));
        }
        
        const result = parseQuotationData(JSON.parse(decodedStr) as unknown);
        if (!result.success) {
          alert(`匯入失敗：\n${formatValidationErrors(result.errors)}`);
          return;
        }

        const data = result.data;
        setQuotationData(data);
        setView(data.quotationType);
          // 使用 setTimeout 確保畫面渲染後再彈出，增加成功率
        setTimeout(() => {
          alert(`已成功匯入來自「${data.customerName}」的報價單！`);
        }, 500);
      } catch (e) {
        console.error('匯入解析失敗:', e);
        alert('匯入連結似乎已損壞，請嘗試重新分享一次。');
      } finally {
        // 清除 URL，避免成功或失敗後重新整理時重複匯入
        const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        window.history.replaceState({path: newUrl}, '', newUrl);
      }
    }
  }, []);

  // 當視圖切換時，如果類型不符則重置資料結構 (除非目前有資料)
  useEffect(() => {
    if (view !== 'dashboard' && view !== quotationData.quotationType) {
      const hasContent = quotationData.quotationType === 'single' 
        ? quotationData.items[0].jobName 
        : quotationData.bookletJobs[0].jobName;
        
      if (!hasContent) {
        setQuotationData(createEmptyQuotation(view as 'single' | 'booklet' | 'dept'));
      }
    }
  }, [view]);

  const handleReset = () => {
    if (confirm('確定要清空所有內容嗎？')) {
      setQuotationData(createEmptyQuotation(view === 'dashboard' ? 'single' : view));
    }
  };

  const handleClearLocalData = () => {
    if (confirm('確定要清除本機儲存的歷史報價、客戶與乙方資料嗎？此操作無法復原。')) {
      clearLocalData();
      window.location.reload();
    }
  };

  const handleSalesChange = (name: string, mobile: string) => {
    setQuotationData(prev => ({ ...prev, salesName: name, salesMobile: mobile }));
    setLastSalesName(name);
    setLastSalesMobile(mobile);
  };

  const handleCompanyChange = (companyId: string) => {
    setQuotationData(prev => ({ ...prev, companyId }));
    setLastCompanyId(companyId);
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
              onClearLocalData={handleClearLocalData}
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
