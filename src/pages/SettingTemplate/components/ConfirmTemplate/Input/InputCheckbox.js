import React, { useEffect, useRef, useState } from 'react';
import UpButton from '../Button/UpButton';
import DownButton from '../Button/DownButton';
import DeleteButton from '../Button/DeleteButton';
import styles from '../FormEmbed/index.less';
import { INPUT_TYPE } from '../../../../../constant';
import { useDispatch } from 'umi';

const InputCheckbox = ({
  onMove,
  onClick,
  onChange,
  selected,
  keyId,
  onDelete,
  editInput,
  title,
  isRequired,
  listOption,
  subtitle,
}) => {
  const refs = useRef();
  const [widthInput, setWidthInput] = useState('40px');

  useEffect(() => {
    const { width } = window.getComputedStyle(refs.current);
    const widthNumber = Number(width.slice(0, width.length - 2)) + 20;
    setWidthInput(widthNumber + 'px');
  }, [title]);

  const handleToggleSelected = e => {
    e.stopPropagation();
    if (onClick) {
      onClick(keyId);
    }
  };
  const dispatch = useDispatch();

  const onChangeTitleCheckBox = e => {
    const { name, value } = e.target;
    const listOptionNew = listOption.map(item => {
      if (item.key_id == name) {
        item.content_name = value;
      }
      return item;
    });
    dispatch({
      type: 'SETTING_TEMPLATE/onChangeTitleCheckbox',
      payload: {
        keyId,
        keyName: 'contents',
        value: listOptionNew,
      },
    });
  };

  const onChangeValue = (name, value) => {
    onChange(keyId, name, value, INPUT_TYPE.checkbox);
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
            <div
              onClick={e => {
                e.stopPropagation();
                onMove(keyId, 'up');
              }}
            >
              <UpButton />
            </div>
            <div
              onClick={e => {
                e.stopPropagation();
                onMove(keyId, 'down');
              }}
            >
              <DownButton />
            </div>
            <div
              onClick={e => {
                e.stopPropagation();
                onDelete(keyId);
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
          onChange={e => onChangeValue('question_name', e.target.value)}
          style={{ width: widthInput }}
        />
        {isRequired ? (
          <div className={styles.inputTitleRequired}>必須</div>
        ) : (
          <div className={styles.notRequired}>任意</div>
        )}
      </div>
      <div className={styles.listOption}>
        {listOption?.length ? (
          listOption.map((op, index) => (
            <React.Fragment key={index}>
              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  name="required"
                  className={styles.checkbox}
                />
                <input
                  type="text"
                  name={op.key_id}
                  value={
                    op.content_name ||
                    (op.default && op.index === 1
                      ? '例）営業職'
                      : '例）エンジニア職')
                  }
                  onChange={onChangeTitleCheckBox}
                />
              </div>
            </React.Fragment>
          ))
        ) : (
          <> </>
        )}
      </div>
      <div className={styles.subtitle}>
        <textarea
          placeholder={`例）ご利用目的をご選択ください。${'\n'}※複数選択可`}
          value={subtitle}
          onChange={e => onChangeValue('placeholder', e.target.value)}
        />
      </div>
      <div className={styles.widthTest} ref={refs}>
        {title}
      </div>
      {!selected && (
        <div className={styles.overlay}>
          <div className={styles.overlayMessage} onClick={handleToggleSelected}>
            <div>クリックして編集</div>
            <div>または右上のアイコンから、順番の入れ替えや削除ができます</div>
          </div>
        </div>
      )}
    </div>
  );
};
export default InputCheckbox;
