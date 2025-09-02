import React, { useEffect, useState, useRef } from 'react';
import styles from './styles.less';
import { useIntl, history } from 'umi';
import { connect } from 'dva';
import { Tabs, Button, Checkbox, Input, Form, message } from 'antd';
import { ACCOUNT_TYPE_PERSON } from '@/constant';

function SignIn(props) {
  const { dispatch, masterStore } = props;
  const intl = useIntl();
  const { formatMessage } = intl;
  const { TabPane } = Tabs;
  const [form] = Form.useForm();
  const [saveLogin, setSaveLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [typeInput1, setTypeInput1] = useState(false);
  const [bgFocus, setBGFocus] = useState(false);
  const [focus1, setFocus1] = useState(false);
  const inputRef1 = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (
      history.location.query.token &&
      history.location.query.register_success
    ) {
      const payload = {
        token_verify: history.location.query.token,
      };
      dispatch({ type: 'USER/verifyRegister', payload });
    }
  }, [history.location.query]);

  const onCheck = event => {
    setSaveLogin(old => !old);
  };
  const onSubmit = () => {
    form
      .validateFields(['password', 'email', 'autoLogin'])
      .then(async value => {
        if (!value.errorFields) {
          const payload = {
            email: value.email,
            password: value.password,
            account_type: ACCOUNT_TYPE_PERSON,
            autoLogin: saveLogin,
          };
          setLoading(true);
          await dispatch({ type: 'USER/emailLogin', payload });
          setLoading(false);
        }
      })
      .catch(err => err);
  };
  const inputFocus = e => {
    setBGFocus(true);
    setFocus1(true);
    setTypeInput1(true);
    inputRef1.current.input.selectionStart = inputRef1.current.input.selectionEnd =
      e.target.selectionStart + e.target.value.length;
  };
  return (
    <div className={styles.signIn}>
      {bgFocus ? (
        <div
          className={styles.bgTransparent}
          onClick={() => {
            setTypeInput1(false);
            setBGFocus(false);
            setFocus1(false);
          }}
        ></div>
      ) : (
        <div></div>
      )}
      <Form form={form}>
        <p className={styles.fieldName}>
          {formatMessage({ id: 'i18n_email' })}
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
            autoComplete="on"
          />
        </Form.Item>

        <p className={styles.fieldName}>
          {formatMessage({ id: 'i18n_password' })}
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
          ]}
          name={'password'}
        >
          <Input
            className={`${styles.inputField} ${focus1 ? styles.password : ''}`}
            placeholder={'例) Password12'}
            // iconRender={visible => (visible ? visible : visible)}
            onFocus={e => inputFocus(e)}
            type={typeInput1 ? 'text' : 'password'}
            ref={inputRef1}
            autoComplete="on"
          />
        </Form.Item>
        <Form.Item rules={[]} name={'autoLogin'}>
          <div className={styles.checkerViet}>
            <Checkbox checked={saveLogin} onChange={event => onCheck(event)}>
              {formatMessage({ id: 'i18n_auto_login_then' })}
            </Checkbox>
          </div>
        </Form.Item>
        <div className={styles.btnZone}>
          <Button
            className={styles.signInBtn}
            loading={loading}
            htmlType="submit"
            onClick={onSubmit}
          >
            {formatMessage({ id: 'i18n_btn_login' })}
          </Button>
        </div>
        <p
          className={styles.forgotPass}
          onClick={() => history.push('/forgot-password')}
        >
          {formatMessage({ id: 'i18n_if_forgot_pass_click_here' })}
        </p>
      </Form>
    </div>
  );
}

export default connect(({ MASTER }) => ({
  masterStore: MASTER,
}))(SignIn);
