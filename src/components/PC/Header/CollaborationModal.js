import { Modal } from 'antd';
import CollaborationPage from '../../../pages/Collaboration';
import './stylesModal.less';

export default function CollaborationModal(props) {
  return (
    <Modal
      forceRender={true}
      destroyOnClose={false}
      closable={false}
      maskClosable={false}
      wrapClassName="collaboration-modal"
      visible
    >
      <CollaborationPage onClose={props.onClose} />
    </Modal>
  );
}
