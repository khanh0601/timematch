import { connect } from 'dva';
import { Button, Checkbox, Form, Input, Spin, Modal, Row, Col } from 'antd';
import styles from './styles.less';
import React, { useState, useEffect, useRef } from 'react';
import { useIntl } from 'umi';
import { ACCOUNT_TYPE_BUSINESS, emailRegex3 } from '@/constant';
import config from '@/config';
import { ACCOUNT_TYPE_PERSON } from '@/constant';
import HeaderMobile from '@/components/Mobile/Header';
import iconBack from '@/assets/images/i-back-white.png';
import { ROUTER } from '@/constant';
import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import iconGoogle from '@/assets/images/google.png';
import iconOffice from '@/assets/images/microsoft.png';
import useIsMobile from '@/hooks/useIsMobile';
import FooterMobile from '@/components/Mobile/Footer';
import { history } from 'umi';
import './stylesPc.less';

function Register(props) {
  const intl = useIntl();
  const { dispatch, masterStore } = props;
  const [form] = Form.useForm();
  const { formatMessage } = intl;
  const [loading, setLoading] = useState(true);
  const [savePolicy, setPolicy] = useState(false);
  const [type, setType] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const contentRef = useRef(null);
  const [checkTerm, setCheckTerm] = useState(true);
  const isMobile = useIsMobile();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    });
  }, []);

  const onCheck = () => {
    setModalVisible(true);
  };

  const onSubmit = () => {
    if (checkTerm && !savePolicy) {
      setCheckTerm(false);
    }
    form
      .validateFields(['name', 'companyName', 'role', 'email', 'privacyPolicy'])
      .then(async value => {
        if (!value.errorFields && savePolicy) {
          const payload = {
            account_type: ACCOUNT_TYPE_BUSINESS,
            name: value.name,
            company: value.companyName,
            company_role: value.role,
            email: value.email,
            privacy_policy: savePolicy,
          };
          setLoading(true);
          await dispatch({ type: 'USER/registerEmailApp', payload });
          setLoading(false);
        }
      })
      .catch(err => err);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      if (((scrollTop + clientHeight) / scrollHeight) * 100 >= 90) {
        setIsButtonEnabled(true);
      } else {
        setIsButtonEnabled(false);
      }
    }
  };

  const microsoftLogin = async accountType => {
    const redirectUri =
      window.location.protocol +
      '//' +
      window.location.host +
      '/get-code-microsoft';
    const clientId = config.MICROSOFT_CLIENT_KEY;
    const url = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${clientId}&scope=User.Read Calendars.Read Calendars.ReadWrite offline_access&response_type=code&redirect_uri=${redirectUri}&state=ClientStateGoesHere&prompt=login`;
    const external = window.open(
      url,
      '',
      'width=480,height=800,top=400,left=400',
    );
    localStorage.removeItem('code');
    const interval = setInterval(() => {
      const code = localStorage.getItem('code');
      if (code) {
        external?.close();
        const payload = {
          token: code,
          account_type: accountType,
        };
        dispatch({ type: 'MASTER/microsoftSignUp', payload });
        localStorage.removeItem('code');
      }

      if (external?.closed || code) {
        clearInterval(interval);
      }
    }, 1000);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const acceptModal = () => {
    setCheckTerm(true);
    setModalVisible(false);
  };

  const GoogleLoginButton = () => {
    const handleGoogleAuth = useGoogleLogin({
      onSuccess: codeResponse => {
        const payload = {
          token: codeResponse.code,
          account_type: type,
        };
        dispatch({ type: 'MASTER/googleSignUp', payload });
      },
      onError: () => console.log('Login Failed'),
      flow: 'auth-code',
      scope:
        'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar',
    });

    return (
      <Button
        onClick={() => handleGoogleAuth()}
        className={`${styles.loginButton}`}
      >
        <img src={iconGoogle} alt={'Google'} />
        {formatMessage({ id: 'i18n_signup_google' })}
      </Button>
    );
  };

  return (
    <Spin spinning={loading}>
      <HeaderMobile
        title={formatMessage({ id: 'i18n_register_as_new_member' })}
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
      <div className={styles.signUpWrap}>
        <div className={`${styles.signUp} signUp-page`}>
          <div className={styles.loginPageTab}>
            <div
              className={`${styles.loginPageTabItem} `}
              onClick={() => {
                history.push('/login');
              }}
            >
              ログイン
            </div>
            <div
              className={`${styles.loginPageTabItem} ${styles.active}`}
              onClick={() => {
                history.push('/register');
              }}
            >
              アカウント新規作成
            </div>
          </div>
          <h1 className={styles.leftFormTitle}>
            {formatMessage({ id: 'i18n_left_signup_title' })}
          </h1>
          <div className={styles.bodyContent}>
            <Form form={form} className={styles.form}>
              <div className={styles.inputField}>
                <div className={`${styles.fieldLabel} ${styles.textDarkGray}`}>
                  {formatMessage({ id: 'i18n_fullname' })}
                  <span className={styles.inputRequired}>
                    {formatMessage({ id: 'i18n_required' })}
                  </span>
                </div>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: formatMessage({ id: 'i18n_required_text' }),
                    },
                    {
                      type: 'text',
                      message: intl.formatMessage({
                        id: 'i18n_email_error_notice',
                      }),
                    },
                  ]}
                  name={'name'}
                >
                  <Input
                    className={`${styles.inputField} ${styles.borderMediumGray}`}
                    placeholder={''}
                    autoComplete="on"
                  />
                </Form.Item>
              </div>
              <div className={styles.inputField}>
                <div className={`${styles.fieldLabel} ${styles.textDarkGray}`}>
                  {formatMessage({ id: 'i18n_company_name' })}
                </div>
                <Form.Item name={'companyName'}>
                  <Input
                    className={`${styles.inputField} ${styles.borderMediumGray}`}
                    placeholder={''}
                    autoComplete="on"
                  />
                </Form.Item>
              </div>
              <div className={styles.inputField}>
                <div className={`${styles.fieldLabel} ${styles.textDarkGray}`}>
                  {formatMessage({ id: 'i18n_role' })}
                </div>
                <Form.Item name={'role'}>
                  <Input
                    className={`${styles.inputField} ${styles.borderMediumGray}`}
                    placeholder={''}
                    autoComplete="on"
                  />
                </Form.Item>
              </div>
              <div className={styles.inputField}>
                <div className={`${styles.fieldLabel} ${styles.textDarkGray}`}>
                  {formatMessage({ id: 'i18n_email_register' })}
                  <span className={styles.inputRequired}>
                    {formatMessage({ id: 'i18n_required' })}
                  </span>
                </div>
                <Form.Item
                  rules={[
                    {
                      required: true,
                      message: formatMessage({ id: 'i18n_required_text' }),
                    },
                    () => ({
                      validator(rule, value) {
                        if (value && !emailRegex3.test(value)) {
                          return Promise.reject(
                            formatMessage({ id: 'i18n_email_error_notice' }),
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                  name={'email'}
                >
                  <Input
                    className={`${styles.inputField} ${styles.borderMediumGray}`}
                    placeholder={'例）evergreen1129@timematch.jp'}
                    autoComplete="on"
                  />
                </Form.Item>
              </div>
              <Form.Item name={'privacyPolicy'}>
                <div className={`${styles.checkTerm} ${styles.textDarkGray}`}>
                  <Checkbox checked={savePolicy} onChange={() => onCheck()}>
                    {formatMessage({ id: 'i18n_privacy_policy_register' })}
                  </Checkbox>
                </div>
              </Form.Item>
              <div className={styles.errorNoticeTerm}>
                {!checkTerm && !savePolicy
                  ? formatMessage({ id: 'i18n_required_text' })
                  : ''}
              </div>
              <div className={styles.btnZone}>
                <Button
                  className={`${styles.signUpBtn}`}
                  loading={loading}
                  htmlType="submit"
                  onClick={onSubmit}
                >
                  {formatMessage({ id: 'i18n_btn_registration' })}
                </Button>
              </div>
            </Form>
            <div className={styles.card}>
              <div className={styles.grid}>
                <GoogleOAuthProvider clientId={config.GOOGLE_CLIENT_KEY}>
                  <GoogleLoginButton />
                </GoogleOAuthProvider>
                <Button
                  className={styles.loginButton}
                  onClick={() => microsoftLogin(ACCOUNT_TYPE_PERSON)}
                >
                  <img src={iconOffice} alt={'Microsoft'} />
                  <span>{formatMessage({ id: 'i18n_signup_office' })}</span>
                </Button>
              </div>
            </div>
          </div>
          <FooterMobile />
        </div>
      </div>
      <Modal
        title={formatMessage({
          id: isMobile ? 'i18n_term_of_user' : 'i18n_term_of_user_pc',
        })}
        open={modalVisible}
        onCancel={closeModal}
        closable={false}
        footer={[
          <div key="groupBtn">
            <Button
              onClick={() => {
                closeModal();
              }}
            >
              {formatMessage({ id: 'i18n_cancel' })}
            </Button>
            <Button
              htmlType="submit"
              form="edit-user-form"
              type="primary"
              onClick={() => {
                setPolicy(true);
                acceptModal();
              }}
              disabled={!isButtonEnabled}
            >
              {formatMessage({ id: 'i18n_ok_button' })}
            </Button>
          </div>,
        ]}
      >
        <p className={styles.note}>
          {formatMessage({ id: 'i18n_scroll_note' })}
        </p>
        <div
          ref={contentRef}
          className={styles.termOfUser}
          onScroll={handleScroll}
        >
          <Row
            style={{
              flexDirection: 'column',
            }}
          >
            <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>
              第一章 総則
            </h1>
            <h2 className={styles.title}>第１条（利用規約の適用）</h2>
            <p>
              １．この利用規約（以下「本規約」といいます。）は、株式会社ビジョン（以下「当社」といいます。）の提供する「タイムマッチ」（以下「本サービス」といいます。）の利用に関し、当社及び契約者（次条で定義し、以下本条において同様とします。）との間に、一律に適用されます。
            </p>
            <p>
              ２．契約者は、本規約に同意しない限り、本サービスを利用することはできません。
            </p>
            <p>
              ３．本規約とは別に、本サービスに関し別途当社が定める諸規定（サービス紹介、料金表、ヘルプ、注意書きその他のウェブサイト上の記載並びに当社による契約者への通知及びプライバシーポリシー等を含みます。）は、それぞれ本規約の一部を構成します。また、本規約の内容と当該諸規定の内容との間に矛盾抵触がある場合には、当該諸規定が優先して適用されるものとします。
            </p>
            <h2 className={styles.title}>第２条（用語の定義）</h2>
            <p>
              本規約において使用する用語の定義は次のとおりとします。ただし、別に定義のある場合はこの限りではありません。
            </p>
            <table border={1}>
              <tr>
                <td width={'10%'}>（１）</td>
                <td width={'20%'}>利用契約</td>
                <td width={'70%'}>
                  本サービスを利用するための本規約に基づく契約の総称
                </td>
              </tr>
              <tr>
                <td width={'10%'}>（２）</td>
                <td width={'20%'}>契約者</td>
                <td width={'70%'}>
                  当社との間で利用契約が成立した者。ただし、文脈により本サービスへの申込を行った者または利用ユーザーを含みます。
                </td>
              </tr>
              <tr>
                <td width={'10%'}>（３）</td>
                <td width={'20%'}>本サービス</td>
                <td width={'70%'}>タイムマッチ</td>
              </tr>
              <tr>
                <td width={'10%'}>（４）</td>
                <td width={'20%'}>利用ユーザー</td>
                <td width={'70%'}>契約者が承認した本サービスを利用する者</td>
              </tr>
              <tr>
                <td width={'10%'}>（５）</td>
                <td width={'20%'}>ユーザーＩＤ</td>
                <td width={'70%'}>利用ユーザーを識別するための符号</td>
              </tr>
            </table>
            <h2 className={styles.title}>第３条（本規約の変更）</h2>
            <p>
              １．当社は、以下の各号のいずれかに該当する場合は、民法第５４８条の４の規定に基づき本規約を随時変更できます。本規約が変更された後の本契約は、変更後の本規約が適用されます。
            </p>
            <ul>
              <li>（１）本規約の変更が、契約者の一般の利益に適合するとき。</li>
              <li>
                （２）本規約の変更が、契約をした目的に反せず、かつ、変更の必要性、変更後の内容の相当性及びその内容その他の変更に係る事情に照らして合理的なものであるとき。
              </li>
            </ul>
            <p>
              ２．当社は、本規約の変更を行う場合は、変更後の本規約の効力発生時期を定め、あらかじめ変更後の本規約の内容及び効力発生時期を第５条（通知の方法）に定める方法により契約者に通知、本サービス上への表示その他当社所定の方法により契約者に周知します。
            </p>
            <p>
              ３．前二項の規定にかかわらず、前項の本規約の変更の周知後に契約者が基づき通知された本規約の変更の効力が発生する日以後に、契約者または利用ユーザーが本サービスを利用した場合、当該契約者は本規約の変更に同意したとみなします。
            </p>
            <h2 className={styles.title}>第４条（本サービス内容の変更）</h2>
            <p>
              １．当社は、契約者の承諾を得ることなく、本サービスの利用料金その他のサービス内容を変更することがあります。その場合当社は、変更後のサービス内容を第５条（通知の方法）に定める方法により契約者に周知するものとし、以後、変更後のサービス内容が適用されるものとするとともに、その後の本サービスの利用により、契約者は当該変更に同意したものとみなされます。
            </p>
            <p>
              ２．前項に基づき本サービスの内容が変更され、これに起因して契約者に損害が発生した場合でも、当社に故意または重過失がある場合を除き、当社は一切の責任を負わないものとします。
            </p>
            <p>
              ３．当社は、第1項に基づく変更前の本サービスの全ての機能及び性能が変更後において維持されることを保証しません。
            </p>
            <h2 className={styles.title}>第5条（本サービスの廃止）</h2>
            <p>
              １．当社は、その１か月前までに契約者に通知したうえで、本サービスを廃止することができるものとします。この場合において、利用契約は将来に向かって終了し、未履行期間に係る本サービスの利用料の支払いを受けている場合には、当社は契約者に対してこれを返還します。
            </p>
            <p>
              ２．前項の場合、当社に故意または重過失がある場合を除き、当社は契約者に対し一切の責任を負わないものとします。
            </p>
            <h2 className={styles.title}>第6条（通知の方法）</h2>
            <p>
              本規約に別段の定めがある場合を除き、当社から契約者または申込者に対する一切の通知は、書面、電子メール（ショートメールサービス等を含みます。）、電話または当社が運営するウェブサイトへの掲示その他当社が指定する方法により行います。
            </p>
            <h2 className={styles.title}>第7条（利用許諾及び制限）</h2>
            <p>
              １．契約者は、契約者自身の業務において利用することを目的として、本サービスを利用することができるものとし、転売、再販売、サブライセンス、商業目的での利用その他の契約者自身の業務の目的以外の目的で利用してはならないものとします。
            </p>
            <p>
              ２．契約者は、利用ユーザーをして、本規約に定める条件を周知し、遵守させるものとします。
            </p>
            <h2 className={styles.title}>第8条（契約者情報）</h2>
            <p>
              １．契約者は、名義・住所・連絡先等（以下「契約者情報」と総称します。）を変更する場合（法人合併及び会社分割による場合を含みます。）は、当社が指定する方法により、必ず当社へ速やかに通知するものとします。なお、変更の内容により本サービスの継続利用をお断りする場合があります。
            </p>
            <p>
              ２．契約者が前項の通知を怠った場合は、当社が契約者の変更前の名義・住所または連絡先等の契約者情報に発信した書面・電子メール等は、全て契約者に対して発信した時点において到着したものとみなされます。
            </p>
            <p>
              ３．第１項の通知を怠り、または虚偽の契約者情報を当社に通知したことによって生じた損害に関する責任は契約者が負うものとし、当社は一切の責任を負いません。
            </p>
            <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>
              第二章 契約
            </h1>
            <h2 className={styles.title}>第9条（申込手続）</h2>
            <p>
              １．申込者による利用契約の申込は、あらかじめ本規約に同意の上、当社指定の申込書、またはインターネットのオンライン申込画面に必要事項を記入いただく方法で行うものとします。
            </p>
            <p>
              ２．当社は、契約者による利用契約の申込を承諾しないことがあります。この場合当社は、当該契約者に対しその旨を通知します。なお、当社から契約者に対する通知は、申込みを承諾しない旨のみを通知するものとし、その理由等についての開示・説明は行わないものとします。
            </p>
            <h2 className={styles.title}>第10条（契約の成立）</h2>
            <p>
              １．利用契約は、契約者が当社指定の手続きにより申込を完了し、当社が契約者に対し当該申込を承諾する旨を記載した通知を発信した時点で成立するものとします。
            </p>
            <p>
              ２．当社が契約者の希望するサービスを提供出来ないと判断した場合、または申込を承諾した後において事情により契約者にサービスが提供できないと判断した場合には、当社は、契約者に対し、第５条（通知の方法）に定める方法にて通知します。なお、申込を承諾した後において当社がサービスを提供できない旨通知した場合は、当該通知の発信をもって利用契約が取り消されたのもとします。
            </p>
            <h2 className={styles.title}>第11条（利用契約の有効期間）</h2>
            <p>
              利用契約は、利用契約の成立時から12か月間有効とします。ただし、利用契約等において特段の定めがある場合を除き、利用契約期間満了日の１か月前までに当社と契約者の何れからも利用契約を終了させる旨の意思表示がない場合、同一条件にて更に12か月間延長されるものとし、その後も同様とします。
            </p>
            <h2 className={styles.title}>第12条（解約）</h2>
            <p>
              １．契約者は、利用契約期間中であっても、解約希望日の1か月前までに当社所定の解約方法に従って解約手続きを履行することにより、解約希望日をもって利用契約を終了させることができます。この場合、契約者は、利用契約の残期間の利用料金に相当する金額を当社が指定する日までに、当社に支払わなければなりません。
            </p>
            <p>
              ２．当社は、当社が本サービスの提供を終了する場合、契約者に１か月以上の猶予期間をもって通知することにより、利用契約を終了できるものとします。この場合、利用契約が終了したことにより契約者に生じた損害について、当社は一切の賠償責任を負わないものとします。
            </p>
            <h2 className={styles.title}>第13条（権利の譲渡等）</h2>
            <p>
              契約者は、当社の書面による事前の承諾なく、利用契約上の地位または利用契約に基づく権利もしくは義務の全部または一部につき、第三者に対し、譲渡、移転、担保設定その他の処分をすることはできません。
            </p>
            <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>
              第三章 本サービス
            </h1>
            <h2 className={styles.title}>第14条（本サービスの内容）</h2>
            <p>
              本サービスは、契約者のスケジュールを考慮した日程候補を契約者が指定する第三者（以下「予約者」といいます。）に送信し、当該第三者が当該日程候補について出欠の可否等を返信することにより、契約者と当該第三者との間でのスケジュール調整を可能とするシステムを提供するサービスです。なお、個々の契約者に対して提供する本サービスの具体的範囲及びその内容等については、契約者との間で別途定めるものとします。
            </p>
            <h2 className={styles.title}>第15条（ユーザーＩＤ）</h2>
            <p>
              １．ユーザーID
              は、当社が定める方法及び利用条件に基づいて、当社又は契約者自身が付与するものとします。
            </p>
            <p>
              ２．契約者は、自らの管理責任により、利用ユーザーのユーザーID
              を不正使用されないよう管理しなければなりません。
            </p>
            <p>
              ３．契約者は、いかなる場合も、ユーザーIDを第三者に開示、貸与することはできず、また一つのユーザーIDを複数人で使用させることはできません。
            </p>
            <p>
              ４．当社は、ユーザーID
              の不正使用によって契約者に生じた損害について一切の責任を負いません。
            </p>
            <p>
              ５．ユーザーIDの付与後に行われた本サービスの利用行為については、すべて契約者に帰属するものとみなされます。
            </p>
            <h2 className={styles.title}>第16条（利用停止）</h2>
            <p>
              １．当社は、メンテナンス等のために契約者に通知することなく、本サービスを停止することがあります。
            </p>
            <p>
              ２．当社は、次のいずれかに該当する場合には本サービスの利用を停止することがあります。
            </p>
            <ul>
              <li>
                （１）本サービスの利用料金その他の債務について、支払期日を経過してもなお支払いが確認できないとき
              </li>
              <li>
                （２）本サービスに係る申込に当たって事実に反する記載を行ったことが判明したとき
              </li>
              <li>
                （３）火災、停電、天災等の不可抗力により本サービスの全部または一部の継続が困難になるまたは困難になるおそれがあるとき
              </li>
              <li>
                （４）本サービスに関連するサーバーその他関連システムの異常、故障、障害その他本サービスの円滑な利用を妨げる事由が生じたとき
              </li>
              <li>（５）第１６条（禁止行為）に定める行為を行ったとき</li>
              <li>
                （６）その他運用上あるいは技術上の理由または不測の事態により当社が本サービスの停止が必要と判断したとき
              </li>
            </ul>
            <p>
              ３．当社は、本条の措置をとったことにより契約者に生じた損害について、一切の責任を負わないものとします。
            </p>
            <h2 className={styles.title}>第17条（免責）</h2>
            <p>
              １．当社は、本サービスの内容について、その完全性、正確性及び有効性等について、一切の保証をしません。また、当社は、本サービスに中断、中止その他の障害が生じないことを保証しません。
            </p>
            <p>
              ２．契約者が本サービスを利用するにあたり、本サービスから第三者が運営する他のサービス（以下「外部サービス」といいます。）に遷移する場合、契約者は、自らの責任と負担で外部サービスの利用規約等に同意の上、本サービス及び外部サービスを利用します。なお、当社は、外部サービスの内容について、その完全性、正確性及び有効性等について、一切の保証をしません。
            </p>
            <p>
              ３．契約者が登録情報の変更を行わなかったことにより損害を被った場合でも、当社は一切の責任を負いません。
            </p>
            <p>
              ４．契約者は、法令の範囲内で本サービスを利用しなければなりません。当社は、本サービスの利用に関連して契約者が日本又は外国の法令に触れた場合でも、一切の責任を負いません。
            </p>
            <p>
              ５．予期しない不正アクセス等の行為によって契約者情報を盗取された場合でも、それによって生じる契約者の損害等に対して、当社は一切の責任を負いません。
            </p>
            <p>
              ６．当社は、天災、地変、火災、ストライキ、通商停止、戦争、内乱、感染症の流行その他の不可抗力により本契約の全部又は一部に不履行が発生した場合、一切の責任を負いません。
            </p>
            <p>
              ７．本サービスの利用に関し、契約者が予約者その他第三者との間でトラブル（本サービス内外を問いません。）になった場合でも、当社は一切の責任を負わず、契約者間のトラブルは、契約者が自らの費用と負担において解決します。
            </p>
            <h2 className={styles.title}>第18条（禁止行為）</h2>
            <p>
              １．当社は、契約者による本サービスの利用に際して、以下の各号に定める行為を禁止します。
            </p>
            <ul>
              <li>（１）本規約に違反する行為</li>
              <li>
                （２）当社、当社がライセンスを受けているライセンサーその他第三者の知的財産権、特許権、実用新案権、意匠権、商標権、著作権、肖像権等の財産的又は人格的な権利を侵害する行為又はこれらを侵害するおそれのある行為
              </li>
              <li>
                （３）当社、予約者その他第三者に不利益若しくは損害を与える行為又はそのおそれのある行為
              </li>
              <li>
                （４）不当に他人の名誉や権利、信用を傷つける行為又はそのおそれのある行為
              </li>
              <li>（５）法令又は条例等に違反する行為</li>
              <li>
                （６）公序良俗に反する行為若しくはそのおそれのある行為又は公序良俗に反するおそれのある情報を他のユーザー又は第三者に提供する行為
              </li>
              <li>
                （７）犯罪行為、犯罪行為に結びつく行為若しくはこれを助長する行為又はそのおそれのある行為
              </li>
              <li>
                （８）事実に反する情報又は事実に反するおそれのある情報を提供する行為
              </li>
              <li>
                （９）当社のシステムへの不正アクセス、それに伴うプログラムコードの改ざん、位置情報の改ざん、故意に虚偽、通信機器の仕様その他アプリケーションを利用しての不正行為、コンピューターウィルスの頒布その他本サービスの正常な運営を妨げる行為又はそのおそれのある行為
              </li>
              <li>（10）反社会的勢力に利益を供与する行為</li>
              <li>
                （11）本サービスの信用を損なう行為又はそのおそれのある行為
              </li>
              <li>
                （12）青少年の心身及びその健全な育成に悪影響を及ぼすおそれのある行為
              </li>
              <li>
                （13）他のユーザーのアカウントの使用その他の方法により、第三者になりすまして本サービスを利用する行為
              </li>
              <li>
                （14）詐欺、預貯金口座及び携帯電話の違法な売買等の犯罪に結びつく又は結びつくおそれのある行為
              </li>
              <li>
                （15）犯罪収益に関する行為、テロ資金供与に関する行為又はその疑いがある行為
              </li>
              <li>（16）その他当社が不適当と判断する行為</li>
            </ul>
            <p>
              ２．当社は、ユーザーの行為が、第１項各号のいずれかに該当すると判断した場合、事前に通知することなく、以下の各号のいずれか又は全ての措置を講じることがで切るものとします。
            </p>
            <ul>
              <li>（１）本サービスの利用制限</li>
              <li>（２）本契約の解除</li>
              <li>（３）その他当社が必要と合理的に判断する行為</li>
            </ul>
            <h2 className={styles.title}>第19条（利用環境の整備等）</h2>
            <p>
              １．契約者は、自己の費用と責任において、本サービス利用のための環境（パソコン等の端末設備や通信環境を含みますが、これに限りません。）を整備し、維持するものとします。
            </p>
            <p>
              ２．当社は、前項の環境に不具合がある場合、契約者（利用ユーザーを含みます）に対して本サービスを提供する義務を負いません。
            </p>
            <h2 className={styles.title}>第20条（監督責任）</h2>
            <p>
              契約者は、本サービス利用に関して、利用ユーザーをして、本規約を遵守するよう監督し、利用ユーザーの意思表示、通知、その他一切の行為について、契約者としての責任を負います。
            </p>
            <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>
              第四章 利用料金等
            </h1>
            <h2 className={styles.title}>第21条（利用料金）</h2>
            <p>
              １．本サービスの利用料金は、利用契約において定めるものとします。
            </p>
            <p>
              ２．中途解約その他の理由による利用料金の減額は、一切できないものとします。
            </p>
            <p>
              ３．当社は、本サービスの利用料金に関わる租税公課に変更が生じたときには、本サービスの利用料金のうち当該租税公課に関する金額を変更することができるものとします。
            </p>
            <h2 className={styles.title}>第22条（請求・支払方法等）</h2>
            <p>
              １．本サービスの利用料金支払いの際には、利用する金融機関の定める規約に則る必要があります。なお、利用料金の支払い方法が振込よる場合、かかる振込手数料は契約者の負担とします。
            </p>
            <p>
              ２．当社は、利用料金、その他利用契約に基づく契約者に対する支払の請求及び弁済の受領行為を第三者に委託することができるものとします。
            </p>
            <p>
              ３．当社または前項に規定する第三者が、支払の請求及び弁済の受領行為を目的として契約者を訪問した場合、契約者は、当社または前項に規定する第三者が訪問に要した費用を支払うものとします。
            </p>
            <h1 style={{ textAlign: 'center', fontWeight: 'bold' }}>
              第五章 一般規定
            </h1>
            <h2 className={styles.title}>第23条（知的財産権）</h2>
            <p>
              契約者及び当社は、本サービスを構成する一切の発明、考案、意匠、著作物、商標に関する、特許権、実用新案権、意匠権、著作権（著作権法第２７条及び第２８条に規定する権利を含みます。）、商標権を含む一切の権利が当社に帰属することを確認します。
            </p>
            <h2 className={styles.title}>第24条（損害賠償）</h2>
            <p>
              １．契約者は、契約者または利用ユーザーの責に帰するべき事由により当社に損害を与えた場合、その損害（逸失利益及び合理的な弁護士費用を含みます。）を賠償するものとします。
            </p>
            <p>
              ２．当社が契約者に対して損害賠償責任を負う場合の賠償金額は、その事由の如何にかかわらず、本サービスの利用料金1か月分相当額を上限とします。ただし、利用者に生じた損害が当社の故意または重過失による場合は、かかる上限は適用されず、当社は、本規約に別段の定めがある場合を除き、通常損害（逸失利益及び合理的な弁護士費用を除きます。）について賠償します。
            </p>
            <p>
              ３．契約者は、本サービスにかかる利用料金その他利用契約に基づく金銭債務の支払いを遅滞した場合、当社に対し、支払期日の翌日から支払い済みに至るまで、年14.6％の割合による遅延損害金を支払わなければならないものとします。
            </p>
            <h2 className={styles.title}>第25条（反社会的勢力の排除）</h2>
            <p>
              １．当社及び契約者（これらの役員及び従業員を含む。以下本条において同じ。）は、それぞれ自己が以下の各号の一に該当しないこと及び今後もこれに該当する行為を行わないことを表明・保証し、相手方が各号の一に該当したとき、または該当していたことが判明したときは、別段の催告を要せず直ちに利用契約の全部または一部を解除することができるものとする。
            </p>
            <ul>
              <li>
                ①　暴力団、暴力団員、暴力団準構成員、暴力団関係団体、それらの関係者、その他、暴力、威力と詐欺的手法を駆使して経済的利益を追求する集団または個人、その他の反社会的勢力（以下「反社会的勢力」といいます。）であること。
              </li>
              <li>②　実質的に経営を支配する者が反社会的勢力であること。</li>
              <li>
                ③　親会社、子会社（いずれも会社法の定義による。以下同じ）または原契約等の履行のために再委託する第三者が前２号のいずれかに該当すること。
              </li>
            </ul>
            <p>
              ２．当社及び契約者は、相手方が本契約等の履行に関連して、以下の各号の一に該当したときは、別段の催告を要せず、直ちに利用契約の全部または一部を解除することができる。
            </p>
            <ul>
              <li>①　暴力的な要求行為をすること。</li>
              <li>②　法的な責任を超えた不当な要求行為をすること。</li>
              <li>③　脅迫的な言動をし、または暴力を用いる行為をすること。</li>
              <li>
                ④　風説を流布し、偽計を用いまたは威力を用いて相手方の信用・名誉を毀損し、または相手方の業務を妨害する行為をすること。
              </li>
              <li>⑤　第三者をして前４号の行為をさせること。</li>
              <li>
                ⑥　当社及び契約者または実質的に経営を支配する者が反社会的勢力への資金提供を行う等、その活動を助長する行為をすること。
              </li>
              <li>
                ⑦　親会社、子会社または原契約等の履行のために再委託する第三者が前５号のいずれかに該当する行為をすること。
              </li>
              <li>⑧　その他前各号に準ずる行為をすること。</li>
            </ul>
            <h2 className={styles.title}>第26条（解除）</h2>
            <p>
              １．当社は、契約者が次の各号に掲げる事由に該当する場合、契約者に何らの催告を要さず利用契約を直ちに解除することができるものとします。
            </p>
            <ul>
              <li>
                ①　利用契約上の債務の支払いを怠り、または怠るおそれがあることが明らかであるとき
              </li>
              <li>
                ②　違法に、または明らかに公序良俗に反する態様において本サービスを利用したとき
              </li>
              <li>
                ③　当社が提供するサービスを直接または間接に利用する者の当該利用に対し重大な支障を与える態様において、本サービスを利用したとき
              </li>
              <li>④　本規約に定める契約者の義務に違反したとき</li>
              <li>
                ⑤　契約者について、破産、会社更生、特別清算または民事再生に係る申立があったとき
              </li>
              <li>
                ⑥　その他当社が解除するについてやむを得ない事由があると判断したとき
              </li>
            </ul>
            <p>
              ２．契約者は、前項に従い利用契約を解除された場合、解除によって当社に生じた一切の損害を負担するものとします。
            </p>
            <h2 className={styles.title}>第27条（秘密保持）</h2>
            <p>
              １．契約者及び当社は、本サービスの提供または利用に関して知り得た相手方の秘密情報を、厳重かつ適正に管理するものとし、相手方の事前の書面による同意なく第三者に開示、提供及び漏洩し、または本サービスの提供もしくは利用の目的以外に使用してはならないものとします。なお、秘密情報とは、文書、電磁的データ、口頭その他形式の如何を問わず、又は秘密の表示若しくは明示又はその範囲の特定の有無にかかわらず、本サービスの利用に関連して開示された相手方の技術上、営業上又は経営上の情報をいいます。ただし、以下の各号の情報については秘密情報に含まれません。
            </p>
            <ul>
              <li>（１）開示を受けた時、既に所有していた情報</li>
              <li>
                （２）開示を受けた時、既に公知であった情報又はその後自己の責に帰さない事由により公知となった情報
              </li>
              <li>（３）開示を受けた後に、第三者から合法的に取得した情報</li>
              <li>
                （４）開示された秘密情報によらず独自に開発し又は創作した情報
              </li>
            </ul>
            <p>
              ２．契約者及び当社は、相手方の指示があった場合または利用契約が終了した場合は、相手方の指示に従い速やかに秘密情報を、現状に回復した上で返却または廃棄し、以後使用しないものとします。
            </p>
            <p>
              ３．当社は、当社の関連会社または委託先に契約者の秘密情報を開示した場合、当該関連会社及び委託先の当該秘密情報の取扱いについて一切の責任を負いません。
            </p>
            <p>
              ４．当社は、本サービスを提供する目的のために、契約者の秘密情報を利用することができます。
            </p>
            <p>
              ５．第1項の規定にかかわらず、当社は、法令、裁判所、行政庁または規制権限を有する公的機関の規則、裁判、命令、指示等により秘密情報の開示を要求される場合、必要な範囲で秘密情報を開示することができます。
            </p>
            <h2 className={styles.title}>第28条（個人情報の取扱い）</h2>
            <p>
              １．当社は、「個人情報の保護に関する法律」の趣旨に鑑み、契約者及び利用ユーザーの個人情報を善良なる管理者の注意をもって適切に管理します。なお、本規約において、「個人情報」とは、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日その他の記述等により特定の個人を識別することができるもの（他の情報と容易に照合することができ、それにより特定の個人を識別することができることとなるものを含みます。）をいいます。
            </p>
            <p>
              ２．本サービスの申込、利用契約のためにご提示いただいた個人情報については、次の各号に定める利用目的の達成に必要な範囲内で適正に取り扱います。
            </p>
            <ul>
              <li>
                （１）本サービス等に関する各種お問い合わせ、ご相談にお答えすること
              </li>
              <li>
                （２）本人確認、料金案内・請求、サービス提供条件変更案内、サービス停止・契約解除等の連絡、その他サービスの提供に関わるご案内を行うこと
              </li>
              <li>
                （３）電話、電子メール、郵送等による、当社または当社の提携会社が提供するサービスに関する販売推奨・アンケート調査
                及び景品等の送付を行うこと
              </li>
              <li>
                （４）当社サービスの改善または新サービス開発のためにご提示いただいた情報の分析を行うこと
              </li>
              <li>
                （５）当社または提携会社の商品、サービス及びキャンペーン等のアナウンスを行うこと
              </li>
            </ul>
            <p>
              ３．当社は、サービス提供に必要となる業務の実施に際し、業務委託先（当社の親会社、子会社及び関連会社を含みます。）に
              個人情報を提供する場合があります。その場合、個人情報保護が十分に図られている企業を選定し、個人情報保護の契約を締結する等、必要かつ適切な処置を実施致します。
            </p>
            <p>
              ４．当社は、個人情報を本人の同意を得ることなく、業務委託先以外の第三者に対して提供致しません。ただし、法令により定めがある事項（刑事訴訟法第１９７条第２項及び関税法第１１９条２項に基づく照会を含みますが、これに限定されません。）
              については、その定めるところによります。
            </p>
            <h2 className={styles.title}>第29条（残存条項）</h2>
            <p>
              利用契約の終了後も、第４条（本サービス内容の変更）第2項、第5条（本サービスの廃止）第2項、第8条（契約者情報）第3項、第12条（解約）第1項後段及び第2項後段、第13条（権利の譲渡等）、第15条（ユーザーID）第4項、第16条（利用停止）第3項、第17条（免責）、第20条（監督責任）、第21条（利用料金）第2項、第23条（知的財産権）、第24条（損害賠償）、第26条（解除）第2項、第27条（秘密保持）から第31条（管轄裁判所）までの規定は、有効に存続するものとする。ただし、第27条（秘密保持）については、利用契約終了後1年間有効とします。
            </p>
            <h2 className={styles.title}>第30条（準拠法）</h2>
            <p>
              本規約は、日本国法に準拠し、日本国法に基づき解釈されるものとします。
            </p>
            <h2 className={styles.title}>第31条（管轄裁判所）</h2>
            <p>
              利用契約に関連する訴訟は、その訴額に応じて、東京簡易裁判所または東京地方裁判所をもって第一審の専属的合意管轄裁判所とします。
            </p>
            <div className={styles.termOfUserFooter}>
              <p>附則</p>
              <p>2024年8月29日：施行</p>
            </div>
          </Row>
        </div>
      </Modal>
    </Spin>
  );
}

export default connect(({ MASTER }) => ({
  masterStore: MASTER,
}))(Register);
