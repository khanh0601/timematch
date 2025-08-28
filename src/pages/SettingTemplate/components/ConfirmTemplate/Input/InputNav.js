import React from 'react';
import PropTypes from 'prop-types';
import styles from '../index.less';

import { Input } from 'antd';

const { TextArea } = Input;

function InputNav(props) {
  return (
    <div className={styles.inputNavigator}>
      <div
        className={
          props.isSecondaryTitle ? styles.secondaryTitle : styles.primaryTitle
        }
      >
        <div>{props.title}</div>
      </div>
      {props.isTextArea ? (
        <TextArea
          placeholder={props.placeholder}
          className={styles.textAreaCptNav}
          onChange={props.onChange}
          value={props.value}
        />
      ) : (
        <Input
          placeholder={props.placeholder}
          className={styles.input}
          value={props.value}
          onChange={props.onChange}
        />
      )}
    </div>
  );
}

InputNav.propTypes = {
  primaryTitle: PropTypes.string,
  placeholder: PropTypes.string,
  isSecondaryTitle: PropTypes.bool,
  isTextArea: PropTypes.bool,
};

export default InputNav;
