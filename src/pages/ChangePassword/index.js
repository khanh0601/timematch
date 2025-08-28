import React, { useEffect, useState, useRef } from 'react';
import styles from './styles.less';
import { useIntl, history } from 'umi';
import { connect } from 'dva';
import { Form, Button, Input } from 'antd';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { passwordRegex } from '@/constant';
import { LeftOutlined } from '@ant-design/icons';
import { profileFromStorage } from '@/commons/function';

function ChangePassword(props) {
  const { dispatch, masterStore } = props;
  const intl = useIntl();
  const [form] = Form.useForm();
  const { formatMessage } = intl;
  const [loading, setLoading] = useState(false);
  const [typeInput1, setTypeInput1] = useState(false);
  const [typeInput2, setTypeInput2] = useState(false);
  const [typeInput3, setTypeInput3] = useState(false);
  const [bgFocus, setBGFocus] = useState(false);
  const [focus1, setFocus1] = useState(false);
  const [focus2, setFocus2] = useState(false);
  const [focus3, setFocus3] = useState(false);
  const inputRef1 = useRef(null);
  const inputRef2 = useRef(null);
  const inputRef3 = useRef(null);
  const profile = profileFromStorage();
  const onSubmit = () => {
    form
      .validateFields(['email', 'currentPassword', 'password', 'passwordAgain'])
      .then(async value => {
        if (!value.errorFields) {
          const payload = {
            data: {
              new_password: value.password,
              old_password: value.currentPassword,
            },
            token: history.location.query.token
              ? history.location.query.token
              : '',
            isAdmin: history.location.query.is_admin
              ? history.location.query.is_admin
              : undefined,
          };
          setLoading(true);
          await dispatch({ type: 'USER/resetPassword', payload });
          setLoading(false);
        }
      })
      .catch(err => err);
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

    if (value === 3) {
      setFocus1(false);
      setFocus2(false);
      setFocus3(true);
      setTypeInput1(false);
      setTypeInput2(false);
      setTypeInput3(true);
      inputRef3.current.input.selectionStart = inputRef3.current.input.selectionEnd =
        e.target.selectionStart + e.target.value.length;
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      email: profile.email,
      currentPassword: '',
      password: '',
      passwordAgain: '',
    });
  }, []);

  return (
    <div className={styles.changePassword}>
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid darkblue',
          padding: 15,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            background: 'dodgerblue',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 5,
          }}
          onClick={() => history.goBack()}
        >
          <LeftOutlined style={{ color: '#FFF' }} />
        </div>
        <div style={{ fontWeight: '600', fontSize: 18 }}>パスワードを変更</div>
        <div
          style={{
            width: 30,
            height: 30,
          }}
        ></div>
      </div>

      <div className={styles.bodyContent}>
        <div className={styles.bodyContainer}>
          <Form form={form}>
            <div className={styles.fieldName}>ご登録のメールアドレス</div>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'i18n_required_text' }),
                },
              ]}
              name="email"
            >
              <Input
                className={styles.inputField}
                placeholder={'例) evergreen1129@smoothly.jp'}
                autoComplete="on"
                readOnly
              />
            </Form.Item>
            <div className={styles.fieldName}>旧パスワード</div>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'i18n_required_text' }),
                },
              ]}
              name={'currentPassword'}
            >
              <Input
                className={`${styles.inputField} ${
                  focus1 ? styles.password : ''
                }`}
                placeholder={'例) 旧パスワード'}
                // iconRender={visible => (visible ? visible : visible)}
                onFocus={e => inputFocus(e, 1)}
                type={typeInput1 ? 'text' : 'password'}
                ref={inputRef1}
              />
            </Form.Item>
            <div className={styles.fieldName}>新しいパスワードを設定</div>
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
                className={`${styles.inputField} ${
                  focus2 ? styles.password : ''
                }`}
                placeholder={'例) 新しいパスワードを設定'}
                // iconRender={visible => (visible ? visible : visible)}
                onFocus={e => inputFocus(e, 2)}
                type={typeInput2 ? 'text' : 'password'}
                ref={inputRef2}
              />
            </Form.Item>
            <div className={styles.fieldName}>
              新しいパスワードを設定(確認用)
            </div>

            <Form.Item
              rules={[
                {
                  required: true,
                  message: formatMessage({ id: 'i18n_required_text' }),
                },
                ({ getFieldValue }) => ({
                  validator(rule, value) {
                    if (!value || getFieldValue('password') === value) {
                      if (value && value.length < 8) {
                        return Promise.reject(
                          formatMessage({ id: 'i18n_wrong_password_length' }),
                        );
                      }
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
                className={`${styles.inputField} ${
                  focus3 ? styles.password : ''
                }`}
                //placeholder repeat password in japanese
                placeholder="例) パスワードを再入力してください。"
                // iconRender={visible => (visible ? visible : visible)}
                onFocus={e => inputFocus(e, 3)}
                type={typeInput3 ? 'text' : 'password'}
                ref={inputRef3}
              />
            </Form.Item>
            <div className={styles.btnZone}>
              <Form.Item>
                <Button
                  loading={loading}
                  htmlType="submit"
                  onClick={onSubmit}
                  className={styles.signUpBtn}
                >
                  変更
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default connect(({ MASTER }) => ({
  masterStore: MASTER,
}))(ChangePassword);
