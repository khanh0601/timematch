import useWindowDimensions from '@/commons/useWindowDimensions';
import { ExclamationCircleOutlined, LeftOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Spin, message, Tooltip } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { useHistory, useIntl } from 'umi';
import { profileFromStorage } from '../../commons/function';
import styles from './styles.less';
import TooltipFormat from '@/components/TooltipFormat';
import helper from '@/assets/images/imgQuestion.png';

const { Item } = Form;
const { confirm } = Modal;

function Profile(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const [form] = Form.useForm();
  const { masterStore, dispatch } = props;
  const { isScrollToProfilePage, isScrollToScheduleSetting } = masterStore;
  const [avatar, setAvatar] = useState(undefined);
  const [fileImage, setFileImage] = useState(undefined);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  const [loadingDeleteAccount, setLoadingDeleteAccount] = useState(false);
  const [loadingCancelPlan, setLoadingCancelPlan] = useState(false);
  const [detailProfile, setDetailProfile] = useState({});
  const [loadingData, setLoadingData] = useState(false);
  const [loadingBtnSave, setLoadingBtnSave] = useState(false);
  const history = useHistory();
  const { width } = useWindowDimensions();
  const [disableCancelPlan, setDisableCancelPlan] = useState(true);
  const profile = profileFromStorage();
  useEffect(() => {
    dispatch({
      type: 'MASTER/checkSlotStatus',
      payload: {
        showMessage: message,
        setDisableCancelPlan,
      },
    });
  }, []);

  useEffect(() => {
    const { avatar, name, company, katakana_name, code, email } = profile;

    form.setFieldsValue({
      fullName: name,
      company: company,
      code: code,
      email: email,
    });
    setDetailProfile(profile);
    setAvatar(avatar);
  }, []);

  const updateLocalStorage = values => {
    if (fileImage) profile.avatar = avatar;
    profile.company = values.company;
    profile.name = values.fullName;
    profile.katakana_name = values.userName;
    profile.code = values.code;
    localStorage.setItem('profile', JSON.stringify(profile));
  };

  const handleSubmitForm = values => {
    const formData = new FormData();
    if (fileImage) {
      formData.append('image', fileImage);
    }
    formData.append('name', values.fullName);
    formData.append('company', values.company);
    // formData.append('katakana_name', values.userName);
    formData.append('code', values.code);
    formData.append('_method', 'put');
    dispatch({
      type: 'MASTER/updateProfile',
      payload: {
        formData,
        message,
        formatMessage,
        setLoadingBtnSave,
        updateLocalStorage: () => updateLocalStorage(values),
      },
    });
  };

  const toBase64 = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });

  const handleSelectImage = async file => {
    const imgUrl = await toBase64(file.file);
    setAvatar(imgUrl);
    setFileImage(file.file);
    setUpdatingAvatar(true);
  };

  const handleResetAvatar = () => {
    setAvatar(profile.avatar);
    setFileImage(undefined);
    setUpdatingAvatar(false);
  };

  const scrollToScheduleSetting = ref => {
    if (
      ref &&
      isScrollToScheduleSetting === true &&
      isScrollToProfilePage === false
    ) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const onConfirmBeforeNavigate = route => {
    const value = form.getFieldsValue();

    if (
      value.fullName !== profile.name ||
      value.company !== profile.company ||
      value.code !== profile.code
    ) {
      confirm({
        title: '変更内容が保存されていません。',
        icon: <ExclamationCircleOutlined />,
        content: '変更内容を保存しますか？',
        onOk() {
          history.push(route);
        },
        onCancel() {},
      });
    } else {
      history.push(route);
    }
  };
  return (
    <div>
      {loadingData ? (
        <Spin className="loading-page" size="large" />
      ) : (
        <div className={styles.profileContainer}>
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
            <div className={styles.header}>プロフィール</div>
            <div></div>
          </div>
          {/* <div className={styles.headTitle}>
            <div className={styles.bolderIcon}></div>
            <div className={styles.titleIcon}></div>
            <span>{formatMessage({ id: 'i18n_profile' })}</span>
          </div> */}
          <div style={{ padding: 15 }}>
            <Form
              onFinish={handleSubmitForm}
              layout="vertical"
              className={styles.informationForm}
              scrollToFirstError
              form={form}
            >
              <Item
                name="fullName"
                label="氏名"
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'i18n_required_fields' }),
                  },
                  () => ({
                    async validator(rule, value) {
                      if (value && !value.trim()) {
                        throw new Error(
                          formatMessage({ id: 'i18n_required_fields' }),
                        );
                      }
                    },
                  }),
                ]}
              >
                <Input placeholder="氏名" />
              </Item>

              <Item
                name="company"
                label={formatMessage({ id: 'i18n_company_name' })}
              >
                <Input
                  placeholder={formatMessage({ id: 'i18n_company_name' })}
                />
              </Item>

              <Item name="code" label="役職">
                <Input placeholder="氏名" />
              </Item>
              <Item
                name="email"
                className={styles.urlRow}
                label={'メールアドレス'}
              >
                <Input readOnly />
              </Item>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  marginTop: 40,
                }}
              >
                {profile.microsoft_email || profile.google_email ? null : (
                  <Button
                    style={{
                      background: '#5b99bd',
                      borderColor: '#5b99bd',
                      width: '100%',
                      maxWidth: '100%',
                    }}
                    className="btn btnGreen "
                    onClick={() => {
                      onConfirmBeforeNavigate('/profile/schedule-setting');
                    }}
                  >
                    自動日程調整オプション
                  </Button>
                )}

                <Button
                  disabled={profile.microsoft_email || profile.google_email}
                  onClick={() => {
                    onConfirmBeforeNavigate('/profile/collaboration');
                  }}
                  style={{
                    background:
                      profile.microsoft_email || profile.google_email
                        ? '#e9e9e9'
                        : '#5b99bd',
                    borderColor:
                      profile.microsoft_email || profile.google_email
                        ? '#e9e9e9'
                        : '#5b99bd',
                    width: '100%',
                    maxWidth: '100%',
                  }}
                  className="btn btnGreen "
                >
                  他社カレンダー連携
                </Button>

                <Button
                  disabled={profile.microsoft_email || profile.google_email}
                  onClick={() => {
                    onConfirmBeforeNavigate('/change-password');
                  }}
                  style={{
                    background:
                      profile.microsoft_email || profile.google_email
                        ? '#e9e9e9'
                        : '#1f3c53',
                    borderColor:
                      profile.microsoft_email || profile.google_email
                        ? '#e9e9e9'
                        : '#1f3c53',
                    width: '100%',
                    maxWidth: '100%',
                  }}
                  className="btn btnGreen "
                >
                  パスワード変更
                </Button>

                <Button
                  className="btn btnGreen m-auto "
                  style={{
                    background: '#1f3c53',
                    width: '50%',
                    borderColor: '#1f3c53',
                  }}
                  loading={loadingBtnSave}
                  htmlType="submit"
                >
                  変更
                </Button>
              </div>
            </Form>
          </div>

          {/* <Form>
            <Item className={styles.backToHome}>
              <Button
                onClick={() => history.push('/')}
                className="btn btnGreen "
              >
                {formatMessage({ id: 'i18n_return_home' })}
              </Button>
            </Item>
          </Form> */}
        </div>
      )}

      {/* <Footer /> */}
    </div>
  );
}

export default connect(({ MASTER }) => ({ masterStore: MASTER }))(Profile);
