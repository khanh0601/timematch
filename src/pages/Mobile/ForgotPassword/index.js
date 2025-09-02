import React, { useEffect, useRef, useState } from 'react';
import styles from './styles.less';
import { useIntl, history } from 'umi';
import { connect } from 'dva';
import { Form, Button, Spin, Input } from 'antd';
import HeaderMobile from '@/components/Mobile/Header';
import { notify } from '../../../commons/function';
import iconBack from '@/assets/images/i-back-white.png';
import { ROUTER } from '@/constant';
import useIsMobile from '@/hooks/useIsMobile';
import FooterMobile from '@/components/Mobile/Footer';

function ForgotPassword(props) {
  const { dispatch, masterStore } = props;
  const intl = useIntl();
  const { formatMessage } = intl;
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [mailCheck, setMailCheck] = useState(false);
  const isMobile = useIsMobile();
  const scrollRef = useRef(null);

  useEffect(() => {
    setLoginLoading(true);

    setTimeout(() => {
      setLoginLoading(false);
    }, 2000);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;

    const handleWheel = e => {
      e.preventDefault();
      el.scrollTop += e.deltaY;
    };

    el.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      el.removeEventListener('wheel', handleWheel);
    };
  }, []);

  const goBack = () => {
    history.go(-1);
  };

  const onSubmit = () => {
    form
      .validateFields(['email'])
      .then(async value => {
        if (!value.errorFields) {
          const payload = {
            data: {
              email: value.email,
            },
            removeLoading: () => {
              setLoading(true);
              notify(formatMessage({ id: 'i18n_email_not_existed' }));
              setTimeout(() => {
                setLoading(false);
              }, 3000);
            },
            showNotice: () => {
              setLoading(true);
              setMailCheck(true);
            },
          };
          setLoading(true);
          await dispatch({ type: 'USER/sendMailResetPassword', payload });
          setTimeout(() => {
            setLoading(false);
          }, 3000);
        }
      })
      .catch(err => {
        setLoading(false);
      });
  };

  return (
    <div className={styles.forgotPassword}>
      <HeaderMobile
        title={formatMessage({ id: 'i18n_reset_password' })}
        isShowLeft={true}
        primary={
          isMobile
            ? { bgColor: 'bgPrimaryBlue', textColor: 'textLightGray' }
            : undefined
        }
        itemLeft={
          isMobile
            ? {
                event: 'back',
                url: ROUTER.login,
                icon: iconBack,
                bgColor: 'bgPrimaryWhiteOpacity',
              }
            : undefined
        }
        showLogo={!isMobile}
      />
      {mailCheck ? (
        <div>
          <h2>{formatMessage({ id: 'i18n_please_check_your_email' })}</h2>
        </div>
      ) : (
        <Spin spinning={loginLoading}>
          <div className={styles.bodyContent} ref={scrollRef}>
            {!isMobile && (
              <h1 className={styles.titleForm}>
                {formatMessage({ id: 'i18n_if_forgot_title_pc' })}
              </h1>
            )}
            <Form form={form}>
              <div className={styles.inputField}>
                <span className={styles.textDarkGray}>
                  {formatMessage({ id: 'i18n_email' })}
                </span>
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
                    className={`${styles.inputField} ${styles.borderMediumGray}`}
                    placeholder={'例) evergreen1129@timematch.jp'}
                  />
                </Form.Item>
              </div>
              <div className={styles.btnZone}>
                <Form.Item>
                  <Button
                    loading={loading}
                    htmlType="submit"
                    onClick={onSubmit}
                    className={`${styles.signUpBtn} ${styles.bgDarkBlue} btn-pc-primary`}
                  >
                    {formatMessage({ id: 'i18n_reset' })}
                  </Button>
                </Form.Item>
              </div>
              {!isMobile && (
                <div className={`${styles.btnZone} ${styles.btnBack}`}>
                  <Form.Item>
                    <Button
                      htmlType="button"
                      onClick={goBack}
                      className={`${styles.signUpBtn} ${styles.bgDarkGray} btn-pc-gray`}
                    >
                      {formatMessage({ id: 'i18n_back' })}
                    </Button>
                  </Form.Item>
                </div>
              )}
            </Form>
          </div>
        </Spin>
      )}
      {!isMobile && <FooterMobile />}
    </div>
  );
}

export default connect(({ USER }) => ({
  userStore: USER,
}))(ForgotPassword);
