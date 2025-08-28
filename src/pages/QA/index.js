import React, { useState, useEffect } from 'react';
import styles from './styles.less';
import { Button, Input, Row, Col } from 'antd';
import { useIntl, history, Link } from 'umi';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { QA_ANSWER } from '@/constant';
import { connect } from 'dva';

function QA(props) {
  const { dispatch, documentStore } = props;
  const { isScroll } = documentStore;
  const intl = useIntl();
  const { formatMessage } = intl;
  const { Search } = Input;
  const [stateCollapse, setStateCollapse] = useState([
    {
      id: 1,
      content: false,
      button: true,
      title: true,
    },
    {
      id: 2,
      content: false,
      button: true,
      title: true,
    },
    {
      id: 3,
      content: false,
      button: true,
      title: true,
    },
    {
      id: 4,
      content: false,
      button: true,
      title: true,
    },
    {
      id: 5,
      content: false,
      button: true,
      title: true,
    },
    {
      id: 6,
      content: false,
      button: true,
      title: true,
    },
  ]);
  const [value, searchValue] = useState('');
  const [searchState, setSearchState] = useState(false);

  const collapseAll = number => {
    const result = stateCollapse.map(item => {
      if (item.id === number) {
        item.content = true;
        item.button = false;
      }
      return item;
    });
    setStateCollapse(result);
  };
  const search = value => {
    searchValue(value);
    setSearchState(true);
    let result = [];

    if (!!value) {
      for (let i = 1; i <= 6; i++) {
        const content = document.getElementById('content' + i).textContent;
        if (
          content.toLowerCase().includes(value) ||
          content.toUpperCase().includes(value) ||
          content.includes(value)
        ) {
          result.push({ title: true, button: false });
        } else {
          result.push({
            title: false,
            content: false,
            button: true,
          });
        }
      }
    } else {
      for (let i = 1; i <= 6; i++) {
        result.push({
          title: true,
          content: false,
          button: true,
        });
      }
    }
    setStateCollapse(result);
  };
  const redirectToEventType = () => {
    history.push(
      '/schedule-adjustment/many?event_code=Smooth-999&user_code=smoothly-2020',
    );
  };

  const URL_QA_ANSWER_51 = QA_ANSWER.find(ele => ele.id === '51').url;
  const URL_QA_ANSWER_52 = QA_ANSWER.find(ele => ele.id === '52').url;
  const URL_QA_ANSWER_53 = QA_ANSWER.find(ele => ele.id === '53').url;
  const URL_QA_ANSWER_54 = QA_ANSWER.find(ele => ele.id === '54').url;
  const URL_QA_ANSWER_55 = QA_ANSWER.find(ele => ele.id === '55').url;
  const URL_QA_ANSWER_56 = QA_ANSWER.find(ele => ele.id === '56').url;

  const btnGroupSeeAll = (order, bigger = false) => {
    return (
      <Row className={styles.hideSM}>
        {stateCollapse.map((itemCollapse, index) => {
          if (bigger ? index > order : index < order) {
            return (
              <Col
                sm={8}
                xs={24}
                className={!itemCollapse.title ? styles.displayNone : ''}
                key={index}
              >
                <div className={styles.qaItem}>
                  {itemCollapse.button && (
                    <Button
                      className={styles.btnSeeAll}
                      onClick={() => collapseAll(itemCollapse.id)}
                    >
                      {formatMessage({ id: 'i18n_see_all' })}
                    </Button>
                  )}
                </div>
              </Col>
            );
          }
        })}
      </Row>
    );
  };

  const btnSeeAll = order => {
    return stateCollapse.map(itemCollapse => {
      if (itemCollapse.id === order && itemCollapse.button) {
        return (
          <Button
            className={`${styles.btnSeeAll} ${styles.hidePC}`}
            onClick={() => collapseAll(itemCollapse.id)}
          >
            {formatMessage({ id: 'i18n_see_all' })}
          </Button>
        );
      }
    });
  };

  return (
    <div className={styles.qa}>
      <Header />
      <div className={styles.qaHeader}>
        <div className={styles.container}>
          <h2 className={styles.title}>
            {formatMessage({ id: 'i18n_header_menu_2' })}
          </h2>
          <div className={styles.headerContent}>
            <div className={styles.left}>
              <div className={styles.leftTitle}>
                {formatMessage({ id: 'i18n_enter_search_keyword' })}
              </div>
              <div className={styles.seachForm}>
                <Search
                  placeholder={formatMessage({
                    id: 'i18n_enter_search_keyword_placeholder',
                  })}
                  allowClear
                  onSearch={value => search(value)}
                  enterButton={formatMessage({ id: 'i18n_search' })}
                  className={styles.searchInput}
                />
              </div>
            </div>
            <div className={styles.right}>
              <div
                className={styles.rightBlock}
                onClick={() => history.push('/send-contact-email')}
              >
                {formatMessage({ id: 'i18n_contact_us' })}
              </div>
              <div
                className={styles.rightBlock}
                onClick={() => redirectToEventType()}
              >
                {formatMessage({ id: 'i18n_online_briefing' })}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.qaContent}>
        <div className={styles.title}>
          {formatMessage({ id: 'i18n_how_to_use' })}
        </div>
        <Row>
          <Col
            sm={8}
            xs={24}
            className={!stateCollapse[0].title ? styles.displayNone : ''}
          >
            <div className={`${styles.qaItem}`} id="content1">
              <div className={styles.titleItem}>
                {formatMessage({ id: 'i18n_QA_question_1' })}
              </div>
              <ul>
                {(formatMessage({ id: 'i18n_QA_answer_11' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_11' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_11' }).includes(value) ||
                  !searchState) && (
                  <li>{formatMessage({ id: 'i18n_QA_answer_11' })}</li>
                )}
                {(formatMessage({ id: 'i18n_QA_answer_12' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_12' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_12' }).includes(value) ||
                  !searchState) && (
                  <li>{formatMessage({ id: 'i18n_QA_answer_12' })}</li>
                )}
                {(formatMessage({ id: 'i18n_QA_answer_13' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_13' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_13' }).includes(value) ||
                  !searchState) && (
                  <li>{formatMessage({ id: 'i18n_QA_answer_13' })}</li>
                )}
                {(formatMessage({ id: 'i18n_QA_answer_14' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_14' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_14' }).includes(value) ||
                  !searchState) && (
                  <li>{formatMessage({ id: 'i18n_QA_answer_14' })}</li>
                )}
                {(formatMessage({ id: 'i18n_QA_answer_15' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_15' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_15' }).includes(value) ||
                  !searchState) && (
                  <li>{formatMessage({ id: 'i18n_QA_answer_15' })}</li>
                )}
                {(formatMessage({ id: 'i18n_QA_answer_16' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_16' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_16' }).includes(value) ||
                  !searchState) && (
                  <li>{formatMessage({ id: 'i18n_QA_answer_16' })}</li>
                )}
                {(formatMessage({ id: 'i18n_QA_answer_17' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_17' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_17' }).includes(value) ||
                  !searchState) && (
                  <li>{formatMessage({ id: 'i18n_QA_answer_17' })}</li>
                )}
                {(formatMessage({ id: 'i18n_QA_answer_56' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_56' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_56' }).includes(value) ||
                  !searchState) && (
                  <li
                    className={
                      !stateCollapse[0].content ? styles.displayNone : ''
                    }
                  >
                    {formatMessage({ id: 'i18n_QA_answer_56' })}
                  </li>
                )}
              </ul>
              {btnSeeAll(1)}
            </div>
          </Col>
          <Col
            sm={8}
            xs={24}
            className={!stateCollapse[1].title ? styles.displayNone : ''}
          >
            <div className={`${styles.qaItem}`} id="content2">
              <div className={styles.titleItem}>
                {formatMessage({ id: 'i18n_QA_question_2' })}
              </div>
              <ul>
                {(formatMessage({ id: 'i18n_QA_answer_21' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_21' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_21' }).includes(value) ||
                  !searchState) && (
                  <li>{formatMessage({ id: 'i18n_QA_answer_21' })}</li>
                )}
                {(formatMessage({ id: 'i18n_QA_answer_22' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_22' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_22' }).includes(value) ||
                  !searchState) && (
                  <li>{formatMessage({ id: 'i18n_QA_answer_22' })}</li>
                )}
                {(formatMessage({ id: 'i18n_QA_answer_23' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_23' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_23' }).includes(value) ||
                  !searchState) && (
                  <li>{formatMessage({ id: 'i18n_QA_answer_23' })}</li>
                )}
                {(formatMessage({ id: 'i18n_QA_answer_24' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_24' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_24' }).includes(value) ||
                  !searchState) && (
                  <li>{formatMessage({ id: 'i18n_QA_answer_24' })}</li>
                )}
                {(formatMessage({ id: 'i18n_QA_answer_25' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_25' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_25' }).includes(value) ||
                  !searchState) && (
                  <li>{formatMessage({ id: 'i18n_QA_answer_25' })}</li>
                )}
                {(formatMessage({ id: 'i18n_QA_answer_56' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_56' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_56' }).includes(value) ||
                  !searchState) && (
                  <li
                    className={
                      !stateCollapse[1].content ? styles.displayNone : ''
                    }
                  >
                    {formatMessage({ id: 'i18n_QA_answer_56' })}
                  </li>
                )}
              </ul>
              {btnSeeAll(2)}
            </div>
          </Col>
          <Col
            sm={8}
            xs={24}
            className={!stateCollapse[2].title ? styles.displayNone : ''}
          >
            <div className={`${styles.qaItem}`} id="content3">
              <div className={styles.titleItem}>
                {formatMessage({ id: 'i18n_QA_question_3' })}
              </div>
              <ul>
                {(formatMessage({ id: 'i18n_QA_answer_31' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_31' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_31' }).includes(value) ||
                  !searchState) && (
                  <li>{formatMessage({ id: 'i18n_QA_answer_31' })}</li>
                )}
                {(formatMessage({ id: 'i18n_QA_answer_32' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_32' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_32' }).includes(value) ||
                  !searchState) && (
                  <li>{formatMessage({ id: 'i18n_QA_answer_32' })}</li>
                )}
                {(formatMessage({ id: 'i18n_QA_answer_56' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_56' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_56' }).includes(value) ||
                  !searchState) && (
                  <li
                    className={
                      !stateCollapse[2].content ? styles.displayNone : ''
                    }
                  >
                    {formatMessage({ id: 'i18n_QA_answer_56' })}
                  </li>
                )}
              </ul>
              {btnSeeAll(3)}
            </div>
          </Col>
        </Row>

        {btnGroupSeeAll(3)}

        <Row>
          <Col
            sm={8}
            xs={24}
            className={!stateCollapse[3].title ? styles.displayNone : ''}
          >
            <div className={`${styles.qaItem}`} id="content4">
              <div className={styles.titleItem}>
                {formatMessage({ id: 'i18n_QA_question_4' })}
              </div>
              <ul>
                {(formatMessage({ id: 'i18n_QA_answer_41' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_41' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_41' }).includes(value) ||
                  !searchState) && (
                  <li>{formatMessage({ id: 'i18n_QA_answer_41' })}</li>
                )}
                {(formatMessage({ id: 'i18n_QA_answer_42' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_42' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_42' }).includes(value) ||
                  !searchState) && (
                  <li>{formatMessage({ id: 'i18n_QA_answer_42' })}</li>
                )}
                {(formatMessage({ id: 'i18n_QA_answer_43' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_43' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_43' }).includes(value) ||
                  !searchState) && (
                  <li>{formatMessage({ id: 'i18n_QA_answer_43' })}</li>
                )}
                {(formatMessage({ id: 'i18n_QA_answer_56' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_56' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_56' }).includes(value) ||
                  !searchState) && (
                  <li
                    className={
                      !stateCollapse[3].content ? styles.displayNone : ''
                    }
                  >
                    {formatMessage({ id: 'i18n_QA_answer_56' })}
                  </li>
                )}
              </ul>
              {btnSeeAll(4)}
            </div>
          </Col>
          <Col
            sm={8}
            xs={24}
            className={!stateCollapse[4].title ? styles.displayNone : ''}
          >
            <div className={`${styles.qaItem}`} id="content5">
              <div className={styles.titleItem}>
                {formatMessage({ id: 'i18n_QA_question_5' })}
              </div>
              <ul>
                {(formatMessage({ id: 'i18n_QA_answer_51' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_51' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_51' }).includes(value) ||
                  !searchState) && (
                  <li>
                    <Link
                      to={URL_QA_ANSWER_51}
                      onClick={() =>
                        dispatch({
                          type: 'DOCUMENT/setIsScroll',
                          payload: true,
                        })
                      }
                    >
                      {formatMessage({ id: 'i18n_QA_answer_51' })}
                    </Link>
                  </li>
                )}
                {(formatMessage({ id: 'i18n_QA_answer_52' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_52' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_52' }).includes(value) ||
                  !searchState) && (
                  <li>
                    <Link
                      to={URL_QA_ANSWER_52}
                      onClick={() =>
                        dispatch({
                          type: 'DOCUMENT/setIsScroll',
                          payload: true,
                        })
                      }
                    >
                      {formatMessage({ id: 'i18n_QA_answer_52' })}
                    </Link>
                  </li>
                )}
                {(formatMessage({ id: 'i18n_QA_answer_53' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_53' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_53' }).includes(value) ||
                  !searchState) && (
                  <li>
                    <Link
                      to={URL_QA_ANSWER_53}
                      onClick={() =>
                        dispatch({
                          type: 'DOCUMENT/setIsScroll',
                          payload: true,
                        })
                      }
                    >
                      {formatMessage({ id: 'i18n_QA_answer_53' })}
                    </Link>
                  </li>
                )}
                {(formatMessage({ id: 'i18n_QA_answer_54' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_54' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_54' }).includes(value) ||
                  !searchState) && (
                  <li>
                    <Link
                      to={URL_QA_ANSWER_54}
                      onClick={() =>
                        dispatch({
                          type: 'DOCUMENT/setIsScroll',
                          payload: true,
                        })
                      }
                    >
                      {formatMessage({ id: 'i18n_QA_answer_54' })}
                    </Link>
                  </li>
                )}
                {(formatMessage({ id: 'i18n_QA_answer_55' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_55' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_55' }).includes(value) ||
                  !searchState) && (
                  <li>
                    <Link
                      to={URL_QA_ANSWER_55}
                      onClick={() =>
                        dispatch({
                          type: 'DOCUMENT/setIsScroll',
                          payload: true,
                        })
                      }
                    >
                      {formatMessage({ id: 'i18n_QA_answer_55' })}
                    </Link>
                  </li>
                )}
                {(formatMessage({ id: 'i18n_QA_answer_56' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_56' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_56' }).includes(value) ||
                  !searchState) && (
                  <li>
                    <Link
                      to={URL_QA_ANSWER_56}
                      onClick={() =>
                        dispatch({
                          type: 'DOCUMENT/setIsScroll',
                          payload: true,
                        })
                      }
                    >
                      {formatMessage({ id: 'i18n_QA_answer_56' })}
                    </Link>
                  </li>
                )}
                {(formatMessage({ id: 'i18n_QA_answer_56' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_56' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_56' }).includes(value) ||
                  !searchState) && (
                  <li
                    className={
                      !stateCollapse[4].content ? styles.displayNone : ''
                    }
                  >
                    <Link
                      to={URL_QA_ANSWER_56}
                      onClick={() =>
                        dispatch({
                          type: 'DOCUMENT/setIsScroll',
                          payload: true,
                        })
                      }
                    >
                      {formatMessage({ id: 'i18n_QA_answer_56' })}
                    </Link>
                  </li>
                )}
              </ul>
              {btnSeeAll(5)}
            </div>
          </Col>
          <Col
            sm={8}
            xs={24}
            className={!stateCollapse[5].title ? styles.displayNone : ''}
          >
            <div className={`${styles.qaItem}`} id="content6">
              <div className={styles.titleItem}>
                {formatMessage({ id: 'i18n_QA_question_6' })}
              </div>
              <ul style={{ marginBottom: '0' }}>
                {(formatMessage({ id: 'i18n_QA_answer_61' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_61' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_61' }).includes(value) ||
                  !searchState) && (
                  <li>{formatMessage({ id: 'i18n_QA_answer_61' })}</li>
                )}
                {(formatMessage({ id: 'i18n_QA_answer_62' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_62' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_62' }).includes(value) ||
                  !searchState) && (
                  <li>{formatMessage({ id: 'i18n_QA_answer_62' })}</li>
                )}
                {(formatMessage({ id: 'i18n_QA_answer_56' })
                  .toLowerCase()
                  .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_56' })
                    .toUpperCase()
                    .includes(value) ||
                  formatMessage({ id: 'i18n_QA_answer_56' }).includes(value) ||
                  !searchState) && (
                  <li
                    className={
                      !stateCollapse[5].content ? styles.displayNone : ''
                    }
                  >
                    {formatMessage({ id: 'i18n_QA_answer_56' })}
                  </li>
                )}
              </ul>
              {btnSeeAll(6)}
            </div>
          </Col>
        </Row>

        {btnGroupSeeAll(2, true)}
      </div>
      <Footer />
    </div>
  );
}

export default connect(({ DOCUMENT }) => ({
  documentStore: DOCUMENT,
}))(QA);
