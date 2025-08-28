import React, { useState } from 'react';
import styles from './index.less';

const ColorPicker = ({ valColor, onChangeColor }) => {
  const listColor = [
    [
      '#ffffff',
      '#DCE2E6',
      '#C4C9CC',
      '#ABB0B3',
      '#919699',
      '#646567',
      '#3C3C3C',
      '#000000',
    ],
    [
      '#A44135',
      '#73634F',
      '#80774D',
      '#468C51',
      '#3F807F',
      '#37618B',
      '#5E4E80',
      '#7F4C67',
    ],
    [
      '#E6A098',
      '#E79440',
      '#FCE17E',
      '#A8CC5C',
      // '#6AB3B2',
      '#33c3c7',
      '#31BBFE',
      '#9A7DB1',
      '#B36A90',
    ],
    [
      '#E7D0CE',
      '#E5D5C3',
      '#E7E0C3',
      '#DAE6C3',
      '#C4E6E8',
      '#C1E2F2',
      '#D4C3E2',
      '#E6B8CF',
    ],
  ];
  const [colorSearch, setColorSearch] = useState('');
  const [showError, setShowError] = useState(false);
  // test code color available
  const onSearchColor = e => {
    if (e.key === 'Enter' && colorSearch) {
      const colorTest = '#' + colorSearch;
      e.preventDefault(); // Ensure it is only this code that runs
      if (CSS.supports('color', colorTest)) {
        onChangeColor(colorTest);
        setShowError(false);
      } else {
        setShowError(true);
        // 入力されたカラーコードに誤りがあります。正しいカラーコードをご入力ください。
      }
    }
  };

  return (
    <>
      <div className={styles.colorPicker}>
        {listColor.map((item, index) => {
          return (
            <div key={index} className={styles.rowColor}>
              {item.map((itemChild, indexChild) => (
                <div
                  key={indexChild}
                  onClick={() => onChangeColor(itemChild)}
                  style={{ background: itemChild }}
                  className={`${styles.colorItem} ${
                    valColor === itemChild ? styles.active : ''
                  }`}
                />
              ))}
            </div>
          );
        })}
      </div>
      <div>
        <div className={styles.searchColor}>
          <div>
            <span>カラーコード入力：#</span>
          </div>
          <input
            type="text"
            value={colorSearch}
            onChange={e => {
              const { value } = e.target;
              setColorSearch(value);
              if (!value) {
                setShowError(false);
              }
            }}
            onKeyPress={onSearchColor}
          />
        </div>
        <div>
          {showError && (
            <span className={styles.errorColor}>
              入力されたカラーコードに誤りがあります。正しいカラーコードをご入力ください。
            </span>
          )}
        </div>
      </div>
    </>
  );
};

export default ColorPicker;
