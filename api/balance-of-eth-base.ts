// Import necessary types and functions
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { create_signature } from './signature';
import { Address, createPublicClient, http, parseEther, formatEther } from 'viem';
import { base } from 'viem/chains';

// Create a public client for interacting with the Base network
const client = createPublicClient({
  chain: base,
  transport: http(),
});

// Set the minimum balance required (0.1 ETH)
const MIN_BALANCE = parseEther('0.1');

// Main handler function for the API endpoint
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Extract the address from the query parameters
    const { address } = req.query;

    // Validate the address
    if (!address || typeof address !== 'string') {
      return res.status(400).json({ error: 'Invalid address provided' });
    }

    // Verify the balance of the provided address
    const [mint_eligibility, balance] = await verifyBalance(address as Address);
    console.log(`Cred check result: ${mint_eligibility}, Balance: ${balance} ETH`);

    // Create a signature for the verification result
    const signature = await create_signature(address as Address, mint_eligibility, balance);

    // Return the verification result and signature
    return res.status(200).json({ mint_eligibility, balance, signature });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error in handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Function to verify the balance of an address
export async function verifyBalance(address: Address): Promise<[boolean, string]> {
  try {
    // Fetch the balance of the address
    const balance = await client.getBalance({ address });

    // Format the balance from Wei to ETH
    const formattedBalance = formatEther(balance);

    // Check if the balance meets the minimum requirement
    const isEligible = balance >= MIN_BALANCE;

    console.log(`Address: ${address}, Balance: ${formattedBalance} ETH, Eligible: ${isEligible}`);

    // Return the eligibility status and formatted balance
    return [isEligible, formattedBalance];
  } catch (error) {
    // Handle any errors that occur during balance verification
    console.error('Error fetching balance:', error);
    throw new Error('Failed to verify address balance');
  }
}
