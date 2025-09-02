import React, { memo, useState, useEffect } from 'react';
import styles from '../index.less';
import { Input, Button } from 'antd';
import { connect } from 'dva';
import { DEFAULT_INPUT_TEXT } from '../../../../../constant';
import { notify } from '../../../../../commons/function';
const { TextArea } = Input;

const EditInput = memo(props => {
  const { dispatch, questionSelect } = props;
  const [questionName, setQuestionName] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const [status, setStatus] = useState(false);
  // const [isEdit, setIsEdit] = useState(false);

  const handleSubmit = () => {
    if (questionName.trim() === '' || placeholder.trim() === '') {
      notify([
        '未入力の項目があるため、入力後に',
        '「保存」をクリックください。',
      ]);
      return;
    }
    dispatch({
      type: 'SETTING_TEMPLATE/updateQuestion',
      payload: {
        keyId: questionSelect.key_id,
        name: questionName,
        placeholder: placeholder,
        status,
      },
    });
  };

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
      setQuestionName(questionSelect.question_name || '');
      setPlaceholder(questionSelect.placeholder || '');
      setStatus(!!questionSelect.status);
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

  useEffect(() => {
    // if (isEdit) {
    const isError = questionName.length === 0 || placeholder.length === 0;
    if (isError !== props.isErrorForm) {
      dispatch({
        type: 'SETTING_TEMPLATE/updateErrorForm',
        payload: {
          value: isError,
        },
      });
    }
    // }
  }, [questionName, placeholder]);

  return (
    <div className={styles.editInputContainer}>
      <div className={styles.title}>
        <span>STEP &nbsp; 1：タイトルを入力ください</span>
      </div>
      <div className={styles.inputContainer}>
        <Input
          placeholder="例）電話番号"
          className={styles.inputCmt}
          value={
            questionName !== DEFAULT_INPUT_TEXT.question_name
              ? questionName
              : ''
          }
          onChange={e => {
            // setIsEdit(true);
            const { value } = e.target;
            if (questionName === 'メールアドレス') {
              return;
            }
            handleChangeData('question_name', value);
            setQuestionName(value);
          }}
        />
      </div>
      <div className={styles.title}>
        <span>STEP &nbsp; 2：説明文を入力ください。</span>
      </div>
      <div className={styles.inputContainer}>
        <TextArea
          placeholder="例）お電話番号をご入力ください。"
          className={styles.textAreaCpt}
          value={
            placeholder !== DEFAULT_INPUT_TEXT.placeholder ? placeholder : ''
          }
          onChange={e => {
            // setIsEdit(true);
            handleChangeData('placeholder', e.target.value);
            setPlaceholder(e.target.value);
          }}
        />
      </div>
      <div className={styles.checkboxContainer}>
        <input
          type="checkbox"
          name="required"
          className={styles.checkbox}
          checked={status}
          onChange={e => {
            if (questionName === 'メールアドレス') {
              notify(['メールアドレスは必須のため、チェックを外せません。']);
            } else {
              setStatus(e.target.checked);
              handleChangeData('status', e.target.checked ? 1 : 0);
            }
          }}
        />
        <span className={styles.checkboxLabel}>回答を必須にする</span>
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
}))(EditInput);
