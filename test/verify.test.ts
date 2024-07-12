import { check_cred } from '../lib/check';
import { createPublicClient, http } from 'viem';
import { credConfig } from '../lib/creds';

jest.mock('viem', () => ({
  createPublicClient: jest.fn().mockReturnValue({
    readContract: jest.fn(),
  }),
  http: jest.fn(),
}));

describe('verify', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('cred:0 should return correct result', async () => {
    const address = '0x5037e7747fAa78fc0ECF8DFC526DcD19f73076ce';
    const id = 0;
    const expectedData = '';

    const mockReadContract = jest.fn().mockResolvedValue(expectedData);
    (createPublicClient as jest.Mock).mockReturnValue({
      readContract: mockReadContract,
    });

    const [result, data] = await check_cred(address, id);

    expect(result).toBe(true);
    expect(data).toBe(expectedData);
  });

  it('cred:0 should return false result', async () => {
    const address = '0xb7Caa0ed757bbFaA208342752C9B1c541e36a4b9';
    const id = 0;
    const expectedData = '';

    const mockReadContract = jest.fn().mockResolvedValue(expectedData);
    (createPublicClient as jest.Mock).mockReturnValue({
      readContract: mockReadContract,
    });

    const [result, data] = await check_cred(address, id);

    expect(result).toBe(false);
    expect(data).toBe(expectedData);
  });
});
