const dayInWeek = [
  {
    value: '日',
    numberAdd: 0,
  },
  {
    value: '月',
    numberAdd: 1,
  },
  {
    value: '火',
    numberAdd: 2,
  },
  {
    value: '水',
    numberAdd: 3,
  },
  {
    value: '木',
    numberAdd: 4,
  },
  {
    value: '金',
    numberAdd: 5,
  },
  {
    value: '土',
    numberAdd: 6,
  },
];
const FULLCALENDAR_EVENT_DATE = 'YYYY-MM-DDTHH:mm';
const YYYYMMDDTHHmm = 'YYYY-MM-DDTHH:mm';
const YYYYMMDD = 'YYYY-MM-DD';
const FORMAT_DATE_STANDARD = 'DD-MM-YYYY';
const HOUR_FORMAT = 'HH:mm';
const FULL_HOUR_FORMAT = 'HH:mm';
const HOUR_SEC_FORMAT = 'HH:mm:ss';
const FULL_DATE_HOUR = 'YYYY-MM-DDTHH:mm';
const ADMIN_FULL_DATE_HOUR = 'YYYY-MM-DD HH:mm';
const FORMAT_YYYY = 'YYYY';
const FORMAT_MM = 'MM';
const FORMAT_DD = 'DD';
const FORMAT_DATE = 'YYYY-MM-DD';
const FORMAT_HH = 'HH';
const FORMAT_mm = 'mm';
const FORMAT_D = 'D';
const FORMAT_M = 'M';
const DOW_NAME = [
  {
    name_jp: '日',
  },
  {
    name_jp: '月',
  },
  {
    name_jp: '火',
  },
  {
    name_jp: '水',
  },
  {
    name_jp: '木',
  },
  {
    name_jp: '金',
  },
  {
    name_jp: '土',
  },
];
const FORMAT_DATE_TEXT = 'YYYY年MM月DD日';
const FORMAT_DATE_TEXT_1 = 'YYYY年MM月';
const FORMAT_DATE_TEXT_PAID_DATE = 'YYYY年MM月末';
const FORMAT_DATE_TEXT_2 = 'M月D日';
const EVENT_RELATIONSHIP_TYPE = {
  oneToGroup: 1,
  oneToOne: 2,
  vote: 3,
};

const TYPE_EVENT_RELATIONSHIP = 1;
const TYPE_VOTE_RELATIONSHIP = 3;

const eventTypeStatus = {
  ON: 1,
  OFF: 0,
};

const CONTRACT_BY_YEAR = 1;
const CONTRACT_BY_MONTH = 2;
const CONTRACT_BY_TRIAL = 4;
const CONTRACT_MONTH_PRICE = 690;
const CONTRACT_YEAR_PRICE = 500;
const PAYMENT_TAX = 0.1;
const phoneNumberRegex = new RegExp(`^([+]?)[0-9\\s.\\/-]{1,999}$`);
const ZOOM_M_LOCATION_ID = 1;
const GOOGLE_MEET_M_LOCATION_ID = 2;
const MICROSOFT_TEAMS_M_LOCATION_ID = 6;
const PHONE_M_LOCATION_ID = 3;
const LOCATION_M_LOCATION_ID = 4;
const OTHER_M_LOCATION_ID = 5;
const emailRegex = new RegExp('^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$');
const emailRegex2 = new RegExp(
  /^(?!.*[-]{2})(?!.*[.]{2})(?!.*[_]{2})(([a-zA-Z0-9_.-]+)[@]([a-zA-Z0-9]+)(.[a-zA-Z0-9]+)+)$/,
);

const ROLE_MANAGER = 0;
const ROLE_MEMBER = 1;
const ROLE_ADMIN = 2;

const TYPE_ADMIN = 0;
const TYPE_USER = 1;

const ROLE_MANAGER_CLIENT = 1;
const ROLE_MEMBER_CLIENT = 2;
const passwordRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})');

const ACTIVE_ACCOUNT = 1;
const INACTIVE_ACCOUNT = 0;
const SUSPENSE_ACCOUNT = 2;

const TYPE_CREDIT = 1;
const TYPE_INVOICE = 2;

const DIRECT_SALES = 1;
const AGENCY_SALES = 2;

const DATE_TIME_TYPE = {
  default: 1,
  customize: 2,
};

const MAX_AUTOGENERATE_VOTE = 20;
const MAX_BLOCK_VOTE = 30;

const FORMAT_HOUR = 'H:mm';

const DEFAULT_CUSTOM_TYPE = 1;

