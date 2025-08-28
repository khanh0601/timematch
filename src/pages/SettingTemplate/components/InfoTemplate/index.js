import React, { useEffect, useRef } from 'react';
import { Button, Input } from 'antd';
import styles from '../ConfirmTemplate/FormEmbed/index.less';
import { useSelector } from 'umi';
import { HOUR_FORMAT, INPUT_TYPE, REQUIRED_STATUS } from '../../../../constant';
const { TextArea } = Input;
import ReactGA from 'react-ga';
import { getJPFullDate } from '../../../../commons/function';
import moment from 'moment';

const InfoTemplate = ({
  timeBooked,
  listAnswer,
  status,
  updateListAnswer,
  updatePolicy,
  onSubmit,
  onBackStep,
  policies,
}) => {
  // const scrollBottomRef = useRef();

  const eventTrack = (category, action, label) => {
    ReactGA.event({
      category: category,
      action: action,
      label: label,
    });
  };

  // useEffect(() => {
  //   if (window.innerWidth <= 425) {
  //     scrollBottomRef.current.scrollIntoView({ behavior: 'smooth' });
  //   }
  // }, []);

  // store setting template
  const { listQuestion, policy } = useSelector(store => store.SETTING_TEMPLATE);

  const onChange = e => {
    const { name, checked, value } = e.target;

    if (name === 'status') {
      updatePolicy(Number(e.target.id), checked ? 1 : 0);
      return;
    }

    const [key, id] = name.split('.');
    const listAnswerNew = listAnswer.map(item => {
      const { type } = item;
      if (item[key] === Number(id)) {
        if (type === 1) {
          item.content = value;
        }
        if (type === 2) {
          item.content = checked;
        }
      }
      return item;
    });
    updateListAnswer('answers', listAnswerNew);
  };

  // ******************* Start function UI ***************************
  const handleRenderInput = item => {
    const {
      id,
      type,
      index,
      status,
      contents,
      placeholder,
      question_name,
      key_id,
      value,
    } = item;
    switch (type) {
      case INPUT_TYPE.text:
        const answerItem = listAnswer.find(
          item => item.form_question_id === id,
        );
        return (
          <div className={styles.inputComponent}>
            <div className={`${styles.inputTitle} ${styles.alignTitleBView}`}>
              <div>{/*<div />*/}</div>
              <div>{question_name}</div>
              {status === REQUIRED_STATUS.required ? (
                <div className={styles.inputTitleRequired}>必須</div>
              ) : (
                <div className={styles.notRequired}>任意</div>
              )}
            </div>
            <Input
              onChange={onChange}
              name={`form_question_id.${answerItem.form_question_id}`}
              value={answerItem.content}
              placeholder={placeholder}
              className={styles.input}
            />
          </div>
        );
      case INPUT_TYPE.checkbox:
        return (
          <div className={styles.inputComponent}>
            <div className={`${styles.inputTitle} ${styles.alignTitleBView}`}>
              <div>{/*<div />*/}</div>
              <div>{question_name || ''}</div>
              {status === REQUIRED_STATUS.required ? (
                <div className={styles.inputTitleRequired}>必須</div>
              ) : (
                <div className={styles.notRequired}>任意</div>
              )}
            </div>
            <div className={styles.listOption}>
              {contents && contents?.length > 0 ? (
                contents.map((op, index) => {
                  const answerItem = listAnswer.find(
                    item => item.form_question_content_id === op.id,
                  );
                  return (
                    <React.Fragment key={index}>
                      <div className={styles.checkboxContainer}>
                        <input
                          onChange={onChange}
                          type="checkbox"
                          name={`form_question_content_id.${op.id}`}
                          checked={answerItem.content}
                          className={styles.checkbox}
                        />
                        <span className={styles.checkboxLabel}>
                          {op.content_name}
                        </span>
                      </div>
                    </React.Fragment>
                  );
                })
              ) : (
                <> </>
              )}
            </div>
            <div className={styles.subtitle}>{placeholder || ''}</div>
          </div>
        );
      case INPUT_TYPE.policy:
        const policy = policies.find(e => item.id === e.id);
        return (
          <div className={styles.inputComponent}>
            <div className={`${styles.inputTitle} ${styles.alignTitleBView}`}>
              <div>{/*<div />*/}</div>
              <div>{item.title}</div>
              {item.checkbox === REQUIRED_STATUS.required ? (
                <div className={styles.inputTitleRequired}>必須</div>
              ) : (
                <div className={styles.notRequired}>任意</div>
              )}
            </div>
            <div className={styles.checkboxContainer}>
              <input
                id={item.id}
                type="checkbox"
                name="status"
                checked={policy?.status == 1}
                onChange={onChange}
                className={styles.checkbox}
              />
              <a
                href={item.link || 'https://info.smoothly.jp/company/'}
                target="_blank"
                className={styles.checkboxLink}
              >
                {item.text_require || ''}
              </a>
            </div>
            {item.content && handleRenderPolicyContent(item.content)}
          </div>
        );
      default:
        return <></>;
    }
  };

  const handleRenderPolicyContent = policy_content => {
    if (policy_content) {
      return (
        <div className={styles.textareaSetting}>
          <TextArea
            disabled
            placeholder={policy_content}
            className={styles.textAreaCptNav}
          />
          {/*<div className={styles.errorMessage}>{policy_note || ''}</div>*/}
        </div>
      );
    }
    return <></>;
  };

  const submit = () => {
    eventTrack('Submit form data', 'Submit form Button', 'Button');
    // if (!onSubmit) {
    //   return;
    // }
    onSubmit();
  };

  const backStep = () => {
    if (!onBackStep) {
      return;
    }
    onBackStep();
  };

  return (
    <>
      <div className={`${styles.confirmBooking} ${styles.pd15}`}>
        {/*<div ref={scrollBottomRef} />*/}
        <div className={styles.title}>
          <div />
          <div />
          <span>下記をご入力ください</span>
        </div>
        <div>
          {listQuestion &&
            listQuestion.map(item => (
              <React.Fragment key={item.key_id}>
                {handleRenderInput(item)}
              </React.Fragment>
            ))}
        </div>
        <div className={styles.action}>
          <Button type="primary" className={styles.primaryBtn} onClick={submit}>
            送信
          </Button>
          <Button className={styles.secondaryBtn} onClick={backStep}>
            日時を選び直す
          </Button>
        </div>
      </div>
    </>
  );
};
export default React.memo(InfoTemplate);
