import React, { useEffect, useState } from 'react';
import { useDispatch, useHistory, useLocation } from 'umi';
import { convertStringToData, objValid } from '../../commons/function';
import config from '../../config';

const ButtonEmbed = () => {
  const { query } = useLocation();
  const { form_id, user_code, event_code, tracking } = query;
  const history = useHistory();
  const dispatch = useDispatch();
  const [title, setTitle] = useState('');
  const [styleTitle, setStyles] = useState({
    padding: 0,
  });

  useEffect(() => {
    if (!query?.user_code || !query?.event_code || !query.form_id) {
      history.push('/invalid-url');
      return;
    }
    const loadTemplateGuest = async () => {
      const res = await dispatch({
        type: 'SETTING_TEMPLATE/loadTemplateGuest',
        payload: {
          user_code,
          event_code,
          form_id,
        },
      });

      if (res) {
        const { buttonEmbed } = res;
        if (!buttonEmbed || !objValid(buttonEmbed)) {
          history.push('/invalid-url');
        }
        const { styles, text } = buttonEmbed;
        setTitle(text);
        setStyles({ ...styleTitle, ...convertStringToData(styles) });
        return;
      }

      history.push('/invalid-url');
    };

    loadTemplateGuest();

    // clear data store setting template
    return () => {
      dispatch({
        type: 'SETTING_TEMPLATE/reset',
      });
    };
  }, []);

  const redirectRouter = () => {
    window.top.location.href = `${config.WEB_DOMAIN}/booking-calendar?form_id=${form_id}&user_code=${user_code}&event_code=${event_code}&tracking=${tracking}`;
  };

  return (
    <>
      <button onClick={redirectRouter} style={{ ...styleTitle }}>
        {title}
      </button>
    </>
  );
};
export default ButtonEmbed;