const DEFAULT_DATE_TIMES = [
  {
    day_of_week: 1,
    end_time: '18:00:00',
    start_time: '09:00:00',
    status: 1,
  },
  {
    day_of_week: 2,
    end_time: '18:00:00',
    start_time: '09:00:00',
    status: 1,
  },
  {
    day_of_week: 3,
    end_time: '18:00:00',
    start_time: '09:00:00',
    status: 1,
  },
  {
    day_of_week: 4,
    end_time: '18:00:00',
    start_time: '09:00:00',
    status: 1,
  },
  {
    day_of_week: 5,
    end_time: '18:00:00',
    start_time: '09:00:00',
    status: 1,
  },
  {
    day_of_week: 6,
    end_time: '18:00:00',
    start_time: '09:00:00',
    status: 0,
  },
  {
    day_of_week: 7,
    end_time: '18:00:00',
    start_time: '09:00:00',
    status: 0,
  },
];

const FULL_DATE_TIME = 'YYYY-MM-DD HH:mm:ss';
const PAGE_SIZE_LIMIT = 9999;

const patternNumber = '^[0-9]*$';

const MANAGEMENT_AUTHORITY_CALENDAR = 'あり';
const MANAGEMENT_AUTHORITY_CALENDAR_NOT = 'なし';

const STATUS_TEAM_MEMBER_REQUIRED = '必須';
const STATUS_TEAM_MEMBER_OR = 'または';
const STATUS_TEAM_MEMBER_NON = '不参加';

const QA_ANSWER = [
  { id: '51', title: 'プロフィール設定方法', url: '/docs/51' },
  {
    id: '52',
    title: '請求（アカウント購入）',
    url: '/docs/52',
  },
  {
    id: '53',
    title: 'メンバーの追加方法について',
    url: '/docs/53',
  },
  { id: '54', title: '請求書払いについて', url: '/docs/54' },
  {
    id: '55',
    title: '契約内容確認ページの見方',
    url: '/docs/55',
  },
  {
    id: '56',
    title: 'アカウント状況ページの見方',
    url: '/docs/56',
  },
];
const BOX_COLORS_DEFAULT = [
  '#ebe0e1',
  '#cdbbbb',
  '#928685',
  '#fff700',
  '#ffd602',
  '#d1b900',
  '#ebe0e1',
  '#ebe0e1',
  '#ebe0e1',
  '#ebe0e1',
  '#ebe0e1',
  '#ebe0e1',
];

const CALENDAR_ACCOUNT_COLORS = [
  '#e8e6e6', // User login
  '#8f8dd6', // 1
  '#ff6698', // 2
  '#ff35ff', // 3
  '#4384f4', // 4
  '#ba4137', // 5
  '#d57ea7', // 6
  '#dd761b', // 7
  '#ad5500', // 8
  '#d9b880', // 9
  '#c7c6f7', // 10
  '#ce01ca', // 11
  '#ff9aff', // 12
  '#7faaf4', // 13
  '#e9948d', // 14
  '#e6acc7', // 15
  '#f1a663', // 16
  '#cc9932', // 17
  '#e5d7bd', // 18
  '#e1e1fa', // 19
  '#ff35ff', // 20
  '#ffcbff', // 21
  '#b1c8ee', // 22
  '#e7c0bc', // 23
  '#f6dae7', // 24
  '#fad2ae', // 25
  '#986665', // 26
  '#f5ecdc', // 27
  '#ba95cc', // 28
  '#ff6698', // 29
  '#ce01ca', // 30
  '#6077a1', // 31
  '#d47979', // 32
  '#ff9a01', // 33
  '#707c04', // 34
  '#c2b706', // 35
  '#8c8989', // 36
  '#d8c9df', // 37
  '#ff9aff', // 38
  '#cd659a', // 39
  '#94a9bb', // 40
  '#f69494', // 41
  '#ff6434', // 42
  '#e8f199', // 43
  '#e4d928', // 44
  '#c6bebe', // 45
  '#e8e1ed', // 46
  '#ffcbff', // 47
  '#ff6698', // 48
  '#dee7f1', // 49
  '#f7c7c7', // 50
  '#ff0132', // 51
  '#e5e8c8', // 52
  '#fcf58b', // 53
  '#e7e3e3', // 54
  '#cbff68', // 55
  '#99a500', // 56
  '#30ff66', // 57
  '#77b94d', // 58
  '#67fffe', // 59
  '#38cc33', // 60
  '#2c96ff', // 61
  '#338b86', // 62
  '#00cbff', // 63
  '#53a6c1', // 64
  '#00caca', // 65
  '#92aeab', // 66
];

const GOOGLE_TYPE = 1;
const MICROSOFT_TYPE = 2;

const NOT_INCLUDED = 0;
const INCLUDED = 1;

const ACCOUNT_TYPE_PERSON = 0;
const ACCOUNT_TYPE_BUSINESS = 1;

