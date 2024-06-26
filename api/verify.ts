import type { VercelRequest, VercelResponse } from '@vercel/node';
import { check_credential } from '../lib/check';
import { create_signature } from '../lib/signature';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { address } = req.query;
  if (!address) {
    throw new Error('Address is required');
  }

  const [check_result, data] = await check_credential(address as string, 0);
  console.log(`Credential check result: ${check_result}, data: ${data}`);

  // Check if data fits in bytes32
  let dataFitsInBytes32 = false;
  if (typeof data === 'string') {
    const byteLength = new TextEncoder().encode(data).length;
    dataFitsInBytes32 = byteLength <= 32;
    console.log(`Data byte length: ${byteLength}, fits in bytes32: ${dataFitsInBytes32}`);
  } else {
    console.log('Data is not a string');
  }

  if (check_result) {
    const signature = await create_signature([address as `0x${string}`, check_result, data]);
    console.log(`Signature: ${signature}`);
    return res.status(200).json({ result: check_result, data, signature, dataFitsInBytes32 });
  } else {
    return res.status(200).json({ result: check_result, data, signature: null, dataFitsInBytes32 });
  }
}
