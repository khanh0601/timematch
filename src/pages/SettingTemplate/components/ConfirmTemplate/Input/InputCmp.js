import React, { useState, memo, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from '../FormEmbed/index.less';
import UpButton from '../Button/UpButton';
import DownButton from '../Button/DownButton';
import DeleteButton from '../Button/DeleteButton';

import { Input } from 'antd';
import { notify } from '../../../../../commons/function';
import { useDispatch } from 'umi';
import login from '../../../../Login';
import { INPUT_TYPE } from '../../../../../constant';

function InputCmp({
  title,
  editInput,
  isRequired,
  placeholder,
  selected,
  keyId,
  onClick,
  onChange,
  onDelete,
  onMove,
}) {
  const handleToggleSelected = e => {
    e.stopPropagation();
    if (onClick) {
      onClick(keyId);
    }
  };
  const refs = useRef();
  const [widthInput, setWidthInput] = useState('40px');

  useEffect(() => {
    const { width } = window.getComputedStyle(refs.current);
    const widthNumber = Number(width.slice(0, width.length - 2)) + 20;
    setWidthInput(widthNumber + 'px');
  }, [title]);

  const onChangeValue = e => {
    const { value } = e.target;
    if (title === 'メールアドレス') {
      return;
    }
    onChange(keyId, 'question_name', value, INPUT_TYPE.text);
  };

  return (
    <div
      className={styles.inputComponent}
      id={selected ? 'input-select' : ''}
      style={selected ? { borderColor: '#4A6BC0' } : {}}
    >
      {selected && (
        <>
          <div className={styles.actionOverlay}>
            <div onClick={() => onMove(keyId, 'up')}>
              <UpButton />
            </div>
            <div onClick={() => onMove(keyId, 'down')}>
              <DownButton />
            </div>
            <div
              onClick={() => {
                if (title === 'メールアドレス') {
                  notify(['メールアドレスは必須のため、削除できません。']);
                } else {
                  onDelete(keyId);
                }
              }}
            >
              <DeleteButton />
            </div>
          </div>
        </>
      )}

      <div className={styles.inputTitle}>
        <div>{/*<div />*/}</div>
        <input
          type="text"
          value={title}
          onChange={onChangeValue}
          style={{ width: widthInput }}
        />
        {isRequired ? (
          <div className={styles.inputTitleRequired}>必須</div>
        ) : (
          <div className={styles.notRequired}>任意</div>
        )}
      </div>

      <Input
        placeholder={placeholder}
        className={`${styles.input} ${editInput ? styles.inputEdit : ''}`}
        onChange={e =>
          onChange(keyId, 'placeholder', e.target.value, INPUT_TYPE.text)
        }
        value={editInput ? placeholder : undefined}
      />

      {!selected && (
        <div className={styles.overlay}>
          <div className={styles.overlayMessage} onClick={handleToggleSelected}>
            <div>クリックして編集</div>
            <div>または右上のアイコンから、順番の入れ替えや削除ができます</div>
          </div>
        </div>
      )}

      <div className={styles.widthTest} ref={refs}>
        {title}
      </div>
    </div>
  );
}

InputCmp.propTypes = {
  title: PropTypes.string,
  keyId: PropTypes.string,
  isRequired: PropTypes.bool,
  placeholder: PropTypes.string,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
};

export default memo(InputCmp);
