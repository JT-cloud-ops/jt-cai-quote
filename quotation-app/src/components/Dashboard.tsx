import React from 'react';
import './Dashboard.css';

interface Props {
  companyId: string;
  salesName: string;
  salesMobile: string;
  onCompanyChange: (id: string) => void;
  onSalesChange: (name: string, mobile: string) => void;
  onSelectType: (type: 'single' | 'booklet' | 'dept') => void;
}

const Dashboard: React.FC<Props> = ({ companyId, salesName, salesMobile, onCompanyChange, onSalesChange, onSelectType }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT') {
        e.preventDefault();
        const inputs = Array.from(e.currentTarget.querySelectorAll('input'));
        const index = inputs.indexOf(target as HTMLInputElement);
        if (index > -1 && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      }
    }
  };

  return (
    <div className="dashboard-container" onKeyDown={handleKeyDown}>
      <header className="dashboard-header">
        <h1>報價系統主選單 <small style={{ fontSize: '0.8rem', color: '#999' }}>v1.1</small></h1>
      </header>

      <section className="company-selection-box">
        <h3>1. 選擇報價公司</h3>
        <div className="company-grid">
          <button className={`comp-btn ${companyId === 'jie-cai' ? 'active' : ''}`} onClick={() => onCompanyChange('jie-cai')}>捷采印刷</button>
          <button className={`comp-btn ${companyId === 'cai-xin' ? 'active' : ''}`} onClick={() => onCompanyChange('cai-xin')}>彩鑫印刷</button>
          <button className={`comp-btn ${companyId === 'health' ? 'active' : ''}`} onClick={() => onCompanyChange('health')}>赫爾思科技</button>
          <button className={`comp-btn ${companyId === 'li-xin' ? 'active' : ''}`} onClick={() => onCompanyChange('li-xin')}>栗鑫實業</button>
        </div>
      </section>

      <section className="sales-setup-box">
        <h3>2. 業務基本資訊設定</h3>
        <div className="sales-form">
          <div className="input-group">
            <label>業務人員</label>
            <input 
              type="text" 
              value={salesName} 
              onChange={(e) => onSalesChange(e.target.value, salesMobile)}
              placeholder="請輸入姓名"
            />
          </div>
          <div className="input-group">
            <label>行動電話</label>
            <input 
              type="text" 
              value={salesMobile} 
              onChange={(e) => onSalesChange(salesName, e.target.value)}
              placeholder="請輸入電話"
            />
          </div>
        </div>
        <p className="hint">* 此資訊將自動帶入各類報價單中</p>
      </section>

      <section className="type-selection">
        <h3>3. 選擇報價單類型並開始</h3>
        <div className="button-grid">
          <button className="type-btn single" onClick={() => onSelectType('single')}>
            <span className="btn-icon">📄</span>
            <span className="btn-text">單張類報價</span>
          </button>
          <button className="type-btn booklet" onClick={() => onSelectType('booklet')}>
            <span className="btn-icon">📘</span>
            <span className="btn-text">冊子類報價</span>
          </button>
          <button className="type-btn dept" onClick={() => onSelectType('dept')}>
            <span className="btn-icon">🏪</span>
            <span className="btn-text">百貨類報價</span>
          </button>
        </div>
      </section>
      
      <footer className="dashboard-footer">
        <p>捷采印刷事業(股)公司 © 2026</p>
      </footer>
    </div>
  );
};

export default Dashboard;
