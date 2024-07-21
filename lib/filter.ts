import { GeneralTxItem } from './types';

export const txFilter_Standard = (tx: GeneralTxItem, contractAddress: string, methodIds: string[]): boolean => {
  if (tx.methodId && tx.to.toLowerCase() === contractAddress.toLowerCase()) {
    if (methodIds.includes(tx.methodId)) {
      return true;
    }
  }
  return false;
};

export const txFilter_Contract = (tx: GeneralTxItem, contractAddress: string): boolean => {
  if (tx.to.toLowerCase() === contractAddress.toLowerCase()) {
    return true;
  }
  return false;
};

export const txFilter_Any = (tx: GeneralTxItem): boolean => {
  return true;
};
