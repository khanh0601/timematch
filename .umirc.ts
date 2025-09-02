import { defineConfig } from 'umi';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [
    {
      path: '/',
      component: '@/pages/User',
      wrappers: ['@/components/CheckTrialAuthentication'],
    },
    {
      path: '/appointment-selection',
      component: '@/pages/AppointmentSelection',
    },
    {
      path: '/appointment-selection-form',
      component: '@/pages/AppointmentSelectionForm',
    },
    {
      path: '/appointment-selection-completed',
      component: '@/pages/AppointmentSelectionConfirm',
    },
    {
      path: '/menu',
      component: '@/pages/Menu',
    },
    {
      path: '/share-calendar-google',
      component: '@/pages/ShareCalendarGoogle',
    },
    {
      path: '/share-calendar-microsoft',
      component: '@/pages/ShareCalendarMicrosoft',
    },
    {
      path: '/top',
      component: '@/pages/User',
      wrappers: ['@/components/CheckTrialAuthentication'],
    },
    {
      path: '/appointment/:id',
      component: '@/pages/AppointmentDetail',
      exact: true,
    },
    {
      path: '/past-appointment/:id',
      component: '@/pages/PastAppointmentDetail',
      exact: true,
    },
    {
      path: '/past-appointment/:id/edit',
      component: '@/pages/EditAppointment',
      exact: true,
    },
    {
      path: '/current-appointment/:id',
      component: '@/pages/CurrentAppointmentDetail',
      exact: true,
    },
    {
      path: '/home',
      component: '@/pages/Home',
    },
    {
      path: '/profile/schedule-setting',
      component: '@/pages/SettingSchedule',
      exact: true,
    },
    {
      path: '/profile',
      component: '@/pages/Profile',
      wrappers: ['@/components/Authentication'],
    },
    {
      path: 'mail-template',
      component: '@/pages/MailTemplate',
    },
    {
      path: 'contact-management',
      component: '@/pages/SentMailManagement',
    },
    {
      path: '/profile/collaboration',
      component: '@/pages/Collaboration',
    },
    {
      path: '/setting-url',
      component: '@/pages/User',
      wrappers: ['@/components/Authentication'],
    },
    {
      path: '/schedule-time',
      component: '@/pages/User',
      wrappers: ['@/components/CheckTrialAuthentication'],
    },
    {
      path: '/event',
      component: '@/pages/User',
      wrappers: ['@/components/CheckTrialAuthentication'],
    },
    {
      path: '/schedule-adjustment',
      component: '@/pages/User',
    },
    {
      path: '/schedule-adjustment/many',
      component: '@/pages/User',
    },
    {
      path: '/schedule-adjustment/once',
      component: '@/pages/User',
    },
    {
      path: '/schedule-adjustment-step-3',
      component: '@/pages/User',
      wrappers: ['@/components/CheckTrialAuthentication'],
    },
    {
      path: '/calendar-creation',
      component: '@/pages/User',
      wrappers: ['@/components/CheckTrialAuthentication'],
    },
    {
      path: '/calendar/:id',
      component: '@/pages/Mobile/CalendarEdit',
      exact: true,
    },
    // hide page copy url
    // {
    //   path: '/calendar-creation-copy',
    //   component: '@/pages/User',
    //   wrappers: ['@/components/CheckTrialAuthentication'],
    // },
    {
      path: '/calendar-creation-success',
      component: '@/pages/User',
    },
    {
      path: '/setting-time',
      component: '@/pages/User',
      wrappers: ['@/components/CheckTrialAuthentication'],
    },
    {
      path: '/advanced-setting',
      component: '@/pages/User',
      wrappers: ['@/components/CheckTrialAuthentication'],
    },
    {
      path: '/signup',
      component: '@/pages/User',
    },
    {
      path: '/payment',
      component: '@/pages/User',
      wrappers: ['@/components/Authentication'],
    },
    {
      path: '/add-member',
      component: '@/pages/User',
      wrappers: ['@/components/CheckTrialAuthentication'],
    },
    { path: '/login', component: '@/pages/Mobile/Login' },
    { path: '/register', component: '@/pages/Mobile/Register' },
    { path: '/get-code-microsoft', component: '@/pages/GetCodeMicrosoft' },
    { path: '/registration', component: '@/pages/Registration' },
    {
      path: '/user_connections',
      component: '@/pages/UserConnections',
    },
    {
      path: '/create-team',
      component: '@/pages/User',
      wrappers: ['@/components/CheckTrialAuthentication'],
    },
    {
      path: '/invite-member',
      component: '@/pages/User',
      wrappers: ['@/components/CheckTrialAuthentication'],
    },
    {
      path: '/vote',
      component: '@/pages/User',
    },
    {
      path: '/setting-template',
      component: '@/pages/SettingTemplate',
    },
    {
      path: '/button-embed',
      component: '@/pages/ButtonEmbed',
    },
    {
      path: '/booking-calendar',
      component: '@/pages/BookCalendarEmbed',
    },
    {
      path: '/view-template',
      component: '@/pages/User',
    },
    {
      path: '/view-answers',
      component: '@/pages/User',
    },
    {
      path: '/account-status',
      component: '@/pages/AccountStatus',
      wrappers: ['@/components/CheckTrialAuthentication'],
    },
    {
      path: '/cancel-booking',
      component: '@/pages/EventManage/listEvent/CancelBooking',
    },
    {
      path: '/cancel-booking-complete',
      component:
        '@/pages/EventManage/listEvent/CancelBooking/CancelBookingComplete',
    },
    {
      path: '/link-already-used',
      component: '@/pages/LinkAlreadyUsed',
    },
    {
      path: '/zoom-login-success',
      component: '@/pages/LoginZoomSuccess',
    },
    {
      path: '/invalid-url',
      component: '@/pages/InvalidURL',
    },
    {
      path: '/google-meet-login-success',
      component: '@/pages/LoginGoogleMeetSuccess',
    },
    {
      path: '/msteam-login-success',
      component: '@/pages/LoginMSTeamSuccess',
    },
    {
      path: '/term-of-user',
      component: '@/pages/TermOfUser',
    },
    {
      path: '/privacy-policy',
      component: '@/pages/PrivacyPolicy',
    },
    // {
    //   path: '/base-notation',
    //   component: '@/pages/BaseNotation',
    // },
    {
      path: '/smooth-login',
      component: '@/pages/SmoothLogin',
    },
    {
      path: '/confirm-register',
      component: '@/pages/ConfirmRegister',
    },
    {
      path: '/forgot-password',
      component: '@/pages/Mobile/ForgotPassword',
    },
    {
      path: '/password-register',
      component: '@/pages/Mobile/PasswordRegister',
    },
    {
      path: '/change-password',
      component: '@/pages/ChangePassword',
    },
    {
      path: '/reset-password',
      component: '@/pages/Mobile/ResetPassword',
    },
    {
      path: '/zoom-meet',
      component: '@/pages/ZoomMeet',
      wrappers: ['@/components/CheckTrialAuthentication'],
    },
    {
      path: '/update-card',
      component: '@/pages/UpdateCard',
      wrappers: ['@/components/CheckTrialAuthentication'],
    },
    {
      path: '/preview',
      component: '@/pages/Preview',
      wrappers: ['@/components/CheckTrialAuthentication'],
    },
    {
      path: '/preview-vote',
      component: '@/pages/Vote',
      wrappers: ['@/components/CheckTrialAuthentication'],
    },
    {
      path: '/qa',
      component: '@/pages/QA',
    },
    {
      path: '/send-contact-email',
      component: '@/pages/SendContactEmail',
    },
    {
      path: '/expired-free',
      component: '@/pages/ExpiredFree',
      wrappers: ['@/components/Authentication'],
    },
    {
      path: '/contract-detail',
      component: '@/pages/ContractDetail',
      wrappers: ['@/components/Authentication'],
    },
    {
      path: '/event-template',
      component: '@/pages/EventTemplate',
      wrappers: ['@/components/CheckTrialAuthentication'],
    },
    {
      path: '/calendar',
      component: '@/pages/Mobile/Calendar',
      wrappers: ['@/components/CheckTrialAuthentication'],
    },
    {
      path: '/pc/calendar',
      component: '@/pages/CalendarPC',
      // wrappers: ['@/components/CheckTrialAuthentication'],
    },
    {
      path: '/create-calendar',
      component: '@/pages/Mobile/CalendarCreation',
      wrappers: ['@/components/CheckTrialAuthentication'],
    },
    {
      path: '/pc/create-calendar',
      component: '@/pages/CreateNewCalendar',
      // wrappers: ['@/components/CheckTrialAuthentication'],
    },
    {
      path: '/invite-participant',
      component: '@/pages/Mobile/InviteParticipant',
      wrappers: ['@/components/CheckTrialAuthentication'],
    },
    {
      path: '/documentation',
      component: '@/pages/Documentation',
    },
    {
      path: '/support',
      component: '@/pages/Support',
    },
    {
      path: '/connected-google-calendar',
      component: '@/pages/ConnectedGoogleCalendar',
    },
    {
      path: '/connected-microsoft-365',
      component: '@/pages/ConnectedMicrosoft365',
    },
    {
      path: '/:id',
      component: '@/pages/DefaultURL',
    },

    //admin routes
    { path: '/admin/login', component: '@/admin/pages/LoginAdmin' },
    {
      path: '/admin/accounts',
      component: '@/admin/components/AdminLayout',
    },
    {
      path: '/admin/add-new-account',
      component: '@/admin/components/AdminLayout',
    },
    {
      path: '/admin/add-new-agency',
      component: '@/admin/components/AdminLayout',
    },
    {
      path: '/admin/list-agency',
      component: '@/admin/components/AdminLayout',
    },
    {
      path: '/docs/:id',
      component: '@/pages/Documents',
      exact: true,
    },
  ],
  locale: {
    default: 'ja-JP',
  },
});
