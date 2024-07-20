import { Hex, encodeAbiParameters, keccak256, parseAbiParameters, toBytes, toHex } from 'viem';
import { create_signature } from '../lib/signature';
import { bytesToHex, privateToPublic } from '@ethereumjs/util';
import { extractPublicKey } from '@metamask/eth-sig-util';
require('dotenv').config();

const privateKey = Buffer.from('4af1bceebf7f3634ec3cff8a2c38e51178d5d4ce585c52d6043e5e2cc3418bb0', 'hex');

describe('create_signature', function () {
  it('should sign a message correctly', async function () {
    const address = '0x1234567890123456789012345678901234567890';
    const mint_eligibility = true;
    const data = '123456789332';

    const signature = await create_signature(address, mint_eligibility, data);
    expect(signature).toMatch(/^0x[a-f0-9]{128}$/);
  });

  it('should recover the public key from a signature', async () => {
    const address = '0x1234567890123456789012345678901234567890';
    const mint_eligibility = true;
    const data = '123456789332';

    const signature = await create_signature(address, mint_eligibility, data);
    const typesArray = 'address, bool, bytes32';
    const publicKey = bytesToHex(privateToPublic(privateKey));

    const valueArray: [`0x${string}`, boolean, `0x${string}`] = [
      address as `0x${string}`,
      mint_eligibility,
      toHex(data, { size: 32 }) as `0x${string}`,
    ];

    const hashBuff = keccak256(toBytes(encodeAbiParameters(parseAbiParameters(typesArray), valueArray)));
    expect(
      extractPublicKey({
        data: hashBuff,
        signature,
      }),
    ).toBe(publicKey);
  });
});
