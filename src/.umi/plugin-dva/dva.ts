// @ts-nocheck
import { Component } from 'react';
import { ApplyPluginsType } from 'umi';
import dva from 'dva';
// @ts-ignore
import createLoading from '/home/miichi/Desktop/PROJECTS/Smoothly/smoothly/node_modules/dva-loading/dist/index.esm.js';
import { plugin, history } from '../core/umiExports';
import ModelAccount0 from '/home/miichi/Desktop/PROJECTS/Smoothly/smoothly/src/models/Account.js';
import ModelAccountTeam1 from '/home/miichi/Desktop/PROJECTS/Smoothly/smoothly/src/models/AccountTeam.js';
import ModelAdmin2 from '/home/miichi/Desktop/PROJECTS/Smoothly/smoothly/src/models/Admin.js';
import ModelAvailableTime3 from '/home/miichi/Desktop/PROJECTS/Smoothly/smoothly/src/models/AvailableTime.js';
import ModelBasicSetting4 from '/home/miichi/Desktop/PROJECTS/Smoothly/smoothly/src/models/BasicSetting.js';
import ModelCalendar5 from '/home/miichi/Desktop/PROJECTS/Smoothly/smoothly/src/models/Calendar.js';
import ModelCalendarCreation6 from '/home/miichi/Desktop/PROJECTS/Smoothly/smoothly/src/models/CalendarCreation.js';
import ModelDocument7 from '/home/miichi/Desktop/PROJECTS/Smoothly/smoothly/src/models/Document.js';
import ModelEvent8 from '/home/miichi/Desktop/PROJECTS/Smoothly/smoothly/src/models/Event.js';
import ModelFooter9 from '/home/miichi/Desktop/PROJECTS/Smoothly/smoothly/src/models/Footer.js';
import ModelIndex10 from '/home/miichi/Desktop/PROJECTS/Smoothly/smoothly/src/models/index.js';
import ModelMaster11 from '/home/miichi/Desktop/PROJECTS/Smoothly/smoothly/src/models/Master.js';
import ModelMessageSetting12 from '/home/miichi/Desktop/PROJECTS/Smoothly/smoothly/src/models/MessageSetting.js';
import ModelPayment13 from '/home/miichi/Desktop/PROJECTS/Smoothly/smoothly/src/models/Payment.js';
import ModelPreview14 from '/home/miichi/Desktop/PROJECTS/Smoothly/smoothly/src/models/Preview.js';
import ModelScheduleSetting15 from '/home/miichi/Desktop/PROJECTS/Smoothly/smoothly/src/models/ScheduleSetting.js';
import ModelSettingTemplate16 from '/home/miichi/Desktop/PROJECTS/Smoothly/smoothly/src/models/SettingTemplate.js';
import ModelTab17 from '/home/miichi/Desktop/PROJECTS/Smoothly/smoothly/src/models/Tab.js';
import ModelTeam18 from '/home/miichi/Desktop/PROJECTS/Smoothly/smoothly/src/models/Team.js';
import ModelTimeSetting19 from '/home/miichi/Desktop/PROJECTS/Smoothly/smoothly/src/models/TimeSetting.js';
import ModelUser20 from '/home/miichi/Desktop/PROJECTS/Smoothly/smoothly/src/models/User.js';
import ModelUserConnections21 from '/home/miichi/Desktop/PROJECTS/Smoothly/smoothly/src/models/UserConnections.js';
import ModelVote22 from '/home/miichi/Desktop/PROJECTS/Smoothly/smoothly/src/models/Vote.js';

let app:any = null;

export function _onCreate(options = {}) {
  const runtimeDva = plugin.applyPlugins({
    key: 'dva',
    type: ApplyPluginsType.modify,
    initialValue: {},
  });
  app = dva({
    history,
    
    ...(runtimeDva.config || {}),
    // @ts-ignore
    ...(typeof window !== 'undefined' && window.g_useSSR ? { initialState: window.g_initialProps } : {}),
    ...(options || {}),
  });
  
  app.use(createLoading());
  (runtimeDva.plugins || []).forEach((plugin:any) => {
    app.use(plugin);
  });
  app.model({ namespace: 'Account', ...ModelAccount0 });
app.model({ namespace: 'AccountTeam', ...ModelAccountTeam1 });
app.model({ namespace: 'Admin', ...ModelAdmin2 });
app.model({ namespace: 'AvailableTime', ...ModelAvailableTime3 });
app.model({ namespace: 'BasicSetting', ...ModelBasicSetting4 });
app.model({ namespace: 'Calendar', ...ModelCalendar5 });
app.model({ namespace: 'CalendarCreation', ...ModelCalendarCreation6 });
app.model({ namespace: 'Document', ...ModelDocument7 });
app.model({ namespace: 'Event', ...ModelEvent8 });
app.model({ namespace: 'Footer', ...ModelFooter9 });
app.model({ namespace: 'index', ...ModelIndex10 });
app.model({ namespace: 'Master', ...ModelMaster11 });
app.model({ namespace: 'MessageSetting', ...ModelMessageSetting12 });
app.model({ namespace: 'Payment', ...ModelPayment13 });
app.model({ namespace: 'Preview', ...ModelPreview14 });
app.model({ namespace: 'ScheduleSetting', ...ModelScheduleSetting15 });
app.model({ namespace: 'SettingTemplate', ...ModelSettingTemplate16 });
app.model({ namespace: 'Tab', ...ModelTab17 });
app.model({ namespace: 'Team', ...ModelTeam18 });
app.model({ namespace: 'TimeSetting', ...ModelTimeSetting19 });
app.model({ namespace: 'User', ...ModelUser20 });
app.model({ namespace: 'UserConnections', ...ModelUserConnections21 });
app.model({ namespace: 'Vote', ...ModelVote22 });
  return app;
}

export function getApp() {
  return app;
}

/**
 * whether browser env
 * 
 * @returns boolean
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined'
}

export class _DvaContainer extends Component {
  constructor(props: any) {
    super(props);
    // run only in client, avoid override server _onCreate()
    if (isBrowser()) {
      _onCreate()
    }
  }

  componentWillUnmount() {
    let app = getApp();
    app._models.forEach((model:any) => {
      app.unmodel(model.namespace);
    });
    app._models = [];
    try {
      // 释放 app，for gc
      // immer 场景 app 是 read-only 的，这里 try catch 一下
      app = null;
    } catch(e) {
      console.error(e);
    }
  }

  render() {
    let app = getApp();
    app.router(() => this.props.children);
    return app.start()();
  }
}
