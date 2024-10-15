// Import necessary dependencies and types
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { create_signature } from './signature';
import { Address, isAddress } from 'viem';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();
const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY;
const BASESCAN_API_URL = 'https://api.basescan.org/api';

// Define the structure of the Basescan API response
interface BasescanResponse {
  status: string;
  message: string;
  result: any[];
}

// Main handler function for the API endpoint
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Extract the address from the query parameters
    const { address } = req.query;

    // Validate the address
    if (!address || typeof address !== 'string' || !isAddress(address)) {
      return res.status(400).json({ error: 'Invalid address provided' });
    }

    // Verify transactions for the provided address
    const [mint_eligibility, data] = await verifyTx(address as Address);

    // Create a signature for the verification result
    const signature = await create_signature(address as Address, mint_eligibility, data);

    // Return the verification result and signature
    return res.status(200).json({ mint_eligibility, data, signature });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error('Error in handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// Function to verify transactions for an address
export async function verifyTx(address: Address): Promise<[boolean, string]> {
  try {
    // Make a GET request to the Basescan API
    const response = await axios.get<BasescanResponse>(BASESCAN_API_URL, {
      params: {
        module: 'account',
        action: 'txlist',
        address: address,
        startblock: 0,
        endblock: 99999999,
        sort: 'desc',
        apikey: BASESCAN_API_KEY,
      },
    });

    console.log('Basescan response:', response.data);

    // Check if the response is successful and contains transactions
    if (response.data.status === '1' && response.data.result.length > 0) {
      // Return true and the number of transactions if there are any
      return [true, response.data.result.length.toString()];
    } else {
      // Return false and '0' if there are no transactions
      return [false, '0'];
    }
  } catch (error) {
    // Handle any errors that occur during the API request
    console.error('Error fetching data from Basescan:', error);
    throw new Error('Failed to verify address');
  }
}
