import React from 'react';
import './Dashboard.css';

interface Props {
  salesName: string;
  salesMobile: string;
  onSalesChange: (name: string, mobile: string) => void;
  onSelectType: (type: 'single' | 'booklet' | 'dept') => void;
}

const Dashboard: React.FC<Props> = ({ salesName, salesMobile, onSalesChange, onSelectType }) => {
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>捷采印刷 報價系統</h1>
      </header>

      <section className="sales-setup-box">
        <h3>業務基本資訊設定</h3>
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
        <h3>請選擇報價單類型</h3>
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