const MEMBER_REQUIRED_TYPE = {
  AND: 1,
  OR: 2,
  NOT: 3,
};

const IS_MANUAL_SETTING = 1;
const IS_AUTO_SETTING = 0;
const MOUSE_LEAVE_DELAY_TIME = 1500;

const TYPE_SELECT_TEAM = {
  option: 'option',
  email: 'email',
  is_admin: 'is_admin',
};

const REGEX = {
  stringNumber: `^([0-9]){1,3}$`,
  stringNumberTemplate: `^([1-9])([0-9]?){1,4}$`,
  maxFontSize: '^(1)([0-4]?)$',
  minFontSize: '^[2-9]$',
};

const SETTING_TEMPLATE = {
  logo: 'logo',
  home: 'home',
  buttonEmbedTemplate: 'buttonEmbedTemplate',
  calendarTemplate: 'calendarTemplate',
  confirmTemplate: 'confirmTemplate',
};

const STEP_NEXT_SETTING_TEMPLATE = {
  buttonEmbedTemplate: SETTING_TEMPLATE.calendarTemplate,
  calendarTemplate: SETTING_TEMPLATE.confirmTemplate,
};

const STEP_PRE_SETTING_TEMPLATE = {
  calendarTemplate: SETTING_TEMPLATE.buttonEmbedTemplate,
  confirmTemplate: SETTING_TEMPLATE.calendarTemplate,
};

const TITLE_SETTING_TEMPLATE = {
  [SETTING_TEMPLATE.buttonEmbedTemplate]: '予約ページ ＞ ボタン編集',
  [SETTING_TEMPLATE.calendarTemplate]:
    '予約ページ ＞ カレンダー&説明箇所の編集',
  [SETTING_TEMPLATE.confirmTemplate]: '予約ページ ＞ 入力項目の編集',
};

const SETTING_NAVIGATOR = {
  input: 1,
  checkbox: 2,
  policy: 4,
};

const INPUT_TYPE = {
  text: 1,
  checkbox: 2,
  dropdown: 3,
  policy: 4,
};

const DEFAULT_INPUT_TEXT = {
  // question_name: '例）電話番号',
  // placeholder: '例）お電話番号をご入力ください。',
  question_name: '',
  placeholder: '',
  status: 0,
  contents: [],
};

const DEFAULT_INPUT_CHECKBOX = {
  // question_name: '希望職種',
  // placeholder:
  //   '例）ご利用目的をご選択ください。　　　　　　　　　　　　　※複数選択可',
  question_name: '',
  placeholder: '',
  status: 0,
  contents: [
    {
      id: 7,
      key_id: 7,
      content_name: '',
      index: 1,
      default: true,
    },
    {
      id: 8,
      key_id: 8,
      content_name: '',
      index: 2,
      default: true,
    },
  ],
};

const DEFAULT_LIST_INPUT = [
  {
    id: 1,
    key_id: 1,
    question_name: 'お名前',
    placeholder: '例）田中 太郎',
    status: 1,
    contents: [],
    type: INPUT_TYPE.text,
  },
  {
    id: 2,
    key_id: 2,
    question_name: '会社名',
    placeholder: '例）Smoothly株式会社',
    status: 0,
    contents: [],
    type: INPUT_TYPE.text,
  },
  {
    id: 3,
    key_id: 3,
    question_name: 'メールアドレス',
    placeholder: '例）taro.tanaka@smoothly.net',
    status: 1,
    contents: [],
    type: INPUT_TYPE.text,
  },
  {
    id: 4,
    key_id: 4,
    question_name: '電話番号',
    placeholder: '例）お電話番号を入力ください。',
    status: 0,
    contents: [],
    type: INPUT_TYPE.text,
  },
  {
    id: 5,
    key_id: 5,
    question_name: 'お問い合わせ内容',
    placeholder: '例）オンライン無料相談を希望です。',
    status: 0,
    contents: [],
    type: INPUT_TYPE.text,
  },
];

const POLICY_STATUS = {
  show: 1,
  required: 2,
  not_required: 3,
};

const DEFAULT_POLICY = {
  // title: '利用規約',
  // text_require: '利用規約に同意する',
  title: '',
  text_require: '',
  checkbox: 0,
  link: '',
  content: '',
  note: '',
};

const REQUIRED_STATUS = {
  not_required: 0,
  required: 1,
};

const INPUT_DEFAULT = {
  お名前: 'name',
  メールアドレス: 'email',
  電話番号: 'phone',
  会社名: 'company',
  登録日: 'dateSend',
};

const MIN_AUTO_EVENT_A_DAY = 1;

