import React, { useState, useEffect } from 'react';
import styles from './styles.less';
import pinion from '@/assets/images/i-pinion.svg';
import { Row, Col, Select, Button, Input, Collapse, TimePicker } from 'antd';
import helper from '@/assets/images/imgQuestion.png';
import clock from '@/assets/images/i-clock.svg';
import message from '@/assets/images/message-setting.png';
import { useIntl, history } from 'umi';
import bubbleArrow from '@/assets/images/i-bubble-arrow.svg';
import moment from 'moment';
import { DownOutlined } from '@ant-design/icons';
import { connect } from 'dva';

function AdvancedSetting(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const { Option } = Select;
  const { Panel } = Collapse;
  const format = 'HH:mm';
  const suffixIcon = <DownOutlined />;
  const { dispatch, calendarStore } = props;
  const { advancedSetting } = calendarStore;
  const headerScheduleSetting = (
    <div className={styles.timeSetting}>
      <div className={styles.dropdownHeader}>
        <img src={pinion} />
        <div className={styles.dropdownHeaderTitle}>
          {formatMessage({ id: 'i18n_set_schedule' })}
        </div>
      </div>
    </div>
  );
  const timeSetting = (
    <div className={styles.timeSetting}>
      <div className={styles.dropdownHeader}>
        <img src={clock} />
        <div className={styles.dropdownHeaderTitle}>
          {formatMessage({ id: 'i18n_time_setting' })}
        </div>
        <div className={styles.helper}>
          <img src={helper} />
          <div className={styles.helperTooltip}>
            <img src={bubbleArrow} />
            詳細メッセージ
          </div>
        </div>
      </div>
    </div>
  );
  const messageSetting = (
    <div className={styles.timeSetting}>
      <div className={styles.dropdownHeader}>
        <img src={message} />
        <div className={styles.dropdownHeaderTitle}>
          {formatMessage({ id: 'i18n_message_setting' })}
        </div>
      </div>
    </div>
  );
  function updateScheduleSetting() {
    // const payload={
    //   eventTypeId:
    // }
  }
  return (
    <div className={styles.advancedSetting}>
      <Collapse expandIconPosition="right" defaultActiveKey={['1', '2', '3']}>
        <Panel
          header={headerScheduleSetting}
          key="1"
          className={styles.collapse}
        >
          <div className={styles.listField}>
            <Row>
              <Col span={8}>
                <div className={styles.listFieldColumn}>
                  <div className={styles.selectField}>
                    <div className={styles.titleField}>
                      <div className={styles.titleFieldIcon}></div>
                      <p>{formatMessage({ id: 'i18n_working_time' })}</p>
                    </div>
                    <div className={styles.selections}>
                      <TimePicker
                        defaultValue={moment('09:00', format)}
                        format={format}
                        minuteStep={15}
                        suffixIcon={suffixIcon}
                        clearIcon={suffixIcon}
                        allowClear={false}
                        showNow={false}
                      />
                      <span className={styles.devideIcon}>〜</span>
                      <TimePicker
                        defaultValue={moment('18:00', format)}
                        format={format}
                        minuteStep={15}
                        suffixIcon={suffixIcon}
                        clearIcon={suffixIcon}
                        allowClear={false}
                        showNow={false}
                      />
                    </div>
                  </div>
                  <div className={styles.selectField}>
                    <div className={styles.titleField}>
                      <div className={styles.titleFieldIcon}></div>
                      <p>
                        {formatMessage({ id: 'i18n_time_to_start_welcome' })}
                      </p>
                      <div className={styles.helper}>
                        <img src={helper} />
                        <div className={styles.helperTooltip}>
                          <img src={bubbleArrow} />
                          詳細メッセージ
                        </div>
                      </div>
                    </div>
                    <div className={styles.selections}>
                      <Select
                        defaultValue="1時間"
                        style={{ width: 120 }}
                        onChange={() => {}}
                      >
                        <Option value="1時間">時間</Option>
                        <Option value="3時間">3時間</Option>
                        <Option value="6時間">6時間</Option>
                        <Option value="12時間">12時間</Option>
                        <Option value="24時間">24時間</Option>
                        <Option value="other">カスタム</Option>
                      </Select>
                    </div>
                  </div>
                  <div className={styles.selectField}>
                    <div className={styles.titleField}>
                      <div className={styles.titleFieldIcon}></div>
                      <p>{formatMessage({ id: 'i18n_ordered_amount' })}</p>
                    </div>
                    <div className={styles.selections}>
                      <Select
                        defaultValue="50候補"
                        style={{ width: 120 }}
                        onChange={() => {}}
                      >
                        <Option value="50候補">50候補</Option>
                        <Option value="100候補">100候補</Option>
                        <Option value="150候補">3時間</Option>
                        <Option value="200候補">200候補</Option>
                        <Option value="250候補">250候補</Option>
                        <Option value="カスタム ">カスタム </Option>
                      </Select>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.listFieldColumn}>
                  <div className={styles.selectField}>
                    <div className={styles.titleField}>
                      <div className={styles.titleFieldIcon}></div>
                      <p>{formatMessage({ id: 'i18n_break_time' })}</p>
                      <div className={styles.helper}>
                        <img src={helper} />
                        <div className={styles.helperTooltip}>
                          <img src={bubbleArrow} />
                          詳細メッセージ
                        </div>
                      </div>
                    </div>
                    <div className={styles.selections}>
                      <Select
                        defaultValue="15分"
                        style={{ width: 120 }}
                        onChange={() => {}}
                      >
                        <Option value="15分">15分</Option>
                        <Option value="30分">30分</Option>
                        <Option value="45分">45分</Option>
                        <Option value="60分">60分</Option>
                        <Option value="other">カスタム</Option>
                      </Select>
                    </div>
                  </div>
                  <div className={styles.selectField}>
                    <div className={styles.titleField}>
                      <div className={styles.titleFieldIcon}></div>
                      <p>{formatMessage({ id: 'i18n_snap' })}</p>
                    </div>
                    <div className={styles.selections}>
                      <TimePicker
                        defaultValue={moment('09:00', format)}
                        format={format}
                        minuteStep={15}
                        suffixIcon={suffixIcon}
                        clearIcon={suffixIcon}
                        allowClear={false}
                        showNow={false}
                      />
                      <span className={styles.devideIcon}>〜</span>
                      <TimePicker
                        defaultValue={moment('09:00', format)}
                        format={format}
                        minuteStep={15}
                        suffixIcon={suffixIcon}
                        clearIcon={suffixIcon}
                        allowClear={false}
                        showNow={false}
                      />
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div className={styles.listFieldColumn}>
                  <div className={styles.selectField}>
                    <div className={styles.titleField}>
                      <div className={styles.titleFieldIcon}></div>
                      <p>{formatMessage({ id: 'i18n_stage' })}</p>
                      <div className={styles.helper}>
                        <img src={helper} />
                        <div className={styles.helperTooltip}>
                          <img src={bubbleArrow} />
                          詳細メッセージ
                        </div>
                      </div>
                    </div>
                    <div className={styles.selections}>
                      <Select
                        defaultValue="設定なし"
                        style={{ width: 120 }}
                        onChange={() => {}}
                      >
                        <Option value="設定なし">設定なし</Option>
                        <Option value="1時間">1時間</Option>
                        <Option value="3時間">3時間</Option>
                        <Option value="12時間">12時間</Option>
                        <Option value="24時間">12時間</Option>
                        <Option value="カスタム ">カスタム </Option>
                      </Select>
                    </div>
                  </div>
                  <div className={styles.selectField}>
                    <div className={styles.titleField}>
                      <div className={styles.titleFieldIcon}></div>
                      <p>
                        {formatMessage({ id: 'i18n_time_to_stop_welcome' })}
                      </p>
                      <div className={styles.helper}>
                        <img src={helper} />
                        <div className={styles.helperTooltip}>
                          <img src={bubbleArrow} />
                          詳細メッセージ
                        </div>
                      </div>
                    </div>
                    <div className={styles.selections}>
                      <Select
                        defaultValue="1週間"
                        style={{ width: 120 }}
                        onChange={() => {}}
                      >
                        <Option value="1週間">1週間</Option>
                        <Option value="2週間">2週間</Option>
                        <Option value="3週間">3時間</Option>
                        <Option value="4週間">4週間</Option>
                        <Option value="カスタム ">カスタム </Option>
                      </Select>
                    </div>
                  </div>
                </div>
              </Col>
              <Col span={24}>
                <div className={styles.buttonZone}>
                  <Button className={styles.cancelBtn}>
                    {formatMessage({ id: 'i18n_cancel' })}
                  </Button>
                  <Button
                    className={styles.saveBtn}
                    onClick={() => updateScheduleSetting()}
                  >
                    {formatMessage({ id: 'i18n_set' })}
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
        </Panel>
        <Panel header={timeSetting} key="2" className={styles.collapse}>
          <div className={styles.selectField}>
            <div className={styles.titleField}>
              <div className={styles.titleFieldIcon}></div>
              <p>{formatMessage({ id: 'i18n_detail_time' })} 1</p>
            </div>
            <div className={styles.selections}>
              <TimePicker
                defaultValue={moment('09:00', format)}
                format={format}
                minuteStep={15}
                suffixIcon={suffixIcon}
                clearIcon={suffixIcon}
                allowClear={false}
                showNow={false}
              />
              <span className={styles.devideIcon}>〜</span>
              <TimePicker
                defaultValue={moment('18:00', format)}
                format={format}
                minuteStep={15}
                suffixIcon={suffixIcon}
                clearIcon={suffixIcon}
                allowClear={false}
                showNow={false}
              />
            </div>
          </div>
          <div className={styles.selectField}>
            <div className={styles.titleField}>
              <div className={styles.titleFieldIcon}></div>
              <p>{formatMessage({ id: 'i18n_detail_time' })} 2</p>
            </div>
            <div className={styles.selections}>
              <TimePicker
                defaultValue={moment('09:00', format)}
                format={format}
                minuteStep={15}
                suffixIcon={suffixIcon}
                clearIcon={suffixIcon}
                allowClear={false}
                showNow={false}
              />
              <span className={styles.devideIcon}>〜</span>
              <TimePicker
                defaultValue={moment('18:00', format)}
                format={format}
                minuteStep={15}
                suffixIcon={suffixIcon}
                clearIcon={suffixIcon}
                allowClear={false}
                showNow={false}
              />
            </div>
          </div>
          <div className={styles.selectField}>
            <div className={styles.titleField}>
              <div className={styles.titleFieldIcon}></div>
              <p>{formatMessage({ id: 'i18n_detail_time' })} 3</p>
            </div>
            <div className={styles.selections}>
              <TimePicker
                defaultValue={moment('09:00', format)}
                format={format}
                minuteStep={15}
                suffixIcon={suffixIcon}
                clearIcon={suffixIcon}
                allowClear={false}
                showNow={false}
              />
              <span className={styles.devideIcon}>〜</span>
              <TimePicker
                defaultValue={moment('18:00', format)}
                format={format}
                minuteStep={15}
                suffixIcon={suffixIcon}
                clearIcon={suffixIcon}
                allowClear={false}
                showNow={false}
              />
            </div>
          </div>
          <div className={styles.selectField}>
            <div className={styles.titleField}>
              <div className={styles.titleFieldIcon}></div>
              <p>{formatMessage({ id: 'i18n_detail_time' })} 4</p>
            </div>
            <div className={styles.selections}>
              <TimePicker
                defaultValue={moment('09:00', format)}
                format={format}
                minuteStep={15}
                suffixIcon={suffixIcon}
                clearIcon={suffixIcon}
                allowClear={false}
                showNow={false}
              />
              <span className={styles.devideIcon}>〜</span>
              <TimePicker
                defaultValue={moment('18:00', format)}
                format={format}
                minuteStep={15}
                suffixIcon={suffixIcon}
                clearIcon={suffixIcon}
                allowClear={false}
                showNow={false}
              />
            </div>
          </div>
          <div className={styles.selectField}>
            <div className={styles.titleField}>
              <div className={styles.titleFieldIcon}></div>
              <p>{formatMessage({ id: 'i18n_detail_time' })} 5</p>
            </div>
            <div className={styles.selections}>
              <TimePicker
                defaultValue={moment('09:00', format)}
                format={format}
                minuteStep={15}
                suffixIcon={suffixIcon}
                clearIcon={suffixIcon}
                allowClear={false}
                showNow={false}
              />
              <span className={styles.devideIcon}>〜</span>
              <TimePicker
                defaultValue={moment('18:00', format)}
                format={format}
                minuteStep={15}
                suffixIcon={suffixIcon}
                clearIcon={suffixIcon}
                allowClear={false}
                showNow={false}
              />
            </div>
          </div>

          <div className={styles.buttonZone}>
            <Button className={styles.cancelBtn}>
              {formatMessage({ id: 'i18n_cancel' })}
            </Button>
            <Button className={styles.saveBtn}>
              {formatMessage({ id: 'i18n_set' })}
            </Button>
          </div>
        </Panel>
        <Panel
          header={messageSetting}
          key="3"
          className={`${styles.message} ${styles.collapse}`}
        >
          <p className={styles.intruction}>
            {formatMessage({ id: 'i18n_message_setting_intruction' })}
          </p>
          <div className={styles.textareaField}>
            <div className={styles.titleField}>
              <div className={styles.titleFieldIcon}></div>
              <p>
                {formatMessage({
                  id: 'i18n_message_announced_when_start_adjust',
                })}
              </p>
              <div className={styles.helper}>
                <img src={helper} />
                <div className={styles.helperTooltip}>
                  <img src={bubbleArrow} />
                  詳細メッセージ
                </div>
              </div>
            </div>
            <Input.TextArea
              placeholder={formatMessage({
                id: 'i18n_message_announced_when_start_adjust_placeholder',
              })}
            ></Input.TextArea>
          </div>
          <div className={styles.textareaField}>
            <div className={styles.titleField}>
              <div className={styles.titleFieldIcon}></div>
              <p>
                {formatMessage({
                  id: 'i18n_message_announced_when_stop_adjust',
                })}
              </p>
              <div className={styles.helper}>
                <img src={helper} />
                <div className={styles.helperTooltip}>
                  <img src={bubbleArrow} />
                  詳細メッセージ
                </div>
              </div>
            </div>
            <Input.TextArea
              placeholder={formatMessage({
                id: 'i18n_message_announced_when_stop_adjust_placeholder',
              })}
            ></Input.TextArea>
          </div>
          <div className={styles.buttonZone}>
            <Button className={styles.cancelBtn}>
              {formatMessage({ id: 'i18n_cancel' })}
            </Button>
            <Button className={styles.saveBtn}>
              {formatMessage({ id: 'i18n_set' })}
            </Button>
          </div>
        </Panel>
      </Collapse>
      <div className={styles.buttonZone}>
        <Button className={styles.backBtn}>
          {formatMessage({ id: 'i18n_back' })}
        </Button>
      </div>
    </div>
  );
}

export default connect(({ CALENDAR }) => ({
  calendarStore: CALENDAR,
}))(AdvancedSetting);
