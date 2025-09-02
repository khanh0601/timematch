import React, { memo, useState, useEffect } from 'react';
import styles from '../index.less';
import { Input, Button } from 'antd';
import InputWithIcon from '../Input/InputWithIcon';
import { connect } from 'dva';
import { deepCopyData } from '@/commons/function';
import { v4 as uuid } from 'uuid';
import { DEFAULT_INPUT_CHECKBOX } from '../../../../../constant';
import { notify } from '../../../../../commons/function';
const { TextArea } = Input;

const EditCheckbox = memo(props => {
  const { questionSelect, dispatch } = props;
  const [questionCheckBox, setQuestionCheckBox] = useState({
    question_name: '',
    placeholder: '',
    status: 0,
    key_id: '',
    type: 2,
    contents: [],
  });

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
    setQuestionCheckBox(questionSelect);
  }, [questionSelect]);

  useEffect(() => {
    const isError =
      questionCheckBox.question_name.length === 0 ||
      questionCheckBox.placeholder.length === 0 ||
      questionCheckBox.contents.length === 0 ||
      questionCheckBox.contents.some(i => i.content_name.length === 0);
    if (isError !== props.isErrorForm) {
      if (isError !== props.isErrorForm) {
        dispatch({
          type: 'SETTING_TEMPLATE/updateErrorForm',
          payload: {
            value: isError,
          },
        });
      }
    }
  }, [questionCheckBox]);

  const handleChangeCheckBox = (fieldName, fieldValue) => {
    dispatch({
      type: 'SETTING_TEMPLATE/updateTitleOrPlaceholder',
      payload: {
        keyId: questionSelect.key_id,
        fieldName,
        fieldValue,
      },
    });
  };

  const handleChange = e => {
    setQuestionCheckBox({
      ...questionCheckBox,
      [e.target.name]: e.target.value,
    });
    handleChangeCheckBox(e.target.name, e.target.value);
  };

  const handleSubmit = () => {
    if (
      questionCheckBox.question_name.trim() === '' ||
      questionCheckBox.placeholder.trim() === ''
    ) {
      notify([
        '未入力の項目があるため、入力後に',
        '「保存」をクリックください。',
      ]);
      return;
    }
    dispatch({
      type: 'SETTING_TEMPLATE/updateCheckBox',
      payload: {
        ...questionCheckBox,
      },
    });
  };

  const handleMove = (direction, index) => {
    const { contents } = questionCheckBox;
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === contents.length - 1)
    ) {
      return;
    }
    const temp = contents[index];
    if (direction === 'up') {
      contents[index] = contents[index - 1];
      contents[index - 1] = temp;
    } else {
      contents[index] = contents[index + 1];
      contents[index + 1] = temp;
    }
    setQuestionCheckBox({
      ...questionCheckBox,
      contents,
    });
    updateListCheckbox(JSON.parse(JSON.stringify(contents)));
  };

  const updateListCheckbox = contents => {
    dispatch({
      type: 'SETTING_TEMPLATE/updateListCheckbox',
      payload: {
        keyId: questionSelect.key_id,
        contents,
      },
    });
  };

  return (
    <div className={styles.editInputContainer}>
      <div className={styles.title}>
        <span>STEP &nbsp; 1：タイトルを入力ください</span>
      </div>
      <div className={styles.inputContainer}>
        <Input
          placeholder="例）希望職種"
          className={styles.inputCmt}
          name="question_name"
          value={
            questionCheckBox.question_name !==
            DEFAULT_INPUT_CHECKBOX.question_name
              ? questionCheckBox.question_name
              : ''
          }
          onChange={handleChange}
        />
      </div>
      <div className={styles.title}>
        <span>STEP &nbsp; 2：選択肢を追加・編集ください</span>
      </div>
      <div className={styles.optionCheckbox}>
        {questionCheckBox.contents &&
          questionCheckBox.contents.map((content, index) => (
            <React.Fragment key={content.key_id}>
              <InputWithIcon
                id={content.id}
                keyId={content.key_id}
                placeholder={
                  content.default
                    ? content.index === 1
                      ? '例）営業職'
                      : '例）エンジニア職'
                    : ''
                }
                value={content.content_name}
                onChange={e => {
                  const newConents = deepCopyData(questionCheckBox.contents);
                  newConents[index].content_name = e.target.value;
                  setQuestionCheckBox({
                    ...questionCheckBox,
                    contents: newConents,
                  });
                  updateListCheckbox(newConents);
                }}
                onDelete={() => {
                  const newConents = deepCopyData(questionCheckBox.contents);
                  newConents.splice(index, 1);

                  setQuestionCheckBox({
                    ...questionCheckBox,
                    contents: newConents.map((e, index) => ({ ...e, index })),
                  });
                  updateListCheckbox(newConents);
                }}
                onClick={direction => handleMove(direction, index)}
              />
            </React.Fragment>
          ))}

        <div className={styles.btnAddMore}>
          <span
            onClick={() => {
              const newContents = deepCopyData(questionCheckBox.contents);
              newContents.push({
                key_id: uuid(),
                content_name: '',
              });
              setQuestionCheckBox({
                ...questionCheckBox,
                contents: newContents.map((e, index) => ({ ...e, index })),
              });
              updateListCheckbox(newContents);
            }}
          >
            ＋選択肢を追加
          </span>
        </div>
      </div>
      <div className={styles.title}>
        <span>STEP &nbsp; 3：補足説明文を入力ください</span>
      </div>
      <div className={styles.inputContainer}>
        <TextArea
          className={styles.textAreaCpt}
          name="placeholder"
          placeholder={`例）ご利用目的をご選択ください。${'\n'}※複数選択可`}
          value={
            questionCheckBox.placeholder !== DEFAULT_INPUT_CHECKBOX.placeholder
              ? questionCheckBox.placeholder
              : ''
          }
          onChange={handleChange}
        />
      </div>

      <div className={styles.checkboxContainer}>
        <div>
          <input
            type="checkbox"
            name="required"
            className={styles.checkbox}
            checked={!!questionCheckBox.status}
            onChange={e => {
              setQuestionCheckBox({
                ...questionCheckBox,
                status: e.target.checked ? 1 : 0,
              });
              handleChangeCheckBox('status', e.target.checked ? 1 : 0);
            }}
          />
          <span className={styles.checkboxLabel}>回答を必須にする</span>
        </div>
        {/* <div>
          <input type="checkbox" name="required" className={styles.checkbox} />
          <span className={styles.checkboxLabel}>複数選択を可能にする</span>
        </div> */}
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
}))(EditCheckbox);
