// @ts-nocheck
import React from 'react';
import { ApplyPluginsType } from '/home/miichi/Desktop/PROJECTS/Smoothly/smoothly/node_modules/@umijs/preset-built-in/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';

export function getRoutes() {
  const routes = [
  {
    "path": "/",
    "component": require('@/pages/User').default,
    "wrappers": [require('@/components/CheckTrialAuthentication').default],
    "exact": true
  },
  {
    "path": "/appointment-selection",
    "component": require('@/pages/AppointmentSelection').default,
    "exact": true
  },
  {
    "path": "/appointment-selection-form",
    "component": require('@/pages/AppointmentSelectionForm').default,
    "exact": true
  },
  {
    "path": "/appointment-selection-completed",
    "component": require('@/pages/AppointmentSelectionConfirm').default,
    "exact": true
  },
  {
    "path": "/menu",
    "component": require('@/pages/Menu').default,
    "exact": true
  },
  {
    "path": "/share-calendar-google",
    "component": require('@/pages/ShareCalendarGoogle').default,
    "exact": true
  },
  {
    "path": "/share-calendar-microsoft",
    "component": require('@/pages/ShareCalendarMicrosoft').default,
    "exact": true
  },
  {
    "path": "/top",
    "component": require('@/pages/User').default,
    "wrappers": [require('@/components/CheckTrialAuthentication').default],
    "exact": true
  },
  {
    "path": "/appointment/:id",
    "component": require('@/pages/AppointmentDetail').default,
    "exact": true
  },
  {
    "path": "/past-appointment/:id",
    "component": require('@/pages/PastAppointmentDetail').default,
    "exact": true
  },
  {
    "path": "/past-appointment/:id/edit",
    "component": require('@/pages/EditAppointment').default,
    "exact": true
  },
  {
    "path": "/current-appointment/:id",
    "component": require('@/pages/CurrentAppointmentDetail').default,
    "exact": true
  },
  {
    "path": "/home",
    "component": require('@/pages/Home').default,
    "exact": true
  },
  {
    "path": "/profile/schedule-setting",
    "component": require('@/pages/SettingSchedule').default,
    "exact": true
  },
  {
    "path": "/profile",
    "component": require('@/pages/Profile').default,
    "wrappers": [require('@/components/Authentication').default],
    "exact": true
  },
  {
    "path": "/mail-template",
    "component": require('@/pages/MailTemplate').default,
    "exact": true
  },
  {
    "path": "/contact-management",
    "component": require('@/pages/SentMailManagement').default,
    "exact": true
  },
  {
    "path": "/profile/collaboration",
    "component": require('@/pages/Collaboration').default,
    "exact": true
  },
  {
    "path": "/setting-url",
    "component": require('@/pages/User').default,
    "wrappers": [require('@/components/Authentication').default],
    "exact": true
  },
  {
    "path": "/schedule-time",
    "component": require('@/pages/User').default,
    "wrappers": [require('@/components/CheckTrialAuthentication').default],
    "exact": true
  },
  {
    "path": "/event",
    "component": require('@/pages/User').default,
    "wrappers": [require('@/components/CheckTrialAuthentication').default],
    "exact": true
  },
  {
    "path": "/schedule-adjustment",
    "component": require('@/pages/User').default,
    "exact": true
  },
  {
    "path": "/schedule-adjustment/many",
    "component": require('@/pages/User').default,
    "exact": true
  },
  {
    "path": "/schedule-adjustment/once",
    "component": require('@/pages/User').default,
    "exact": true
  },
  {
    "path": "/schedule-adjustment-step-3",
    "component": require('@/pages/User').default,
    "wrappers": [require('@/components/CheckTrialAuthentication').default],
    "exact": true
  },
  {
    "path": "/calendar-creation",
    "component": require('@/pages/User').default,
    "wrappers": [require('@/components/CheckTrialAuthentication').default],
    "exact": true
  },
  {
    "path": "/calendar-creation-success",
    "component": require('@/pages/User').default,
    "exact": true
  },
  {
    "path": "/setting-time",
    "component": require('@/pages/User').default,
    "wrappers": [require('@/components/CheckTrialAuthentication').default],
    "exact": true
  },
  {
    "path": "/advanced-setting",
    "component": require('@/pages/User').default,
    "wrappers": [require('@/components/CheckTrialAuthentication').default],
    "exact": true
  },
  {
    "path": "/signup",
    "component": require('@/pages/User').default,
    "exact": true
  },
  {
    "path": "/payment",
    "component": require('@/pages/User').default,
    "wrappers": [require('@/components/Authentication').default],
    "exact": true
  },
  {
    "path": "/add-member",
    "component": require('@/pages/User').default,
    "wrappers": [require('@/components/CheckTrialAuthentication').default],
    "exact": true
  },
  {
    "path": "/login",
    "component": require('@/pages/User').default,
    "exact": true
  },
  {
    "path": "/register",
    "component": require('@/pages/User').default,
    "exact": true
  },
  {
    "path": "/get-code-microsoft",
    "component": require('@/pages/GetCodeMicrosoft').default,
    "exact": true
  },
  {
    "path": "/registration",
    "component": require('@/pages/Registration').default,
    "exact": true
  },
  {
    "path": "/user_connections",
    "component": require('@/pages/UserConnections').default,
    "exact": true
  },
  {
    "path": "/create-team",
    "component": require('@/pages/User').default,
    "wrappers": [require('@/components/CheckTrialAuthentication').default],
    "exact": true
  },
  {
    "path": "/invite-member",
    "component": require('@/pages/User').default,
    "wrappers": [require('@/components/CheckTrialAuthentication').default],
    "exact": true
  },
  {
    "path": "/vote",
    "component": require('@/pages/User').default,
    "exact": true
  },
  {
    "path": "/setting-template",
    "component": require('@/pages/SettingTemplate').default,
    "exact": true
  },
  {
    "path": "/button-embed",
    "component": require('@/pages/ButtonEmbed').default,
    "exact": true
  },
  {
    "path": "/booking-calendar",
    "component": require('@/pages/BookCalendarEmbed').default,
    "exact": true
  },
  {
    "path": "/view-template",
    "component": require('@/pages/User').default,
    "exact": true
  },
  {
    "path": "/view-answers",
    "component": require('@/pages/User').default,
    "exact": true
  },
  {
    "path": "/account-status",
    "component": require('@/pages/AccountStatus').default,
    "wrappers": [require('@/components/CheckTrialAuthentication').default],
    "exact": true
  },
  {
    "path": "/cancel-booking",
    "component": require('@/pages/EventManage/listEvent/CancelBooking').default,
    "exact": true
  },
  {
    "path": "/cancel-booking-complete",
    "component": require('@/pages/EventManage/listEvent/CancelBooking/CancelBookingComplete').default,
    "exact": true
  },
  {
    "path": "/link-already-used",
    "component": require('@/pages/LinkAlreadyUsed').default,
    "exact": true
  },
  {
    "path": "/zoom-login-success",
    "component": require('@/pages/LoginZoomSuccess').default,
    "exact": true
  },
  {
    "path": "/invalid-url",
    "component": require('@/pages/InvalidURL').default,
    "exact": true
  },
  {
    "path": "/google-meet-login-success",
    "component": require('@/pages/LoginGoogleMeetSuccess').default,
    "exact": true
  },
  {
    "path": "/msteam-login-success",
    "component": require('@/pages/LoginMSTeamSuccess').default,
    "exact": true
  },
  {
    "path": "/term-of-user",
    "component": require('@/pages/TermOfUser').default,
    "exact": true
  },
  {
    "path": "/privacy-policy",
    "component": require('@/pages/PrivacyPolicy').default,
    "exact": true
  },
  {
    "path": "/base-notation",
    "component": require('@/pages/BaseNotation').default,
    "exact": true
  },
  {
    "path": "/smooth-login",
    "component": require('@/pages/SmoothLogin').default,
    "exact": true
  },
  {
    "path": "/confirm-register",
    "component": require('@/pages/ConfirmRegister').default,
    "exact": true
  },
  {
    "path": "/forgot-password",
    "component": require('@/pages/Mobile/ForgotPassword').default,
    "exact": true
  },
  {
    "path": "/password-register",
    "component": require('@/pages/Mobile/PasswordRegister').default,
    "exact": true
  },
  {
    "path": "/change-password",
    "component": require('@/pages/ChangePassword').default,
    "exact": true
  },
  {
    "path": "/reset-password",
    "component": require('@/pages/ChangePassword').default,
    "exact": true
  },
  {
    "path": "/zoom-meet",
    "component": require('@/pages/ZoomMeet').default,
    "wrappers": [require('@/components/CheckTrialAuthentication').default],
    "exact": true
  },
  {
    "path": "/update-card",
    "component": require('@/pages/UpdateCard').default,
    "wrappers": [require('@/components/CheckTrialAuthentication').default],
    "exact": true
  },
  {
    "path": "/preview",
    "component": require('@/pages/Preview').default,
    "wrappers": [require('@/components/CheckTrialAuthentication').default],
    "exact": true
  },
  {
    "path": "/preview-vote",
    "component": require('@/pages/Vote').default,
    "wrappers": [require('@/components/CheckTrialAuthentication').default],
    "exact": true
  },
  {
    "path": "/qa",
    "component": require('@/pages/QA').default,
    "exact": true
  },
  {
    "path": "/send-contact-email",
    "component": require('@/pages/SendContactEmail').default,
    "exact": true
  },
  {
    "path": "/expired-free",
    "component": require('@/pages/ExpiredFree').default,
    "wrappers": [require('@/components/Authentication').default],
    "exact": true
  },
  {
    "path": "/contract-detail",
    "component": require('@/pages/ContractDetail').default,
    "wrappers": [require('@/components/Authentication').default],
    "exact": true
  },
  {
    "path": "/event-template",
    "component": require('@/pages/EventTemplate').default,
    "wrappers": [require('@/components/CheckTrialAuthentication').default],
    "exact": true
  },
  {
    "path": "/calendar",
    "component": require('@/pages/Mobile/Calendar').default,
    "wrappers": [require('@/components/CheckTrialAuthentication').default],
    "exact": true
  },
  {
    "path": "/create-calendar",
    "component": require('@/pages/Mobile/CalendarCreation').default,
    "wrappers": [require('@/components/CheckTrialAuthentication').default],
    "exact": true
  },
  {
    "path": "/invite-participant",
    "component": require('@/pages/Mobile/InviteParticipant').default,
    "wrappers": [require('@/components/CheckTrialAuthentication').default],
    "exact": true
  },
  {
    "path": "/documentation",
    "component": require('@/pages/Documentation').default,
    "exact": true
  },
  {
    "path": "/support",
    "component": require('@/pages/Support').default,
    "exact": true
  },
  {
    "path": "/connected-google-calendar",
    "component": require('@/pages/ConnectedGoogleCalendar').default,
    "exact": true
  },
  {
    "path": "/connected-microsoft-365",
    "component": require('@/pages/ConnectedMicrosoft365').default,
    "exact": true
  },
  {
    "path": "/:id",
    "component": require('@/pages/DefaultURL').default,
    "exact": true
  },
  {
    "path": "/admin/login",
    "component": require('@/admin/pages/LoginAdmin').default,
    "exact": true
  },
  {
    "path": "/admin/accounts",
    "component": require('@/admin/components/AdminLayout').default,
    "exact": true
  },
  {
    "path": "/admin/add-new-account",
    "component": require('@/admin/components/AdminLayout').default,
    "exact": true
  },
  {
    "path": "/admin/add-new-agency",
    "component": require('@/admin/components/AdminLayout').default,
    "exact": true
  },
  {
    "path": "/admin/list-agency",
    "component": require('@/admin/components/AdminLayout').default,
    "exact": true
  },
  {
    "path": "/docs/:id",
    "component": require('@/pages/Documents').default,
    "exact": true
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}
