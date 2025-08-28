import SearchIcon from '../icon/SearchIcon';
import { useState } from 'react';
import { connect } from 'dva';
import { Input } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import { useEffect } from 'react';
import { profileFromStorage } from '@/commons/function';
import { useDispatch } from 'dva';
const Header = props => {
  const { tabStore } = props;
  const [isSearch, setIsSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const profile = profileFromStorage();
  const dispatch = useDispatch();
  const payloadAdjusted = {
    user_id_of_member: profile?.id,
    page: 1,
    page_size: 10,
    relationship_type: 3,
    is_finished: 1,
    keyword: searchValue,
  };

  const payloadAll = {
    user_id_of_member: profile?.id,
    page: 1,
    page_size: 10,
    relationship_type: 3,
    keyword: searchValue,
  };

  const payloadAdjusting = {
    user_id_of_member: profile?.id,
    page: 1,
    page_size: 10,
    relationship_type: 3,
    is_finished: 0,
    keyword: searchValue,
  };

  useEffect(() => {
    dispatch({
      type: 'TAB/getOnePaginateAllEventsMember',
      payload: payloadAll,
    });
    dispatch({
      type: 'TAB/getOnePaginateAdjustedEventsMember',
      payload: payloadAdjusted,
    });
    dispatch({
      type: 'TAB/getOnePaginateAdjustingEventsMember',
      payload: payloadAdjusting,
    });
  }, [searchValue, profile?.id]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        position: 'sticky',
        top: 0,
        zIndex: 2,
        backgroundColor: 'white',
      }}
    >
      {!isSearch && <div style={{ width: 60 }}></div>}
      {isSearch ? (
        <Input
          size="large"
          placeholder="検索"
          value={searchValue}
          style={{ borderRadius: 16 }}
          onChange={e => setSearchValue(e.target.value)}
          suffix={
            <CloseCircleFilled
              onClick={() => {
                setIsSearch(!isSearch);
                setSearchValue('');
              }}
              fill={'#004cff'}
              width={24}
              height={24}
            />
          }
        />
      ) : (
        <div style={{ textAlign: 'center', fontSize: 24 }}>調整一覧</div>
      )}

      {!isSearch ? (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <SearchIcon
            onClick={() => {
              setIsSearch(!isSearch);
            }}
            fill={'#004cff'}
            width={24}
            height={24}
          />
          <a
            style={{
              paddingLeft: 2,
              paddingRight: 2,
              border: '1px solid #004cff',
              color: '#004cff',
              borderRadius: 4,
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              marginLeft: 8,
              cursor: 'pointer',
            }}
            onClick={props.onScrollTop}
          >
            今日
          </a>
        </div>
      ) : null}
    </div>
  );
};

export default connect(({ CALENDAR, TAB }) => ({
  calendarStore: CALENDAR,
  tabStore: TAB,
}))(Header);
