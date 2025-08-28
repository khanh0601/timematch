import React, { useEffect, useState } from 'react';
import styles from './styles.less';
import { useParams, Link } from 'umi';
import Footer from '@/components/Footer';
import { connect } from 'dva';
import { Row, Col, Menu, Dropdown, Button } from 'antd';

import NavBar from '@/components/Documents/NavBar';
import Doc51 from '@/components/Documents/Section/Doc51';
import Doc52 from '@/components/Documents/Section/Doc52';
import Doc53 from '@/components/Documents/Section/Doc53';
import Doc54 from '@/components/Documents/Section/Doc54';
import Doc55 from '@/components/Documents/Section/Doc55';
import Doc56 from '@/components/Documents/Section/Doc56';
import Header from '@/components/Header';
import BarsSolid from '@/assets/images/bars-solid.svg';

import useWindowDimensions from '@/commons/useWindowDimensions';

function Documents(props) {
  const { dispatch, documentStore } = props;
  const { isScroll } = documentStore;
  const scrollIntoView = ref => {
    if (ref && isScroll === true) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
      dispatch({ type: 'DOCUMENT/setIsScroll', payload: false });
    }
  };
  const { id } = useParams();

  const showDoc = id => {
    switch (id) {
      case '51':
        return <Doc51 />;
      case '52':
        return <Doc52 />;
      case '53':
        return <Doc53 />;
      case '54':
        return <Doc54 />;
      case '55':
        return <Doc55 />;
      case '56':
        return <Doc56 />;

      default:
        break;
    }
  };

  const { width } = useWindowDimensions();

  const menu = (
    <Menu>
      <Menu.Item>
        <Link
          to="51"
          onClick={() =>
            dispatch({ type: 'DOCUMENT/setIsScroll', payload: true })
          }
        >
          プロフィール設定方法
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link
          to="52"
          onClick={() =>
            dispatch({ type: 'DOCUMENT/setIsScroll', payload: true })
          }
        >
          請求（アカウント購入）
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link
          to="53"
          onClick={() =>
            dispatch({ type: 'DOCUMENT/setIsScroll', payload: true })
          }
        >
          メンバーの追加方法について
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link
          to="54"
          onClick={() =>
            dispatch({ type: 'DOCUMENT/setIsScroll', payload: true })
          }
        >
          請求書払いについて
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link
          to="55"
          onClick={() =>
            dispatch({ type: 'DOCUMENT/setIsScroll', payload: true })
          }
        >
          契約内容確認ページの見方
        </Link>
      </Menu.Item>
      <Menu.Item>
        <Link
          to="56"
          onClick={() =>
            dispatch({ type: 'DOCUMENT/setIsScroll', payload: true })
          }
        >
          アカウント状況ページの見方
        </Link>
      </Menu.Item>
    </Menu>
  );

  return (
    <div ref={scrollIntoView}>
      <Header />
      <Row>
        {width > 1100 ? (
          <>
            <Col span={6}>
              <NavBar />
            </Col>
            <Col span={18}>{showDoc(id)}</Col>
          </>
        ) : (
          <>
            <Col span={24}>{showDoc(id)}</Col>
            <Dropdown overlay={menu} placement="bottomLeft" trigger={['click']}>
              <Button className={styles.menuButton}>
                <img src={BarsSolid} alt="Menu" />
              </Button>
            </Dropdown>
          </>
        )}
      </Row>
      <Footer />
    </div>
  );
}

export default connect(({ DOCUMENT }) => ({
  documentStore: DOCUMENT,
}))(Documents);
