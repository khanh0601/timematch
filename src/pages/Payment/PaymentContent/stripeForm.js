import React, { useState } from 'react';
import {
  CardNumberElement,
  CardCvcElement,
  CardExpiryElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { Button, Tooltip } from 'antd';
import { useIntl, useHistory } from 'umi';
import { logEvent, ErrorResult } from './util';
import './styles.less';
import styles from '../styles.less';
import { connect } from 'dva';
import helperImage from '@/assets/images/imgQuestion.png';
import cvcImage from '@/assets/images/CVC.png';

const ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
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

const renderErrorMsg = error => {
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

  return { cardNumberErrorMsg, cardExpiryErrorMsg, cardCvcErrorMsg };
};

function StripeForm(props) {
  const intl = useIntl();
  const { formatMessage } = intl;
  const { setIsOpenReviewPayment, dispatch } = props;
  const elements = useElements();
  const stripe = useStripe();
  const [cardNumberError, setCardNumberError] = useState(undefined);
  const [cardExpiryError, setCardExpiryError] = useState(undefined);
  const [cardCvcError, setCardCvcError] = useState(undefined);
  const [errorMessage, setErrorMessage] = useState(null);
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
      const {
        cardNumberErrorMsg,
        cardExpiryErrorMsg,
        cardCvcErrorMsg,
      } = renderErrorMsg(error);
      cardNumberErrorMsg &&
        setCardNumberError(formatMessage({ id: cardNumberErrorMsg }));
      cardExpiryErrorMsg &&
        setCardExpiryError(formatMessage({ id: cardExpiryErrorMsg }));
      cardCvcErrorMsg &&
        setCardCvcError(formatMessage({ id: cardCvcErrorMsg }));
    } else {
      const payload = {
        token: token.id,
        lastDigit: token.card.last4,
      };
      setCardNumberError(undefined);
      setCardExpiryError(undefined);
      setCardCvcError(undefined);
      await dispatch({ type: 'PAYMENT/updatePaymentInfo', payload });
      setIsOpenReviewPayment(true);
    }
  };

  const handleChangeInput = event => {
    const { elementType } = event;
    elementType === 'cardNumber' && setCardNumberError(undefined);
    elementType === 'cardExpiry' && setCardExpiryError(undefined);
    elementType === 'cardCvc' && setCardCvcError(undefined);
  };

  return (
    <div>
      <div className={styles.stripeForm}>
        <div className={`${styles.stripeFormItem} ${styles.cardNumber}`}>
          <label className={styles.label} htmlFor="cardNumber">
            {formatMessage({ id: 'i18n_card_number' })}
          </label>
          <CardNumberElement
            id="cardNumber"
            onChange={handleChangeInput}
            options={{ ...ELEMENT_OPTIONS, ...CARD_NUMBER_OPTIONS }}
          />
          {cardNumberError ? (
            <ErrorResult>{cardNumberError}</ErrorResult>
          ) : (
            <div className="emptyError" />
          )}
        </div>
        <div className={`${styles.stripeFormItem} ${styles.cardExprired}`}>
          <label className={styles.label} htmlFor="expiry">
            <div className={styles.tooltipStyle}>
              {formatMessage({ id: 'i18n_card_expiration_date' })}
              <Tooltip
                title={formatMessage({
                  id: 'i18n_card_expiration_date_tooltip',
                })}
                overlayClassName={styles.tooltipAdvanced}
              >
                <img src={helperImage} className="helper" />
              </Tooltip>
            </div>
          </label>
          <CardExpiryElement
            id="expiry"
            onChange={handleChangeInput}
            options={{ ...ELEMENT_OPTIONS, ...CARD_EXPIRED_OPTIONS }}
          />
          {cardExpiryError ? (
            <ErrorResult>{cardExpiryError}</ErrorResult>
          ) : (
            <div className="emptyError" />
          )}
        </div>
        <div className={`${styles.stripeFormItem} ${styles.cardCVC}`}>
          <label className={styles.label} htmlFor="cvc">
            <div className={styles.tooltipStyle}>
              {formatMessage({ id: 'i18n_card_security_code' })}
              <Tooltip
                title={<img src={cvcImage} />}
                overlayClassName={styles.cvcCustom}
              >
                <img src={helperImage} />
              </Tooltip>
            </div>
          </label>
          <CardCvcElement
            id="cvc"
            onChange={handleChangeInput}
            options={{ ...ELEMENT_OPTIONS, ...CARD_CVC_OPTIONS }}
          />
          {cardCvcError ? (
            <ErrorResult>{cardCvcError}</ErrorResult>
          ) : (
            <div className="emptyError" />
          )}
        </div>
      </div>
      <div className={styles.paymentBtnGroup}>
        <Button
          className={`btn btn-white__shadow btn-custom-height`}
          onClick={() => history.goBack()}
        >
          {formatMessage({ id: 'i18n_turn_back' })}
        </Button>
        <Button
          className={`btn btnGreen btn-custom-height`}
          onClick={handleClickConfirm}
        >
          {formatMessage({ id: 'i18n_confirm' })}
        </Button>
      </div>
    </div>
  );
}

export default connect(({ PAYMENT }) => ({ paymentStore: PAYMENT }))(
  StripeForm,
);
