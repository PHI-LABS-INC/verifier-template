import type { VercelRequest, VercelResponse } from '@vercel/node';
import { create_signature } from './signature';
import { Address, createPublicClient, http, parseEther, formatEther } from 'viem';
import { base } from 'viem/chains';

const client = createPublicClient({
  chain: base,
  transport: http(),
});

const MIN_BALANCE = parseEther('0.1'); // 0.1 ETH minimum balance

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { address } = req.query;
    if (!address || typeof address !== 'string') {
      return res.status(400).json({ error: 'Invalid address provided' });
    }

    const [mint_eligibility, balance] = await verifyBalance(address as Address);
    console.log(`Cred check result: ${mint_eligibility}, Balance: ${balance} ETH`);

    const signature = await create_signature(address as Address, mint_eligibility, balance);
    return res.status(200).json({ mint_eligibility, balance, signature });
  } catch (error) {
    console.error('Error in handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function verifyBalance(address: Address): Promise<[boolean, string]> {
  try {
    const balance = await client.getBalance({ address });
    const formattedBalance = formatEther(balance);
    const isEligible = balance >= MIN_BALANCE;
    console.log(`Address: ${address}, Balance: ${formattedBalance} ETH, Eligible: ${isEligible}`);
    return [isEligible, formattedBalance];
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw new Error('Failed to verify address balance');
  }
}
