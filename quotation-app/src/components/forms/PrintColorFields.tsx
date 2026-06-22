import React from 'react';
import { NO_PRINT_VALUE, PRINT_COLOR_OPTIONS } from '../../shared/utils/printColor';

interface Props {
  frontColor: string;
  reverseColor: string;
  specialColor: string;
  onColorChange: (fieldName: 'printColor' | 'reverseColor' | 'specialColor', value: string) => void;
}

const PrintColorFields: React.FC<Props> = ({ frontColor, reverseColor, specialColor, onColorChange }) => {
  return (
    <>
      <label className="print-color-control">
        <span>印色(正)</span>
        <select
          name="printColor"
          value={frontColor}
          onChange={(e) => onColorChange('printColor', e.target.value)}
        >
          {PRINT_COLOR_OPTIONS.map((option) => (
            <option key={option || 'blank'} value={option}>
              {option}
            </option>
          ))}
          <option value={NO_PRINT_VALUE}>{NO_PRINT_VALUE}</option>
        </select>
      </label>

      <label className="print-color-control">
        <span>印色(反)</span>
        <select
          name="reverseColor"
          value={reverseColor}
          onChange={(e) => onColorChange('reverseColor', e.target.value)}
        >
          {PRINT_COLOR_OPTIONS.map((option) => (
            <option key={option || 'blank'} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <label className="print-color-control">
        <span>特別色</span>
        <input
          type="text"
          name="specialColor"
          value={specialColor}
          onChange={(e) => onColorChange('specialColor', e.target.value)}
          placeholder="請輸入"
        />
      </label>
    </>
  );
};

export default PrintColorFields;
