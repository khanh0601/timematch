import { IS_AUTO_SETTING } from '../constant';

const initState = {
  name: 'お打合せ',
  m_category_id: 1,
  m_location_id: null,
  location_name: null,
  m_block_time_id: null,
  block_number: null,
  m_move_time_id: null,
  move_number: null,
  is_manual_setting: false,
  category_name: null,
};

export default {
  namespace: 'BASIC_SETTING',
  state: initState,
  reducers: {
    setBasicSetting(state, { payload }) {
      return {
        ...state,
        name: payload.name,
        m_category_id: payload.m_category_id === 1 ? payload.m_category_id : 2,
        m_location_id: payload.m_location_id,
        m_block_time_id: payload.m_block_time_id,
        m_move_time_id: payload.m_move_time_id,
        location_name: payload.location_name,
        block_number: payload.block_number,
        move_number: payload.move_number,
        is_manual_setting: !!payload.is_manual_setting,
        category_name: payload.category_name,
      };
    },
    setBasicSettingName(state, { payload }) {
      return {
        ...state,
        name: payload,
      };
    },
    setBasicSettingCategory(state, { payload }) {
      return {
        ...state,
        m_category_id: payload,
        m_location_id: payload === 1 ? 1 : 5,
      };
    },
    setBasicSettingLocation(state, { payload }) {
      return {
        ...state,
        m_location_id: payload,
      };
    },
    setBasicSettingBlockTime(state, { payload }) {
      return {
        ...state,
        m_block_time_id: payload,
      };
    },
    setBasicSettingMoveTime(state, { payload }) {
      return {
        ...state,
        m_move_time_id: payload,
      };
    },
    setBasicSettingManual(state, { payload }) {
      return {
        ...state,
        is_manual_setting: payload,
      };
    },
    setBasicSettingLocationName(state, { payload }) {
      return {
        ...state,
        location_name: payload,
      };
    },
    setBasicSettingBlockNumber(state, { payload }) {
      return {
        ...state,
        block_number: payload,
      };
    },
    setBasicSettingMoveNumber(state, { payload }) {
      return {
        ...state,
        move_number: payload,
      };
    },
    reset(state) {
      return {
        ...state,
        ...initState,
      };
    },
    resetMovingTime(state) {
      return {
        ...state,
        m_move_time_id: null,
        move_number: null,
      };
    },
  },
  effects: {
    *setBasicSettingManual(action, { put }) {
      // Change to auto
      // Remove all auto generated block
      //resetWhenChangeToAutoMode
      if (action.payload == IS_AUTO_SETTING) {
        yield put({ type: 'AVAILABLE_TIME/resetWhenChangeToAutoMode' });
      }
    },
    *setBasicSettingCategory(action, { put }) {
      yield put({ type: 'AVAILABLE_TIME/setAutoVoteEvents', payload: [] });
      yield put({ type: 'AVAILABLE_TIME/setAutoEvents', payload: [] });
    },
    *setBasicSettingBlockTime(action, { put }) {
      yield put({ type: 'AVAILABLE_TIME/setAutoVoteEvents', payload: [] });
      yield put({ type: 'AVAILABLE_TIME/setAutoEvents', payload: [] });
    },
    *setBasicSettingMoveTime(action, { put }) {
      yield put({ type: 'AVAILABLE_TIME/setAutoVoteEvents', payload: [] });
      yield put({ type: 'AVAILABLE_TIME/setAutoEvents', payload: [] });
    },
    *reset(action, { put }) {
      yield put({ type: 'AVAILABLE_TIME/setAutoVoteEvents', payload: [] });
      yield put({ type: 'AVAILABLE_TIME/setAutoEvents', payload: [] });
    },
  },
};
