import React, { memo, useEffect, useRef, useState } from 'react';
import { Input } from 'antd';
import styles from '../FormEmbed/index.less';
import UpButton from '../Button/UpButton';
import DownButton from '../Button/DownButton';
import DeleteButton from '../Button/DeleteButton';
import { INPUT_TYPE } from '../../../../../constant';

const { TextArea } = Input;

const InputTextarea = props => {
  const { selected } = props;
  const {
    title,
    isRequired,
    labelRequired,
    description,
    messageError,
    onDelete,
    onMove,
    keyId,
    onChange,
  } = props;
  const refsTitle = useRef();
  const refsMessageError = useRef();
  const refsTextLink = useRef();
  const refsTextArea = useRef();
  const [widthInputTitle, setWidthInputTitle] = useState('40px');
  const [widthInputMessage, setWidthInputMessage] = useState('40px');
  const [widthInputLink, setWidthInputLink] = useState('40px');

  useEffect(() => {
    const { width } = window.getComputedStyle(refsTitle.current);
    const widthNumber = Number(width.slice(0, width.length - 2)) + 20;
    setWidthInputTitle(widthNumber + 'px');
  }, [title]);

  useEffect(() => {
    const { width } = window.getComputedStyle(refsMessageError.current);
    const widthNumber = Number(width.slice(0, width.length - 2)) + 20;
    setWidthInputMessage(widthNumber + 'px');
  }, [messageError]);

  useEffect(() => {
    const { width } = window.getComputedStyle(refsTextLink.current);
    const widthNumber = Number(width.slice(0, width.length - 2)) + 20;
    setWidthInputLink(widthNumber + 'px');
  }, [labelRequired]);

  const handleToggleSelected = e => {
    e.stopPropagation();
    if (props.onClick) {
      props.onClick(keyId);
    }
  };

  const onChangeValue = (name, value) => {
    onChange(keyId, name, value, INPUT_TYPE.policy);
  };

  const setValueForInput = e => {
    e.target.value = e.target.placeholder;
  };

  return (
    <div
      className={styles.inputComponent}
      id={selected ? 'input-select' : ''}
      style={selected ? { borderColor: '#4A6BC0' } : {}}
    >
      {selected && (
        <div className={styles.actionOverlay}>
          <div onClick={() => onMove(props.keyId, 'up')}>
            <UpButton />
          </div>
          <div onClick={() => onMove(props.keyId, 'down')}>
            <DownButton />
          </div>
          <div onClick={() => onDelete(props.keyId)}>
            <DeleteButton />
          </div>
        </div>
      )}
      <div className={styles.inputTitle}>
        <div>{/*<div />*/}</div>
        <input
          type="text"
          value={title}
          onChange={e => onChangeValue('title', e.target.value)}
          style={{ width: widthInputTitle }}
        />
        {isRequired ? (
          <div className={styles.inputTitleRequired}>必須</div>
        ) : (
          <div className={styles.notRequired}>任意</div>
        )}
      </div>
      <div className={styles.checkboxContainer}>
        <input type="checkbox" name="required" className={styles.checkbox} />
        <input
          type="text"
          value={labelRequired}
          onChange={e => onChangeValue('text_require', e.target.value)}
          style={{ width: widthInputLink }}
        />
      </div>
      <div className={styles.textareaSetting}>
        <TextArea
          placeholder={description}
          className={styles.textAreaCptNav}
          onChange={e =>
            onChange(props.keyId, 'content', e.target.value, INPUT_TYPE.policy)
          }
          onFocus={e => {
            setValueForInput(e);
          }}
          value={description}
        />
        <input
          type="text"
          value={messageError}
          onChange={e => onChangeValue('note', e.target.value)}
          style={{ width: widthInputMessage }}
        />
      </div>
      <div className={styles.widthTest} ref={refsTitle}>
        {title}
      </div>
      <div className={styles.widthTest} ref={refsMessageError}>
        {messageError}
      </div>
      <div className={styles.widthTest} ref={refsTextLink}>
        {labelRequired}
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

export default memo(InputTextarea);
