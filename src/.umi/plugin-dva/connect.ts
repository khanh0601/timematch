// @ts-nocheck
import { IRoute } from '@umijs/core';
import { AnyAction } from 'redux';
import React from 'react';
import { EffectsCommandMap, SubscriptionAPI } from 'dva';
import { match } from 'react-router-dom';
import { Location, LocationState, History } from 'history';

export * from 'D:/Vision_Timematch/timematch-front/src/models/Account';
export * from 'D:/Vision_Timematch/timematch-front/src/models/AccountTeam';
export * from 'D:/Vision_Timematch/timematch-front/src/models/Admin';
export * from 'D:/Vision_Timematch/timematch-front/src/models/AvailableTime';
export * from 'D:/Vision_Timematch/timematch-front/src/models/BasicSetting';
export * from 'D:/Vision_Timematch/timematch-front/src/models/Calendar';
export * from 'D:/Vision_Timematch/timematch-front/src/models/CalendarCreation';
export * from 'D:/Vision_Timematch/timematch-front/src/models/Document';
export * from 'D:/Vision_Timematch/timematch-front/src/models/Event';
export * from 'D:/Vision_Timematch/timematch-front/src/models/Footer';
export * from 'D:/Vision_Timematch/timematch-front/src/models/index';
export * from 'D:/Vision_Timematch/timematch-front/src/models/Master';
export * from 'D:/Vision_Timematch/timematch-front/src/models/MessageSetting';
export * from 'D:/Vision_Timematch/timematch-front/src/models/Payment';
export * from 'D:/Vision_Timematch/timematch-front/src/models/Preview';
export * from 'D:/Vision_Timematch/timematch-front/src/models/ScheduleSetting';
export * from 'D:/Vision_Timematch/timematch-front/src/models/SettingTemplate';
export * from 'D:/Vision_Timematch/timematch-front/src/models/Tab';
export * from 'D:/Vision_Timematch/timematch-front/src/models/Team';
export * from 'D:/Vision_Timematch/timematch-front/src/models/TimeSetting';
export * from 'D:/Vision_Timematch/timematch-front/src/models/User';
export * from 'D:/Vision_Timematch/timematch-front/src/models/UserConnections';
export * from 'D:/Vision_Timematch/timematch-front/src/models/Vote';

export interface Action<T = any> {
  type: T
}

export type Reducer<S = any, A extends Action = AnyAction> = (
  state: S | undefined,
  action: A
) => S;

export type ImmerReducer<S = any, A extends Action = AnyAction> = (
  state: S,
  action: A
) => void;

export type Effect = (
  action: AnyAction,
  effects: EffectsCommandMap,
) => void;

/**
 * @type P: Type of payload
 * @type C: Type of callback
 */
export type Dispatch = <P = any, C = (payload: P) => void>(action: {
  type: string;
  payload?: P;
  callback?: C;
  [key: string]: any;
}) => any;

export type Subscription = (api: SubscriptionAPI, done: Function) => void | Function;

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    [key: string]: any;
  };
}

/**
 * @type P: Params matched in dynamic routing
 */
export interface ConnectProps<
  P extends { [K in keyof P]?: string } = {},
  S = LocationState,
  T = {}
> {
  dispatch?: Dispatch;
  // https://github.com/umijs/umi/pull/2194
  match?: match<P>;
  location: Location<S> & { query: T };
  history: History;
  route: IRoute;
}

export type RequiredConnectProps<
  P extends { [K in keyof P]?: string } = {},
  S = LocationState,
  T = {}
  > = Required<ConnectProps<P, S, T>>

/**
 * @type T: React props
 * @type U: match props types
 */
export type ConnectRC<
  T = {},
  U = {},
  S = {},
  Q = {}
> = React.ForwardRefRenderFunction<any, T & RequiredConnectProps<U, S, Q>>;

