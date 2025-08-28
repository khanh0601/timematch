import React, { useEffect, useState } from 'react';
import { withRouter } from 'umi';
import Header from '@/components/Header';
import SettingUrl from '../SettingUrl';
import ScheduleTime from '../ScheduleTime';
import EventManage from '../EventManage';
import ScheduleAdjustment from '../ScheduleAdjustment';
import CalendarCreation from '../CalendarCreation';
import DetailSetting from '../DetailSetting';
import AddMember from '../AddMember';
import AddMemberComplete from '../AddMember/AddMemberComplete';
import ConfirmContractDetail from '../ConfirmContractDetail';
import Signup from '../Signup';
import Login from '@/pages/Mobile/Login';
import Register from '@/pages/Mobile/Register';
import styles from './styles.less';
import ContractConfirm from '../ContractConfirm';
import Payment from '../Payment';
import { getCookie } from '@/commons/function.js';
import { Redirect } from 'umi';
import AccountStatus from '../AccountStatus';
import CancelBooking from '../EventManage/listEvent/CancelBooking';
import PaymentComplete from '../Payment/PaymentComplete';
import CancelBookingComplete from '../EventManage/listEvent/CancelBooking/CancelBookingComplete';
import CreateContractComplete from '../Payment/Invoice/InvoiceComplete';
import LinkAlreadyUsed from '../LinkAlreadyUsed';
import LoginZoomSuccess from '../LoginZoomSuccess';
import InvalidURL from '../InvalidURL';
import LoginGoogleMeetSuccess from '../LoginGoogleMeetSuccess';
import TermOfUser from '../TermOfUser';
import Home from '../Home';
import PrivacyPolicy from '../PrivacyPolicy';
import SmoothLogin from '../SmoothLogin';
import ConfirmRegister from '../ConfirmRegister';
import ForgotPassword from '../ForgotPassword';
import ChangePassword from '../ChangePassword';
import Profile from '../Profile';
import ZoomMeet from '../ZoomMeet';
import Preview from '../Preview';
import UpdateCard from '../UpdateCard';
import EventTemplate from '../EventTemplate';
import Documentation from '../Documentation';
import ContractDetail from '../ContractDetail';
import CreateTeam from '../CreateTeam';
import Vote from '../Vote';
import InviteMember from '../InviteMember';
import Documents from '../Documents';
import { ROLE_MEMBER } from '@/constant';
import ConnectedGoogleCalendar from '../ConnectedGoogleCalendar';
import QA from '../QA';
import SendContactEmail from '../SendContactEmail';
import ExpiredFree from '../ExpiredFree';
import config from '@/config';
import LoginMSTeamSuccess from '../LoginMSTeamSuccess';
import ConnectedMicrosoft365 from '../ConnectedMicrosoft365';
import CalendarCreationCopy from '../CalendarCreationCopy';
import SettingTemplate from '../SettingTemplate';
import ViewTemplate from '../ViewTemplate';
import BookCalendarEmbed from '../BookCalendarEmbed';
import ViewAnswers from '../ViewAnswers';
import HeaderV2 from '../../components/HeaderV2';
import HeaderMobile from '@/components/Mobile/Header';
import CalendarMobile from '@/pages/Mobile/Calendar';
import CreateCalendar from '@/pages/Mobile/CalendarCreation';
import { useIntl } from 'umi';
import TopPage from '@/pages/Top';
import { ClientApplication } from '@azure/msal-browser/dist/app/ClientApplication';
import AppointmentDetail from '@/pages/AppointmentDetail';
import InviteParticipant from '../Mobile/InviteParticipant';

