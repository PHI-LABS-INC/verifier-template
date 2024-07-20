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

  const signature = await create_signature(address as Address, mint_eligibility, data);
  return res.status(200).json({ mint_eligibility, data, signature });
}
