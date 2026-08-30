import React from 'react';
import type { SavedQuotation } from '../storage/localStorageRepository';

interface Props { history: SavedQuotation[]; onLoad: (item: SavedQuotation) => void; onDelete: (event: React.MouseEvent, id: string) => void; }

const HistoryPanel: React.FC<Props> = ({ history, onLoad, onDelete }) => (
  <div className="history-panel">
    <h3>最近儲存的報價單</h3>
    {history.length === 0 ? <p className="no-history">尚無紀錄</p> : (
      <div className="history-list">{history.map(item => (
        <div key={item.id} className="history-item" onClick={() => onLoad(item)}>
          <div className="history-info"><div className="history-title">{item.title}</div><div className="history-time">{item.timestamp}</div></div>
          <button className="delete-history-btn" onClick={(event) => onDelete(event, item.id)}>刪除</button>
        </div>
      ))}</div>
    )}
  </div>
);

export default HistoryPanel;
