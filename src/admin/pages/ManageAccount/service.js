import { CONTRACT_BY_TRIAL } from '@/constant';

export const checkValidToUpdate = (prevInfo, newInfo) => {
  if (
    newInfo.contract_type !== CONTRACT_BY_TRIAL &&
    (newInfo.member_period[0] === undefined || newInfo.price === '')
  ) {
    return false;
  }
  return true;
};
