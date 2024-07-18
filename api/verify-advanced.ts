import type { VercelRequest, VercelResponse } from '@vercel/node';
import { check_cred } from '../lib/check';
import { create_signature } from '../lib/signature';
import { Address, toHex } from 'viem';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { address } = req.query;
  if (!address) {
    throw new Error('Address is required');
  }

  const [mint_eligibility, data] = await check_cred(address as string, 3);
  console.log(`Cred check result: ${mint_eligibility}, data: ${data}`);

  // Check if data fits in bytes32
  let dataFitsInBytes32 = false;
  if (typeof data === 'string') {
    const byteLength = new TextEncoder().encode(data).length;
    dataFitsInBytes32 = byteLength <= 32;
    if (!dataFitsInBytes32) {
      console.log('Data does not fit in bytes32');
    }
  } else {
    console.log('Data is not a string');
  }

  const signature = await create_signature([address as Address, mint_eligibility, toHex(data, { size: 32 })]);
  return res.status(200).json({ mint_eligibility, data, signature });
}
