import { useState } from 'react'
import './App.css'
import './styles/Form.css'
import './styles/Preview.css'
import QuotationForm from './components/QuotationForm'
import QuotationPreview from './components/QuotationPreview'
import type { QuotationData } from './types'

function App() {
  const [quotationData, setQuotationData] = useState<QuotationData>({
    customerName: '',
    contactPerson: '',
    phone: '',
    mobile: '',
    fax: '',
    jobName: '',
    sheetSize: '',
    printColor: '',
    paperName: '',
    processingDetails: '',
    quantity: '',
    unitPrice: '',
    remarks: '',
    orderDate: '',
    paymentMethod: '',
    deliveryDate: '',
    deliveryLocation: '',
  });

  return (
    <div className="app-container">
      <QuotationForm 
        data={quotationData} 
        onChange={setQuotationData} 
      />
      <QuotationPreview 
        data={quotationData} 
      />
    </div>
  )
}

export default App
