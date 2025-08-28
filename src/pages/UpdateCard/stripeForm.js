import React, { useState } from 'react';
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { Button, Row, Col, Form } from 'antd';
import { useIntl, useHistory } from 'umi';
import './styles.less';
import { connect } from 'dva';

const ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '23px',
      letterSpacing: '0.025em',
      '::placeholder': {
        color: '#c8c8c7',
      },
    },
    invalid: {
      color: 'black',
    },
  },
};

function StripeForm(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const { dispatch } = props;
  const elements = useElements();
  const stripe = useStripe();
  const [cardNumberError, setCardNumberError] = useState(undefined);
  const [cardExpiredError, setCardExpiredError] = useState(undefined);
  const [cardCvcError, setCardCvcError] = useState(undefined);
  const [loadingButton, setLoadingButton] = useState(false);
  const history = useHistory();

  const CARD_NUMBER_OPTIONS = {
    placeholder: formatMessage({
      id: 'i18n_card_number_placeholder',
    }),
  };
  const CARD_EXPIRED_OPTIONS = {
    placeholder: formatMessage({
      id: 'i18n_card_expiration_placeholder',
    }),
  };
  const CARD_CVC_OPTIONS = {
    placeholder: formatMessage({
      id: 'i18n_card_security_code_placeholder',
    }),
  };

  const handleStripeErrorMessage = error => {
    let cardNumberErrorMsg;
    let cardExpiryErrorMsg;
    let cardCvcErrorMsg;
    switch (error.code) {
      case 'incomplete_number':
        cardNumberErrorMsg = error.message;
        break;
      case 'invalid_number':
        cardNumberErrorMsg = error.message;
        break;
      case 'incomplete_expiry':
        cardExpiryErrorMsg = 'i18n_incomplete_card_expiry';
        break;
      case 'invalid_expiry_month':
      case 'invalid_expiry_year':
      case 'invalid_expiry_month_past':
      case 'invalid_expiry_year_past':
        cardExpiryErrorMsg = error.message;
        break;
      case 'incomplete_cvc':
        cardCvcErrorMsg = 'i18n_incomplete_card_cvc';
        break;
      case 'incorrect_cvc':
        cardCvcErrorMsg = error.message;
        break;
      default:
        break;
    }

    if (cardNumberErrorMsg)
      setCardNumberError(formatMessage({ id: cardNumberErrorMsg }));
    if (cardExpiryErrorMsg)
      setCardExpiredError(formatMessage({ id: cardExpiryErrorMsg }));
    if (cardCvcErrorMsg)
      setCardCvcError(formatMessage({ id: cardCvcErrorMsg }));
  };

  const handleClickConfirm = async event => {
    event.preventDefault();
    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }
    const cardElement = elements.getElement(CardNumberElement);
    const { token, error } = await stripe.createToken(cardElement);
    if (error) {
      handleStripeErrorMessage(error);
    } else {
      const payload = {
        stripe_token: token.id,
        // lastDigit: token.card.last4,
      };
      dispatch({
        type: 'PAYMENT/changeCard',
        payload: { reqBody: payload, setLoadingButton, formatMessage },
      });
    }
  };

  const handleChangeInput = name => {
    switch (name) {
      case 'cardNumber':
        setCardNumberError(undefined);
        break;
      case 'cardExpiry':
        setCardExpiredError(undefined);
        break;
      case 'cardCvc':
        setCardCvcError(undefined);
        break;
      default:
        break;
    }
  };

  return (
    <Form layout="vertical">
      <Row gutter={16} className={'stripeForm'}>
        <Col sm={8} xs={24} className={`stripeFormItem`}>
          <Form.Item
            help={cardNumberError}
            label={formatMessage({ id: 'i18n_card_number' })}
          >
            <CardNumberElement
              onChange={() => handleChangeInput('cardNumber')}
              options={{ ...ELEMENT_OPTIONS, ...CARD_NUMBER_OPTIONS }}
            />
          </Form.Item>
        </Col>
        <Col sm={8} xs={24} className={`stripeFormItem`}>
          <Form.Item
            help={cardExpiredError}
            label={formatMessage({ id: 'i18n_card_expiration_date' })}
          >
            <CardExpiryElement
              onChange={() => handleChangeInput('cardExpiry')}
              options={{ ...ELEMENT_OPTIONS, ...CARD_EXPIRED_OPTIONS }}
            />
          </Form.Item>
        </Col>
        <Col sm={8} xs={24} className={`stripeFormItem`}>
          <Form.Item
            help={cardCvcError}
            label={formatMessage({ id: 'i18n_card_security_code' })}
          >
            <CardCvcElement
              onChange={() => handleChangeInput('cardCvc')}
              options={{ ...ELEMENT_OPTIONS, ...CARD_CVC_OPTIONS }}
            />
          </Form.Item>
        </Col>
      </Row>
      <div className={'btnGroup'}>
        <Button
          className={`btn btn-white__shadow btn-custom-height`}
          onClick={() => history.goBack()}
        >
          {formatMessage({ id: 'i18n_turn_back' })}
        </Button>
        <Button
          loading={loadingButton}
          className={`btn btnGreen btn-custom-height`}
          onClick={handleClickConfirm}
        >
          {formatMessage({ id: 'i18n_update_card' })}
        </Button>
      </div>
    </Form>
  );
}

export default connect(({ PAYMENT }) => ({ paymentStore: PAYMENT }))(
  StripeForm,
);
