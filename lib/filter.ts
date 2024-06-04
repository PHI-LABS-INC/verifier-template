import { GeneralTxItem } from './types';

export const txFilter_Standard = (tx: GeneralTxItem, contractAddress: string, methodId: string): boolean => {
  if (tx.to.toLowerCase() === contractAddress.toLowerCase()) {
    if (methodId === tx.methodId) {
      return true;
    }
  }
  return false;
};

export const txFilter_Any = (tx: GeneralTxItem): boolean => {
  return true;
};
