import { encodeAbiParameters, keccak256, parseAbiParameters, toBytes } from 'viem';
import { create_signature } from '../lib/signature';
import { bytesToHex, privateToPublic } from '@ethereumjs/util';
import { extractPublicKey } from '@metamask/eth-sig-util';
require('dotenv').config();

const privateKey = Buffer.from('4af1bceebf7f3634ec3cff8a2c38e51178d5d4ce585c52d6043e5e2cc3418bb0', 'hex');

describe('create_signature', function () {
  it('should sign a message correctly', async function () {
    const valueArray: [`0x${string}`, boolean, bigint] = [
      '0x1234567890123456789012345678901234567890',
      true,
      BigInt(123456789332),
    ];

    const signature = await create_signature(valueArray);
    expect(signature).toMatch(/^0x[a-f0-9]{128}$/);
  });

  it('should recover the public key from a signature', async () => {
    const valueArray: [`0x${string}`, boolean, bigint] = [
      '0x1234567890123456789012345678901234567890',
      true,
      BigInt(123456789),
    ];

    const signature = await create_signature(valueArray);
    const typesArray = 'address, bool, uint';
    const publicKey = bytesToHex(privateToPublic(privateKey));

    const hashBuff = keccak256(toBytes(encodeAbiParameters(parseAbiParameters(typesArray), valueArray)));
    expect(
      extractPublicKey({
        data: hashBuff,
        signature,
      }),
    ).toBe(publicKey);
  });
});
