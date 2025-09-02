import React, { memo, useState, useEffect } from 'react';
import styles from '../index.less';
import { Button } from 'antd';
import InputNav from '../Input/InputNav';
import { connect } from 'dva';
import { DEFAULT_POLICY } from '../../../../../constant';
import { notify } from '../../../../../commons/function';

const EditTextArea = memo(props => {
  const { dispatch, questionSelect, isErrorForm } = props;
  const [title, setTitle] = useState('');
  const [textLink, setTextLink] = useState('');
  const [link, setLink] = useState('');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');
  const [required, setRequired] = useState(false);

  useEffect(() => {
    const isError =
      title.length === 0 ||
      textLink.length === 0 ||
      link.length === 0 ||
      note.length === 0 ||
      message.length === 0;
    if (isError !== props.isErrorForm) {
      dispatch({
        type: 'SETTING_TEMPLATE/updateErrorForm',
        payload: {
          value: isError,
        },
      });
    }
  }, [title, textLink, link, note, message]);

  const handleWindowClick = e => {
    if (questionSelect?.key_id) {
      const selectingEle = document.getElementById('input-select');
      const navigatorEle = document.getElementById('navigator');
      if (
        (selectingEle && selectingEle.contains(e.target)) ||
        (navigatorEle && navigatorEle.contains(e.target))
      ) {
        return;
      }
      handleSubmit();
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleWindowClick);
    return () => {
      window.removeEventListener('click', handleWindowClick);
    };
  });

  useEffect(() => {
    if (questionSelect) {
      setTitle(questionSelect.title);
      setTextLink(questionSelect.text_require);
      setLink(questionSelect.link);
      setNote(questionSelect.content);
      setMessage(questionSelect.note);
      setRequired(!!questionSelect.checkbox);
    }
  }, [questionSelect]);

  const handleChangeData = (fieldName, fieldValue) => {
    dispatch({
      type: 'SETTING_TEMPLATE/updateTitleOrPlaceholder',
      payload: {
        keyId: questionSelect.key_id,
        fieldName,
        fieldValue,
      },
    });
  };

  const handleSubmit = () => {
    if (
      title.trim() === '' ||
      textLink.trim() === '' ||
      link.trim() === '' ||
      note.trim() === '' ||
      message.trim() === ''
    ) {
      notify([
        '未入力の項目があるため、入力後に',
        '「保存」をクリックください。',
      ]);
      return;
    }

    dispatch({
      type: 'SETTING_TEMPLATE/updatePolicy',
      payload: {
        keyId: questionSelect.key_id,
        title,
        text_require: textLink,
        link,
        content: note,
        note: message,
        checkbox: required ? 1 : 0,
      },
    });
  };

  return (
    <div className={styles.editInputContainer}>
      <div className={styles.bigTitle}>下記よりカスタマイズいただけます</div>
      <div className={styles.title}>
        <span>STEP &nbsp; 1：タイトルを入力ください</span>
      </div>
      <div className={styles.inputContainer}>
        <InputNav
          placeholder="例）利用規約"
          title="①タイトル"
          value={title !== DEFAULT_POLICY.policy_title ? title : ''}
          onChange={e => {
            setTitle(e.target.value);
            handleChangeData('title', e.target.value);
          }}
        />
      </div>
      <div className={styles.inputContainer}>
        <InputNav
          placeholder="例）利用規約に同意する"
          title="②依頼内容"
          value={
            textLink !== DEFAULT_POLICY.policy_text_require ? textLink : ''
          }
          onChange={e => {
            setTextLink(e.target.value);
            handleChangeData('text_require', e.target.value);
          }}
        />
      </div>
      <div className={styles.inputContainer}>
        <InputNav
          placeholder="例）ご利用目的をご選択ください。"
          title="③説明文"
          onChange={e => {
            setMessage(e.target.value);
            handleChangeData('note', e.target.value);
          }}
          value={message || ''}
        />
      </div>

      <div className={styles.title}>
        <div className={styles.inLineTitle}>
          <b>STEP &nbsp; 2：規約内容を設定ください　</b>
          <div className={styles.smallText}> ※2つの設定方法があります</div>
        </div>
      </div>
      <div className={styles.inputContainer}>
        <InputNav
          title="設定方法1：URLで設定する"
          placeholder="例）https://info.timematch.jp/company/"
          isSecondaryTitle
          value={link || ''}
          onChange={e => {
            setLink(e.target.value);
            handleChangeData('link', e.target.value);
          }}
        />
      </div>
      <div className={styles.inputContainer}>
        <InputNav
          title="設定方法 2 ：直接入力で設定する"
          placeholder="例）個人情報の取扱について株式会社〇〇（以下、「当社」といいます）は、個人情報の保護に関する法律（以下、「個人情報保護法」といいます）に基づき、以下の事項を公表いたします。"
          isSecondaryTitle
          isTextArea
          value={note || ''}
          onChange={e => {
            setNote(e.target.value);
            handleChangeData('content', e.target.value);
          }}
        />
      </div>

      <div className={styles.checkboxContainer}>
        <div>
          <input
            type="checkbox"
            name="required"
            className={styles.checkbox}
            checked={required}
            onChange={e => {
              setRequired(e.target.checked);
              handleChangeData('checkbox', e.target.checked ? 1 : 0);
            }}
          />
          <span className={styles.checkboxLabel}>回答を必須にする</span>
        </div>
      </div>
      <div className={styles.inputContainer}>
        <Button className={styles.primaryBtn} onClick={handleSubmit}>
          保存{' '}
        </Button>
      </div>
    </div>
  );
});
export default connect(({ SETTING_TEMPLATE }) => ({
  questionSelect: SETTING_TEMPLATE.questionSelected,
  isErrorForm: SETTING_TEMPLATE.isErrorForm,
}))(EditTextArea);
