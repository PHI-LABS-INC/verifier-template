import type { VercelRequest, VercelResponse } from '@vercel/node';
import { check_credential } from '../lib/check';
import { create_signature } from '../lib/signature';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { address } = req.query;
  if (!address) {
    // If the address is not provided in the query, throw an error
    throw new Error('Address is required');
  }

  // Check credential 0 ('Complete a transaction on Basechain') for the address
  const [check_result, counter] = await check_credential(address as string, 0);
  console.log(`Credential check result: ${check_result}, counter: ${counter}`);
  if (check_result) {
    // If the credential check is successful, create a signature using the address, check result, and counter
    const signature = await create_signature([address as `0x${string}`, check_result, BigInt(counter)]);
    console.log(`Signature: ${signature}`);
    // Return a success response with the check result, counter, and signature
    return res.status(200).json({ result: check_result, counter, signature });
  } else {
    // If the credential check fails, return a failure response with the check result, counter, and null signature
    return res.status(200).json({ result: check_result, counter, signature: null });
  }
}
