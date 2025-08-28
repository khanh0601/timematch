import React, { useState, useEffect } from 'react';
import styles from './styles.less';
import Step from '@/components/Step';
import Footer from '@/components/Footer';
import { useIntl } from 'umi';
import { connect } from 'dva';
import { Form, Input, Button, Spin } from 'antd';

function SettingUrl(props) {
  const intl = useIntl();
  const { dispatch, masterStore } = props;
  const { linkUrl } = masterStore;
  const [url, setUrl] = useState(linkUrl.code);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkFirstLogin();
  }, []);

  const checkFirstLogin = async () => {
    setLoading(true);
    await dispatch({ type: 'MASTER/checkFirstSetup', payload: {} });
    setLoading(false);
  };

  useEffect(() => {
    setUrl(linkUrl.code);
    form.setFieldsValue({
      linkUrl: linkUrl.code,
    });
  }, [linkUrl]);

  function onUrlChange(event) {
    setUrl(event.target.value);
  }
  function skipSettingUrl() {
    dispatch({
      type: 'MASTER/skipSettingUrl',
      payload: { is_first_set_up: 0 },
    });
  }

  function updateUrl() {
    form
      .validateFields(['linkUrl'])
      .then(value => {
        const payload = {
          code: url,
          _method: 'put',
        };
        dispatch({
          type: 'MASTER/updateLinkUrl',
          payload: { ...payload, is_first_set_up: 1 },
        });
      })
      .catch(err => {});
  }
  return (
    <Spin spinning={loading}>
      <div className={styles.settingUrl}>
        <div className={styles.urlRule}>
          <div className={styles.urlRuleGreen}>
            {intl.formatMessage({ id: 'i18n_url_rule_1' })}
          </div>
          <div className={styles.subUrlRule}>
            {' '}
            {intl.formatMessage({ id: 'i18n_url_rule_2' })}
          </div>
        </div>
        <Step step={1} />
        <div className={styles.urlContent}>
          <div className={styles.urlContentDescript}>
            {intl.formatMessage({ id: 'i18n_url_content_1' })}
            <br />
            {intl.formatMessage({ id: 'i18n_url_content_2' })}
          </div>
          <div className={styles.urlContentGrey}>
            &nbsp;{intl.formatMessage({ id: 'i18n_url_content_3' })}
          </div>
          <Form form={form}>
            <Form.Item
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'i18n_required_url' }),
                },
                {
                  pattern: '^[a-z0-9-_]*$',
                  message: intl.formatMessage({ id: 'i18n_format_text' }),
                },
              ]}
              name={'linkUrl'}
              className={styles.urlFormItem}
            >
              <div className={styles.urlForm}>
                <div className={styles.urlLabel}>smoothly.jp/</div>
                <Input
                  type="text"
                  placeholder={intl.formatMessage({
                    id: 'i18n_add_url_placeholder',
                  })}
                  className={styles.urlInput}
                  value={url}
                  onChange={event => onUrlChange(event)}
                />
              </div>
            </Form.Item>
            <Form.Item>
              <div className="btnGroup">
                <Button className="btn btnWhite" onClick={skipSettingUrl}>
                  {intl.formatMessage({ id: 'i18n_btn_later' })}
                </Button>
                <Button className="btn btnGreen" onClick={updateUrl}>
                  {intl.formatMessage({ id: 'i18n_btn_next' })}
                </Button>
              </div>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Footer />
    </Spin>
  );
}

export default connect(({ MASTER }) => ({
  masterStore: MASTER,
}))(SettingUrl);
