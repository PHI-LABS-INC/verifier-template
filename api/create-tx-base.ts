import type { VercelRequest, VercelResponse } from '@vercel/node';
import { create_signature } from './signature';
import { Address, isAddress } from 'viem';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const BASESCAN_API_KEY = process.env.BASESCAN_API_KEY;
const BASESCAN_API_URL = 'https://api.basescan.org/api';

interface BasescanResponse {
  status: string;
  message: string;
  result: any[];
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const { address } = req.query;
    if (!address || typeof address !== 'string' || !isAddress(address)) {
      return res.status(400).json({ error: 'Invalid address provided' });
    }

    const [mint_eligibility, data] = await verifyTx(address as Address);

    const signature = await create_signature(address as Address, mint_eligibility, data);
    return res.status(200).json({ mint_eligibility, data, signature });
  } catch (error) {
    console.error('Error in handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function verifyTx(address: Address): Promise<[boolean, string]> {
  try {
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
    if (response.data.status === '1' && response.data.result.length > 0) {
      // Check if there are any transactions
      return [true, response.data.result.length.toString()];
    } else {
      return [false, '0'];
    }
  } catch (error) {
    console.error('Error fetching data from Basescan:', error);
    throw new Error('Failed to verify address');
  }
}
