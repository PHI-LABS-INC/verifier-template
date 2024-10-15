import { verifyBalance } from '../api/balance-of-eth-base';
import { verifyTx } from '../api/create-tx-base';
import dotenv from 'dotenv';
dotenv.config();
jest.setTimeout(30000); // Increase timeout for API calls

describe('verify functions', () => {
  describe('balance-of-eth-base', () => {
    it('should return true for address with sufficient balance', async () => {
      const address = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'; // Replace with a known address with balance > 0.1 ETH
      const [result, balance] = await verifyBalance(address);
      expect(result).toBe(true);
      expect(parseFloat(balance)).toBeGreaterThanOrEqual(0.1);
    });

    it('should return false for address with insufficient balance', async () => {
      const address = '0x98135e44E7aa1CbB58d3Fa3E7A67C22BC28b9151';
      const [result, balance] = await verifyBalance(address);
      expect(result).toBe(false);
      expect(parseFloat(balance)).toBeLessThan(0.1);
    });
  });

  describe('create-tx-base', () => {
    it('should return true for address with transactions', async () => {
      const address = '0x5037e7747fAa78fc0ECF8DFC526DcD19f73076ce'; // Replace with a known address with transactions
      const [result, txCount] = await verifyTx(address);
      expect(result).toBe(true);
      expect(parseInt(txCount)).toBeGreaterThan(0);
    });

    it('should return false for address without transactions', async () => {
      const address = '0xa0815253aC4D6C3918124BB97f60edb0bF15EfD30';
      const [result, txCount] = await verifyTx(address);
      expect(result).toBe(false);
      expect(parseInt(txCount)).toBe(0);
    });
  });
});
