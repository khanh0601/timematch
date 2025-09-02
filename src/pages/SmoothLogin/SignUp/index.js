import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.less';
import { useIntl, history } from 'umi';
import { connect } from 'dva';
import { Form, Button, Checkbox, Input } from 'antd';
import { passwordRegex, ACCOUNT_TYPE_PERSON } from '@/constant';

function SignUp(props) {
  const { dispatch, userStore } = props;
  const intl = useIntl();
  const [form] = Form.useForm();
  const { formatMessage } = intl;
  const [loading, setLoading] = useState(false);
  const [typeInput1, setTypeInput1] = useState(false);
  const [typeInput2, setTypeInput2] = useState(false);
  const [bgFocus, setBGFocus] = useState(false);
  const [focus1, setFocus1] = useState(false);
  const [focus2, setFocus2] = useState(false);
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);

  const onCheck = value => {};

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const generatePassword = () => {
    const length = 8;
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let retVal = '';
    while (!passwordRegex.test(retVal)) {
      retVal = '';
      for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
      }
    }
    form.setFieldsValue({
      password: retVal,
    });
    return retVal;
  };
  const inputFocus = (e, value) => {
    setBGFocus(true);
    if (value === 1) {
      setFocus1(true);
      setFocus2(false);
      setTypeInput1(true);
      setTypeInput2(false);
      inputRef1.current.input.selectionStart = inputRef1.current.input.selectionEnd =
        e.target.selectionStart + e.target.value.length;
    }
    if (value === 2) {
      setFocus1(false);
      setFocus2(true);
      setTypeInput1(false);
      setTypeInput2(true);
      inputRef2.current.input.selectionStart = inputRef2.current.input.selectionEnd =
        e.target.selectionStart + e.target.value.length;
    }
  };
  const onSubmit = () => {
    form
      .validateFields(['password', 'email', 'passwordAgain'])
      .then(async value => {
        if (!value.errorFields) {
          const payload = {
            email: value.email,
            password: value.password,
            account_type: ACCOUNT_TYPE_PERSON,
          };
          setLoading(true);
          await dispatch({
            type: 'USER/registerEmail',
            payload: { payload, formatMessage },
          });
          setLoading(false);
        }
      })
      .catch(err => err);
  };
  const handleKeyDown = e => {
    if (e.key === ' ') {
      e.preventDefault();
    }
  };

  return (
    <div className={styles.signUp}>
      {bgFocus ? (
        <div
          className={styles.bgTransparent}
          onClick={() => {
            setTypeInput1(false);
            setTypeInput2(false);
            setBGFocus(false);
            setFocus1(false);
            setFocus2(false);
          }}
        ></div>
      ) : (
        <div></div>
      )}
      <Form form={form}>
        <p className={styles.fieldName}>
          {formatMessage({ id: 'i18n_email' })}
          <span className={styles.required}>
            {formatMessage({ id: 'i18n_required' })}
          </span>
        </p>
        <Form.Item
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'i18n_required_text' }),
            },
            {
              type: 'email',
              message: intl.formatMessage({
                id: 'i18n_email_error_notice',
              }),
            },
          ]}
          name={'email'}
        >
          <Input
            className={styles.inputField}
            placeholder={'例) evergreen1129@timematch.jp'}
            onKeyDown={event => handleKeyDown(event)}
          />
        </Form.Item>
        <p className={styles.fieldName}>
          {formatMessage({ id: 'i18n_password' })}
          <span className={styles.required}>
            {formatMessage({ id: 'i18n_required' })}
          </span>
        </p>
        <div className={styles.passNotes}>
          {formatMessage({ id: 'i18n_valid_pass_length' })}
        </div>
        <Form.Item
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'i18n_required_text' }),
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (value && (!passwordRegex.test(value) || value.length < 8)) {
                  return Promise.reject(
                    formatMessage({ id: 'i18n_password_validate_notice' }),
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
          name={'password'}
          className={styles.passwordAuto}
        >
          <Input
            className={`${styles.inputField} ${focus1 ? styles.password : ''}`}
            placeholder={'例) Password12'}
            // iconrender={visible => (visible ? visible : visible)}
            onFocus={e => inputFocus(e, 1)}
            type={typeInput1 ? 'text' : 'password'}
            ref={inputRef1}
          />
        </Form.Item>
        <Button
          className={styles.useRecommendPass}
          onClick={() => generatePassword()}
        >
          {formatMessage({ id: 'i18n_use_recommend_password' })}
        </Button>

        <p className={styles.fieldName}>
          {formatMessage({ id: 'i18n_confirm_password' })}
          <span className={styles.required}>
            {formatMessage({ id: 'i18n_required' })}
          </span>
        </p>
        <Form.Item
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'i18n_required_text' }),
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  formatMessage({ id: 'i18n_confirm_password_wrong' }),
                );
              },
            }),
          ]}
          name={'passwordAgain'}
        >
          <Input
            className={`${styles.inputField} ${focus2 ? styles.password : ''}`}
            placeholder={'例) Password12'}
            // iconRender={visible => (visible ? visible : visible)}
            onFocus={e => inputFocus(e, 2)}
            type={typeInput2 ? 'text' : 'password'}
            ref={inputRef2}
          />
        </Form.Item>
        <div className={styles.checkerViet}>
          <Checkbox onChange={value => onCheck(value)}>
            {formatMessage({ id: 'i18n_auto_login_then' })}
          </Checkbox>
        </div>
        <div className={styles.btnZone}>
          <Form.Item>
            <Button
              loading={loading}
              htmlType="submit"
              onClick={onSubmit}
              className={styles.signUpBtn}
            >
              {formatMessage({ id: 'i18n_register_free' })}
            </Button>
          </Form.Item>
        </div>
        <p className={styles.remindOpenMail}>
          {formatMessage({ id: 'i18n_you_will_recieve_mail' })}
          <br />
          「support@ever-green-inc.net」
          {formatMessage({ id: 'i18n_please_accept_mail_from' })}
        </p>
      </Form>
    </div>
  );
}

export default connect(({ USER }) => ({
  userStore: USER,
}))(SignUp);
