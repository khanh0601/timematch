import React, { useEffect, useState } from 'react';
import { convertStringToData } from '../../../../../commons/function';
import styles from './index.less';
import stylesCalendarTemplate from '../index.less';
import { useDispatch, useSelector } from 'umi';
import ToolboxTemplateAC from '../ToolboxTemplateAC';
import { CALENDAR_TEMPLATE_ITEM } from '../../../../../constant';

const NameCalendar = ({ code, isEdit }) => {
  const { dataCalendarTemplate, optionSelected } = useSelector(
    store => store.SETTING_TEMPLATE,
  );
  const { nameCalendar } = dataCalendarTemplate;

  const [isEditTextBtn, setEditTextBtn] = useState(false);
  const dispatch = useDispatch();

  const showEditText = () => {
    if (!isEdit) {
      return;
    }
    setEditTextBtn(!isEditTextBtn);
  };

  const onChangeNameCalendar = data => {
    updatedDataSettingTemplate({
      ...nameCalendar,
      text: data,
    });
  };

  // update to store setting template
  const updatedDataSettingTemplate = data => {
    dispatch({
      type: 'SETTING_TEMPLATE/updateDataCalendarTemplate',
      payload: {
        key: 'nameCalendar',
        value: data,
      },
    });
  };

  const isShowToolbox = () => {
    return isEdit && optionSelected && code === optionSelected;
  };

  const onChangeOptionSelect = () => {
    dispatch({
      type: 'SETTING_TEMPLATE/setOptionSelected',
      payload: code,
    });
  };

  return (
    <>
      <div style={{ position: 'relative' }} onClick={onChangeOptionSelect}>
        <button
          style={convertStringToData(nameCalendar.styles)}
          onClick={showEditText}
          className={styles.position}
        >
          {isEditTextBtn && (
            <input
              value={nameCalendar.text}
              autoFocus
              placeholder="タイトル"
              onChange={e => onChangeNameCalendar(e.target.value)}
              onBlur={showEditText}
            />
          )}
          {!isEditTextBtn && (
            <span>{nameCalendar.text ? nameCalendar.text : 'タイトル'}</span>
          )}
        </button>
      </div>

      {isShowToolbox() && (
        <div className={stylesCalendarTemplate.toolBoxSetting1}>
          <ToolboxTemplateAC
            templateSelected={optionSelected}
            // type setting toolbox nameCalendar or descriptionCalendar
            valTextTemplate={nameCalendar}
            updateData={updatedDataSettingTemplate}
            nameTemplate="nameCalendar"
          />
        </div>
      )}
    </>
  );
};

export default React.memo(NameCalendar);
