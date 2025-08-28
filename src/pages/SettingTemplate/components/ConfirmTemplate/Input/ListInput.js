import React, { useCallback, useEffect } from 'react';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { INPUT_TYPE, REQUIRED_STATUS } from '../../../../../constant';
import CheckboxSetting from './InputCheckbox';
import InputSetting from './InputCmp';
import TextareaSetting from './InputTextarea';

function ListInput(props) {
  const { items, dispatch, policy, questionSelect } = props;

  // ******************* Start function with redux ***************************

  useEffect(() => {
    return () => {
      dispatch({
        type: 'SETTING_TEMPLATE/resetStore',
        payload: {},
      });
    };
  }, []);

  const handleMove = useCallback((id, direction) => {
    dispatch({
      type: 'SETTING_TEMPLATE/moveQuestion',
      payload: {
        keyId: id,
        direction,
      },
    });
  }, []);

  const onSelectQuestion = useCallback(id => {
    dispatch({
      type: 'SETTING_TEMPLATE/selectQuestion',
      payload: {
        keyId: id,
      },
    });
  }, []);

  const onDeleteQuestion = useCallback(id => {
    dispatch({
      type: 'SETTING_TEMPLATE/deleteQuestion',
      payload: {
        keyId: id,
      },
    });
  }, []);

  const onChangeDataInput = useCallback((keyId, keyName, value, typeInput) => {
    dispatch({
      type: 'SETTING_TEMPLATE/onChangeDataInput',
      payload: {
        keyId,
        keyName,
        value,
        typeInput,
      },
    });
  }, []);

  // ******************* End function with redux ***************************

  // ******************* Start function UI ***************************
  const handleRenderInput = item => {
    const {
      id,
      type,
      index,
      status,
      contents,
      placeholder,
      question_name,
      key_id,
    } = item;

    const idSelect = questionSelect ? questionSelect.key_id : '';

    switch (type) {
      case INPUT_TYPE.text:
        return (
          <InputSetting
            id={id || new Date().getTime()}
            title={question_name || ''}
            editInput
            isRequired={status === REQUIRED_STATUS.required}
            placeholder={placeholder || ''}
            selected={idSelect === key_id}
            onClick={onSelectQuestion}
            onMove={handleMove}
            keyId={key_id}
            onDelete={onDeleteQuestion}
            onChange={onChangeDataInput}
          />
        );
      case INPUT_TYPE.checkbox:
        return (
          <CheckboxSetting
            id={id || new Date().getTime()}
            title={question_name || ''}
            editInput
            isRequired={status === REQUIRED_STATUS.required}
            listOption={contents || ''}
            subtitle={placeholder || ''}
            selected={idSelect === key_id}
            onClick={onSelectQuestion}
            onMove={handleMove}
            keyId={key_id}
            onDelete={onDeleteQuestion}
            onChange={onChangeDataInput}
          />
        );
      case INPUT_TYPE.policy:
        return (
          <TextareaSetting
            title={item.title || ''}
            isRequired={item.checkbox === REQUIRED_STATUS.required}
            labelRequired={item.text_require || ''}
            labelLink={item.link || '#'}
            description={item.content || ''}
            messageError={item.note || ''}
            selected={idSelect === key_id}
            keyId={item.key_id}
            onClick={onSelectQuestion}
            onDelete={onDeleteQuestion}
            onMove={handleMove}
            onChange={onChangeDataInput}
            editInput
          />
        );
      default:
        return <></>;
    }
  };

  // ******************* End function UI ***************************

  return (
    <>
      {items &&
        items.map(item => (
          <React.Fragment key={item.key_id}>
            {handleRenderInput(item)}
          </React.Fragment>
        ))}
    </>
  );
}

ListInput.propTypes = {
  items: PropTypes.array,
};

export default connect(({ SETTING_TEMPLATE }) => ({
  items: SETTING_TEMPLATE.listQuestion,
  questionSelect: SETTING_TEMPLATE.questionSelected,
}))(ListInput);
