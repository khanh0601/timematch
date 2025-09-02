import { Modal } from 'antd';
import AppointmentDetail from '../../../../AppointmentDetail';
import './stylesPc.less';
import { connect } from 'dva';
import { withRouter } from 'umi';

function EventDetailModal(props) {
  return (
    <Modal
      forceRender={true}
      destroyOnClose={false}
      closable={false}
      maskClosable={false}
      wrapClassName="event-detail-modal"
      visible
    >
      <AppointmentDetail {...props} />
    </Modal>
  );
}

export default connect(({ EVENT, MASTER, VOTE }) => ({
  eventStore: EVENT,
  masterStore: MASTER,
  voteStore: VOTE,
}))(withRouter(EventDetailModal));
