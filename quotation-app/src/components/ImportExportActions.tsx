import React from 'react';
interface Props { onImport: (event: React.ChangeEvent<HTMLInputElement>) => void; onExport: () => void; }
const ImportExportActions: React.FC<Props> = ({ onImport, onExport }) => <>
  <label className="import-btn">匯入<input type="file" accept=".json" onChange={onImport} style={{ display: 'none' }} /></label>
  <button className="export-btn" onClick={onExport}>匯出</button>
</>;
export default ImportExportActions;
