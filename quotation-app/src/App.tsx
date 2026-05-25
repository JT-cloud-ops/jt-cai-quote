import { useState } from 'react'
import './App.css'
import './styles/Form.css'
import './styles/Preview.css'
import QuotationForm from './components/QuotationForm'
import QuotationPreview from './components/QuotationPreview'
import type { QuotationData, QuotationItem } from './types'

function App() {
  // 建立隨機 ID 的替代方案（確保在非 HTTPS 環境也能運作）
  const generateId = () => {
    return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
  };

  const createEmptyItem = (): QuotationItem => ({
    id: generateId(),
    jobName: '',
    sheetSize: '',
    printColor: '',
    paperName: '',
    processingDetails: '',
    quantity: '',
    unit: '份',
    unitPrice: '',
  });

  const getInitialData = (): QuotationData => ({
    customerName: '',
    contactPerson: '',
    phone: '',
    mobile: '',
    fax: '',
    items: [createEmptyItem()],
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

  const handleReset = () => {
    setQuotationData(getInitialData());
  };

  return (
    <div className="app-container">
      <QuotationForm 
        data={quotationData} 
        onChange={setQuotationData} 
        onReset={handleReset}
      />
      <QuotationPreview 
        data={quotationData} 
      />
    </div>
  )
}

export default App
