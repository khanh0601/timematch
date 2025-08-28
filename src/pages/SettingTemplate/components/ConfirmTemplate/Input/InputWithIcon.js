import React from 'react';
import styles from '../index.less';
import { Input } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import Trash from '../../../../../components/Icon/Trash';

function InputWithIcon(props) {
  return (
    <div className={styles.inputComponent}>
      <div className={styles.inputArrorButton}>
        <ArrowUpOutlined
          style={{ fontSize: '12px', transform: 'translateY(1px)' }}
          onClick={() => {
            props.onClick('up');
          }}
        />
        <ArrowDownOutlined
          style={{ fontSize: '12px', transform: 'translateY(-1px)' }}
          onClick={() => {
            props.onClick('down');
          }}
        />
      </div>
      <Input
        placeholder={props.placeholder}
        className={styles.inputCmt}
        value={props.value}
        onChange={props.onChange}
      />
      <div
        className={styles.iconTrash}
        onClick={e => {
          e.stopPropagation();
          props.onDelete();
        }}
      >
        <Trash />
      </div>
    </div>
  );
}

export default InputWithIcon;
