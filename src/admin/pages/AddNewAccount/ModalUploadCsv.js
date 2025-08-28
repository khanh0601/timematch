import React, { useState } from 'react';
import { useIntl } from 'umi';
import { Modal, Input, Upload, Form, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { connect } from 'dva';

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
};

function ModalUploadCsv({ onCancel, visible, dispatch }) {
  const [form] = Form.useForm();
  const intl = useIntl();
  const { formatMessage } = intl;
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmitFile = values => {
    const formData = new FormData();
    formData.append('file', values.upload.file.originFileObj);
    // formData.append('price', values.amount);
    dispatch({
      type: 'ADMIN/bulkCreateAccount',
      payload: {
        formData,
        formatMessage,
        setLoading,
        onCreateSuccess: () => {
          form.resetFields();
          setSelectedFiles([]);
          onCancel();
        },
      },
    });
  };

  const handleFileUpload = ({ onSuccess }) => {
    setTimeout(() => {
      onSuccess('ok');
    }, 0);
  };

  const handleChangeUpload = info => {
    let nextFiles = [];
    switch (info.file.status) {
      case 'uploading':
        nextFiles = [info.file];
        break;
      case 'done':
        nextFiles = [info.file];
        break;
      default:
        // error or removed
        nextFiles = [];
    }
    setSelectedFiles(nextFiles);
  };

  const handleChangeAmount = e => {
    const { value } = e.target;
    form.setFields([
      {
        name: 'amount',
        value: value.replace(/[^0-9]/g, ''),
      },
    ]);
  };

  return (
    <Modal
      forceRender={true}
      destroyOnClose={false}
      closable={false}
      maskClosable={false}
      wrapClassName="createUserModal"
      visible={visible}
      onCancel={() => {
        form.resetFields();
        setSelectedFiles([]);
        onCancel();
      }}
      okButtonProps={{ form: 'create-user-form', htmlType: 'submit', loading }}
      okText={formatMessage({ id: 'i18n_create' })}
    >
      <Form
        id="create-user-form"
        onFinish={handleSubmitFile}
        colon={false}
        form={form}
      >
        {/* <Form.Item
          {...formItemLayout}
          rules={[
            {
              required: true,
              message: formatMessage({ id: 'i18n_required_text' }),
            },
          ]}
          name="amount"
          label={formatMessage({ id: 'i18n_amount' })}
        >
          <Input
            onChange={handleChangeAmount}
            placeholder={formatMessage({ id: 'i18n_amount' })}
          />
        </Form.Item> */}

        <Form.Item
          {...formItemLayout}
          name="upload"
          rules={[
            {
              validator: () => {
                if (selectedFiles.length === 0) {
                  return Promise.reject(
                    formatMessage({ id: 'i18n_required_text' }),
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
          label={formatMessage({ id: 'i18n_upload_file_csv' })}
        >
          <Upload
            fileList={selectedFiles}
            customRequest={handleFileUpload}
            onChange={handleChangeUpload}
            className="btn-upload-csv"
            accept=".xlsm"
          >
            <Button icon={<UploadOutlined />}>
              {formatMessage({ id: 'i18n_click_to_upload' })}
            </Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default connect(({ ADMIN }) => ({ adminStore: ADMIN }))(ModalUploadCsv);
