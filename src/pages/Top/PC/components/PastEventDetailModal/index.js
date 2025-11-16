import { Modal } from 'antd';
import PastAppointmentDetail from '../../../../PastAppointmentDetail';
import './stylesPc.less';
import { connect } from 'dva';
import { withRouter } from 'umi';
import useIsMobile from '@/hooks/useIsMobile';

function PastEventDetailModal(props) {
  const isMobile = useIsMobile();
  return (
    <Modal
      mask={isMobile ? false : true}
      forceRender={true}
      destroyOnClose={false}
      closable={false}
      maskClosable={false}
      wrapClassName="past-event-detail-modal"
      visible
    >
      <PastAppointmentDetail {...props} />
    </Modal>
  );
}

export default connect(({ EVENT, MASTER, VOTE }) => ({
  eventStore: EVENT,
  masterStore: MASTER,
  voteStore: VOTE,
}))(withRouter(PastEventDetailModal));