function UserPage(props) {
  const { location } = props;
  const isLogin = getCookie('token');
  const intl = useIntl();
  const { formatMessage } = intl;
  let profile = JSON.parse(localStorage.getItem('profile'));
  const [createEventType, setCreateEventType] = useState(false);
  const [hideHeader, setHideHeader] = useState(false);
  const [headerLogin, setHeaderLogin] = useState(false);
  const [cssCalendar, setCssCalendar] = useState(false);
  // hide page copy url
  const [cssCalendarCreationCopy, setCssCalendarCopy] = useState(false);
  const [checkDevice, setCheckDevice] = useState(false);
  const [checkChrome, setCheckChrome] = useState(false);
  const [checkFirefox, setCheckFirefox] = useState(false);
  const [notMac, setNotMac] = useState(false);
  const [checkFirefoxNotMac, setCheckFirefoxNotMac] = useState(false);
  const [headerGuest, setHeaderGuest] = useState(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // useEffect(() => {
  //   if (location.pathname === '/calendar-creation') {
  //     setCreateEventType(true);
  //   } else {
  //     setCreateEventType(false);
  //   }
  // }, []);

  useEffect(() => {
    const arrUrlAdjustment = [
      '/schedule-adjustment',
      '/schedule-adjustment/once',
      '/schedule-adjustment/many',
      '/preview',
      '/preview-vote',
      '/vote',
    ];
    if (arrUrlAdjustment.includes(location.pathname)) {
      setHideHeader(true);
    } else {
      setHideHeader(false);
    }

    const guestUrl = ['/login', '/register', '/forgot-password'];

    if (guestUrl.includes(location.pathname)) {
      setHeaderGuest(true);
    } else {
      setHeaderGuest(false);
    }

    if (location.pathname === '/event') {
      setHideHeader(true);
    }
  }, []);

  useEffect(() => {
    const arrUrlAdjustment = ['/calendar-creation'];
    if (arrUrlAdjustment.includes(location.pathname)) {
      setCssCalendar(true);
    } else {
      setCssCalendar(false);
    }
    // hide page copy url
    const arrUrlCreation = ['/calendar-creation-success'];
    if (arrUrlCreation.includes(location.pathname)) {
      setCssCalendarCopy(true);
    } else {
      setCssCalendarCopy(false);
    }
  }, []);

  //detect device
  // Safari 3.0+ "[object HTMLElementConstructor]"
  // const isSafari =
  //   /constructor/i.test(window.HTMLElement) ||
  //   (function(p) {
  //     return p.toString() === '[object SafariRemoteNotification]';
  //   })(
  //     !window['safari'] ||
  //       (typeof safari !== 'undefined' && safari.pushNotification),
  //   );
  // // Chrome 1 - 71
  // const isChrome =
  //   !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
  // // Firefox 1.0+
  // const isFirefox = typeof InstallTrigger !== 'undefined';
  useEffect(() => {
    const device = navigator.userAgent.toLowerCase();
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    if (device.indexOf('firefox') > -1 && !isMac) {
      setCheckFirefoxNotMac(true);
    }
    if (isMac) {
      // add class for chrome in macos
      if (device.indexOf('chrome') > -1) {
        setCheckChrome(true);
      }
      // add class for firefox in macos
      if (device.indexOf('firefox') > -1) {
        setCheckFirefox(true);
      }
      if (device.indexOf('safari') > -1) {
        setCheckDevice(true);
      }
    } else {
      setNotMac(true);
    }
  }, []);

  if (window.location.hostname === config.ADMIN_HOSTNAME) {
    return <Redirect to="/admin/accounts" />;
  }

  if (location.pathname === '/booking-calendar') {
    return <BookCalendarEmbed />;
  }

  const switchHeader = () => {
    const { pathname } = location;
    if (['/', '/top'].includes(pathname)) {
      return (
        <></>
        // <HeaderV2
        //   createEventType={createEventType}
        //   hideHeader={hideHeader}
        //   cssCalendar={cssCalendar}
        //   // hide page copy url
        //   cssCalendarCreationCopy={cssCalendarCreationCopy}
        //   headerLogin={headerLogin}
        // />
      );
    }
    if (['/login', '/register', '/forgot-password'].includes(pathname)) {
      let title = '';
      let isShowBack = false;
      if (pathname === '/login') {
        title = formatMessage({ id: 'i18n_btn_login' });
      } else if (pathname === '/register') {
        title = formatMessage({ id: 'i18n_register_as_new_member' });
        isShowBack = true;
      } else if (pathname === '/forgot-password') {
        title = formatMessage({ id: 'i18n_password_register_title' });
      }
      return (
        <HeaderMobile
          createEventType={createEventType}
          title={title}
          hideHeader={hideHeader}
          headerGuest={headerGuest}
          isShowBack={isShowBack}
        />
      );
    }
    if (
      ![
        '/calendar',
        '/create-calendar',
        '/invite-participant',
        '/profile',
      ].includes(pathname)
    ) {
      return (
        <Header
          createEventType={createEventType}
          hideHeader={hideHeader}
          cssCalendar={cssCalendar}
          // hide page copy url
          cssCalendarCreationCopy={cssCalendarCreationCopy}
          headerLogin={headerLogin}
        />
      );
    }
  };

  return location.pathname === '/home' ? (
    <Home />
  ) : (
    <div
      className={`${styles.layout} ${checkDevice ? styles.safari : ''} ${
        checkChrome ? styles.chrome : ''
      } ${checkFirefoxNotMac ? styles.firefox : ''}`}
    >
      {switchHeader()}

      {location.pathname === '/qa' && <QA />}
      {location.pathname === '/event-template' && <EventTemplate />}
      {location.pathname === '/preview' && <Preview />}
      {location.pathname === '/preview-vote' && <Vote />}
      {location.pathname === '/' && <TopPage />}
      {location.pathname === '/term-of-user' && <TermOfUser />}
      {location.pathname === '/privacy-policy' && <PrivacyPolicy />}
      {location.pathname === '/invalid-url' && <InvalidURL />}
      {location.pathname === '/link-already-used' && <LinkAlreadyUsed />}
      {location.pathname === '/setting-url' && <SettingUrl />}
      {location.pathname === '/schedule-time' && <ScheduleTime />}
      {location.pathname === '/event' && <EventManage />}
      {location.pathname === '/send-contact-email' && <SendContactEmail />}
      {(location.pathname === '/schedule-adjustment' ||
        location.pathname === '/schedule-adjustment/many' ||
        location.pathname === '/schedule-adjustment/once') && (
        <ScheduleAdjustment />
      )}
      {location.pathname === '/cancel-booking' && <CancelBooking />}
      {location.pathname === '/zoom-login-success' && <LoginZoomSuccess />}
      {location.pathname === '/google-meet-login-success' && (
        <LoginGoogleMeetSuccess />
      )}
      {location.pathname === '/msteam-login-success' && <LoginMSTeamSuccess />}

      {location.pathname === '/account-status' && <AccountStatus />}
      {location.pathname === '/calendar-creation' && <CalendarCreation />}
      {location.pathname === '/calendar-creation-success' && (
        <CalendarCreationCopy />
      )}
      {/*{location.pathname === '/calendar-creation-copy' && (*/}
      {/*  <CalendarCreationCopy />*/}
      {/*)}*/}
      {location.pathname === '/setting-time' && <DetailSetting />}
      {location.pathname === '/signup' && <Signup />}
      {location.pathname === '/contract-confirm' && <ContractConfirm />}
      {location.pathname === '/payment' &&
        profile.connection_role !== ROLE_MEMBER && <Payment />}
      {location.pathname === '/add-member' &&
        profile.connection_role !== ROLE_MEMBER && <AddMember />}
      {location.pathname === '/payment-complete' && <PaymentComplete />}
      {location.pathname === '/cancel-booking-complete' && (
        <CancelBookingComplete />
      )}
      {location.pathname === '/add-member-complete' && <AddMemberComplete />}
      {location.pathname === '/create-contract-complete' && (
        <CreateContractComplete />
      )}
      {location.pathname === '/confirm-contract-detail' && (
        <ConfirmContractDetail />
      )}
      {location.pathname === '/smooth-login' && <SmoothLogin />}
      {location.pathname === '/confirm-register' && <ConfirmRegister />}
      {location.pathname === '/forgot-password' && <ForgotPassword />}
      {location.pathname === '/change-password' && <ChangePassword />}
      {location.pathname === '/profile' && <Profile />}
      {location.pathname === '/zoom-meet' && <ZoomMeet />}
      {location.pathname === '/update-card' && <UpdateCard />}
      {location.pathname === '/documentation' && <Documentation />}
      {location.pathname === '/support' && <Documentation />}
      {location.pathname === '/expired-free' && <ExpiredFree />}
      {location.pathname === '/contract-detail' &&
        profile.connection_role !== ROLE_MEMBER && <ContractDetail />}
      {location.pathname === '/connected-google-calendar' && (
        <ConnectedGoogleCalendar />
      )}
      {location.pathname === '/connected-microsoft-365' && (
        <ConnectedMicrosoft365 />
      )}
      {location.pathname === '/create-team' && <CreateTeam />}
      {location.pathname === '/vote' && <Vote />}
      {location.pathname === '/invite-member' && <InviteMember />}
      {location.pathname === '/docs/:id' && <Documents />}
      {/*{location.pathname === '/setting-template' && <SettingTemplate />}*/}
      {location.pathname === '/view-template' && <ViewTemplate />}

      {location.pathname === '/view-answers' && <ViewAnswers />}
      {location.pathname === '/calendar' && <CalendarMobile />}
      {location.pathname === '/create-calendar' && <CreateCalendar />}
      {location.pathname === '/top' && <TopPage />}
      {location.pathname === '/appointment/:id' && <AppointmentDetail />}
      {location.pathname === '/invite-participant' && <InviteParticipant />}
      {location.pathname === '/login' ? (
        !isLogin ? (
          <Login />
        ) : (
          <Redirect to={'/'} />
        )
      ) : (
        <></>
      )}
      {location.pathname === '/register' ? (
        !isLogin ? (
          <Register />
        ) : (
          <Redirect to={'/'} />
        )
      ) : (
        <></>
      )}

      {/* <Layout className={styles.mainLayout}>
        <div className={styles.mainContent}>
        </div>
      </Layout> */}
    </div>
  );
}

export default withRouter(UserPage);