const CALENDAR_TEMPLATE_ITEM = {
  a: 'a',
  b: 'b',
  c: 'c',
  d: 'd',
  e: 'e',
};

const UNPROCESSABLE_ENTITY_STATUS = 422;

const MESSAGE_ERROR_BUTTON_EMBED_EMPTY = [
  '未入力の項目があるため、入力後に',
  '「次へ」をクリックください。',
];

export {
  YYYYMMDDTHHmm,
  DATE_TIME_TYPE,
  YYYYMMDD,
  FORMAT_DATE_STANDARD,
  FORMAT_YYYY,
  FORMAT_MM,
  FORMAT_DD,
  dayInWeek,
  FORMAT_DATE,
  DOW_NAME,
  FORMAT_DATE_TEXT,
  FORMAT_M,
  FORMAT_D,
  FORMAT_mm,
  FORMAT_HH,
  EVENT_RELATIONSHIP_TYPE,
  HOUR_FORMAT,
  FULL_DATE_HOUR,
  FULL_HOUR_FORMAT,
  eventTypeStatus,
  CONTRACT_BY_TRIAL,
  CONTRACT_BY_MONTH,
  CONTRACT_BY_YEAR,
  PAYMENT_TAX,
  phoneNumberRegex,
  ROLE_MANAGER,
  ROLE_MEMBER,
  ZOOM_M_LOCATION_ID,
  GOOGLE_MEET_M_LOCATION_ID,
  MICROSOFT_TEAMS_M_LOCATION_ID,
  PHONE_M_LOCATION_ID,
  LOCATION_M_LOCATION_ID,
  OTHER_M_LOCATION_ID,
  emailRegex,
  emailRegex2,
  ROLE_MANAGER_CLIENT,
  ROLE_MEMBER_CLIENT,
  passwordRegex,
  CONTRACT_MONTH_PRICE,
  CONTRACT_YEAR_PRICE,
  ACTIVE_ACCOUNT,
  INACTIVE_ACCOUNT,
  FORMAT_DATE_TEXT_1,
  ROLE_ADMIN,
  TYPE_CREDIT,
  TYPE_INVOICE,
  DIRECT_SALES,
  AGENCY_SALES,
  FORMAT_DATE_TEXT_2,
  FULLCALENDAR_EVENT_DATE,
  FORMAT_HOUR,
  SUSPENSE_ACCOUNT,
  DEFAULT_CUSTOM_TYPE,
  DEFAULT_DATE_TIMES,
  FULL_DATE_TIME,
  PAGE_SIZE_LIMIT,
  ADMIN_FULL_DATE_HOUR,
  TYPE_ADMIN,
  TYPE_USER,
  patternNumber,
  FORMAT_DATE_TEXT_PAID_DATE,
  MANAGEMENT_AUTHORITY_CALENDAR,
  MANAGEMENT_AUTHORITY_CALENDAR_NOT,
  STATUS_TEAM_MEMBER_REQUIRED,
  STATUS_TEAM_MEMBER_OR,
  STATUS_TEAM_MEMBER_NON,
  QA_ANSWER,
  BOX_COLORS_DEFAULT,
  GOOGLE_TYPE,
  MICROSOFT_TYPE,
  NOT_INCLUDED,
  INCLUDED,
  CALENDAR_ACCOUNT_COLORS,
  ACCOUNT_TYPE_PERSON,
  ACCOUNT_TYPE_BUSINESS,
  HOUR_SEC_FORMAT,
  MEMBER_REQUIRED_TYPE,
  IS_MANUAL_SETTING,
  IS_AUTO_SETTING,
  TYPE_EVENT_RELATIONSHIP,
  TYPE_VOTE_RELATIONSHIP,
  MAX_AUTOGENERATE_VOTE,
  MAX_BLOCK_VOTE,
  MOUSE_LEAVE_DELAY_TIME,
  TYPE_SELECT_TEAM,
  REGEX,
  SETTING_TEMPLATE,
  SETTING_NAVIGATOR,
  STEP_NEXT_SETTING_TEMPLATE,
  STEP_PRE_SETTING_TEMPLATE,
  INPUT_TYPE,
  POLICY_STATUS,
  REQUIRED_STATUS,
  DEFAULT_POLICY,
  DEFAULT_INPUT_TEXT,
  DEFAULT_INPUT_CHECKBOX,
  DEFAULT_LIST_INPUT,
  TITLE_SETTING_TEMPLATE,
  INPUT_DEFAULT,
  MIN_AUTO_EVENT_A_DAY,
  CALENDAR_TEMPLATE_ITEM,
  UNPROCESSABLE_ENTITY_STATUS,
  MESSAGE_ERROR_BUTTON_EMBED_EMPTY,
};
