import useWindowDimensions from '@/commons/useWindowDimensions';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, Spin, message } from 'antd';
import { connect } from 'dva';
import React, { useEffect, useState } from 'react';
import { useHistory, useIntl } from 'umi';
import { profileFromStorage } from '../../commons/function';
import styles from './styles.less';
import HeaderMobile from '@/components/Mobile/Header';
import iconBack from '@/assets/images/i-back-white.png';
import iconClose from '@/assets/images/icon_Close.svg';
import { ROUTER } from '@/constant';
import PCHeader from '@/components/PC/Header';
import useIsMobile from '@/hooks/useIsMobile';
import FooterMobile from '../../components/Mobile/Footer';
import { onRefreshProfile } from '@/util/eventBus';
import ChangePassword from '../ChangePassword';
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
  const isMobile = useIsMobile();

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
    form.setFieldsValue({
      fullName: profile?.name,
      company: profile?.company == 'null' ? '' : profile?.company || '',
      company_role:
        profile?.company_role == 'null' ? '' : profile?.company_role || '',
      email:
        profile?.email || profile?.microsoft_email || profile?.google_email,
    });
    setDetailProfile(profile);
    setAvatar(profile?.avatar);
  }, []);

  const updateLocalStorage = values => {
    if (fileImage) profile.avatar = avatar;
    profile.company = values.company;
    profile.name = values.fullName;
    profile.katakana_name = values.userName;
    profile.company_role = values.company_role;
    localStorage.setItem('profile', JSON.stringify(profile));
    onRefreshProfile();
  };

  const handleSubmitForm = values => {
    const formData = new FormData();
    if (fileImage) {
      formData.append('image', fileImage);
    }
    formData.append('name', values.fullName);
    let company = values.company;
    if (company.trim() == '') {
      company = 'null';
    }
    formData.append('company', company);
    // formData.append('katakana_name', values.userName);
    let company_role = values.company_role;
    if (company_role.trim() == '') {
      company_role = 'null';
    }
    formData.append('company_role', company_role);
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
    setAvatar(profile?.avatar);
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

    const profileName = profile?.name === 'null' ? '' : profile?.name;
    const profileCompany = profile?.company === 'null' ? '' : profile?.company;
    const profileCompanyRole =
      profile?.company_role === 'null' ? '' : profile?.company_role;

    if (
      value.fullName !== profileName ||
      value.company !== profileCompany ||
      value.company_role !== profileCompanyRole
    ) {
      confirm({
        title: '変更内容が保存されていません。',
        icon: <ExclamationCircleOutlined />,
        content: '変更内容を保存しますか？',
        onOk() {
          handleSubmitForm(form.getFieldsValue());
          history.push(route);
        },
        onCancel() {},
      });
    } else {
      history.push(route);
    }
  };
  const [openPopupChangePass, setOpenPopupChangePass] = useState(false);
  return (
    <div>
      {loadingData ? (
        <Spin className="loading-page" size="large" />
      ) : (
        <div className={styles.profileContainer}>
          <PCHeader />
          <div className={styles.containerForm}>
            <div className={styles.formTab}>
              <div
                className={[styles.formTabButton, styles.active].join(' ')}
                onClick={() => {
                  history.push('/profile');
                }}
              >
                プロフィール
              </div>
              <div
                className={styles.formTabButton}
                onClick={() => {
                  onConfirmBeforeNavigate('/profile/schedule-setting');
                }}
              >
                自動日程調整オプション
              </div>
            </div>
            <div className={styles.pageTitle}>プロフィール</div>
            <Form
              onFinish={handleSubmitForm}
              layout="horizontal"
              className={styles.informationFormWrap}
              scrollToFirstError
              form={form}
            >
              <div className={styles.informationForm}>
                <Item
                  name="fullName"
                  className={styles.urlRow}
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
                  <Input
                    placeholder="氏名"
                    className={styles.borderMediumGray}
                  />
                </Item>

                <Item
                  className={styles.urlRow}
                  name="company"
                  label={formatMessage({ id: 'i18n_company_name' })}
                >
                  <Input
                    placeholder={formatMessage({ id: 'i18n_company_name' })}
                    className={styles.borderMediumGray}
                  />
                </Item>

                <Item
                  className={styles.urlRow}
                  name="company_role"
                  label="役職"
                >
                  <Input
                    placeholder="役職"
                    className={styles.borderMediumGray}
                  />
                </Item>

                <Item
                  name="email"
                  className={styles.urlRow}
                  label={'メールアドレス'}
                >
                  <Input
                    readOnly
                    className={`${styles.bgLightGray} ${styles.borderMediumGray}`}
                  />
                </Item>

                <div>
                  <div className={styles.groupButtonSubmit}>
                    <div>
                      {profile?.microsoft_email ||
                      profile?.google_email ? null : (
                        <Button
                          // disabled={profile?.microsoft_email || profile?.google_email}
                          onClick={() => setOpenPopupChangePass(true)}
                          className={[styles.groupButtonSubmitLink].join(' ')}
                        >
                          パスワード変更
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <Button
                className={[
                  styles.groupButtonSubmitItem,
                  styles.groupButtonSubmitItemOutline,
                ].join(' ')}
                loading={loadingBtnSave}
                htmlType="submit"
              >
                保存
              </Button>
            </Form>
          </div>
          <div
            className={
              styles.popupPass +
              ' ' +
              (openPopupChangePass ? `${styles.active}` : '')
            }
          >
            <div className={styles.popupPassInner}>
              <div
                className={styles.popupPassClose}
                onClick={() => setOpenPopupChangePass(false)}
              >
                <img src={iconClose} />
              </div>
              <ChangePassword />
            </div>
          </div>
        </div>
      )}

      <FooterMobile />
    </div>
  );
}

export default connect(({ MASTER }) => ({ masterStore: MASTER }))(Profile);
