import { check_cred } from '../lib/check';

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

    const [result, data] = await check_cred(address, id);
    expect(result).toBe(true);
    expect(data).toBe(expectedData);
  });

  it('cred:2 should return correct result', async () => {
    const address = '0x5037e7747fAa78fc0ECF8DFC526DcD19f73076ce';
    const id = 2;
    const expectedData = '1718909207';

    const [result, data] = await check_cred(address, id);
    console.log(result, data);
    expect(result).toBe(true);
    expect(data).toBe(expectedData);
  });

  it('cred:0 should return false result', async () => {
    const address = '0xb7Caa0ed757bbFaA208342752C9B1c541e36a4b9';
    const id = 0;
    const expectedData = '';
    const [result, data] = await check_cred(address, id);

    expect(result).toBe(false);
    expect(data).toBe(expectedData);
  });

  it('cred:2 should return 0 data', async () => {
    const address = '0xb7Caa0ed757bbFaA208342752C9B1c541e36a4b9';
    const id = 2;
    const expectedData = '0';
    const [result, data] = await check_cred(address, id);

    expect(result).toBe(true);
    expect(data).toBe(expectedData);
  });
});
