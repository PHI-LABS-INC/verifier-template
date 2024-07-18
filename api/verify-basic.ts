import type { VercelRequest, VercelResponse } from '@vercel/node';
import { check_cred } from '../lib/check';
import { create_signature } from '../lib/signature';
import { Address, toHex } from 'viem';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { address } = req.query;
  if (!address) {
    throw new Error('Address is required');
  }

  const [mint_eligibility, _] = await check_cred(address as string, 0);

  if (mint_eligibility) {
    const signature = await create_signature([address as Address, mint_eligibility, toHex('0x', { size: 32 })]);
    return res.status(200).json({ mint_eligibility, signature });
  } else {
    return res.status(200).json({ mint_eligibility });
  }
}
