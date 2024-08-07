import 'dotenv/config';
import { txFilter_Any, txFilter_Standard } from './filter';

// The credConfig object holds the configurations for various creds.
// Each cred is represented as an object with a unique ID.
export const credConfig = {
  0: {
    // Title of the cred
    title: 'Complete a transaction on Basechain',
    // Type of the cred ('basic' or 'advanced')
    credType: 'basic',
    // Choice of API to use ('etherscan' or 'contractCall')
    apiChoice: 'etherscan',
    // API key or URL (retrieved from environment variables)
    apiKeyOrUrl: process.env.BASESCAN_API_KEY ?? '',
    // Target contract address ('any' for any address)
    contractAddress: 'any',
    // Target method ID ('any' for any method)
    methodId: 'any',
    // Network ('mainnet', 'basechain', etc.)
    network: 'basechain',
    // Start block number
    startBlock: '0',
    // End block number
    endBlock: 'latest',
    // Function to check eligibility based on the result
    mintEligibility: (result: number) => result > 0,
    // Function to filter transactions
    filterFunction: txFilter_Any,
    // Function to evaluate the condition of transactions
    transactionCondition: (txs: any[]) => txs.length > 0,
    // This cred uses the 'etherscan' API and checks for eligibility based on the presence of transactions.
  },
  1: {
    title: 'DegenMinted',
    credType: 'basic',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.ETHERSCAN_API_KEY ?? '',
    contractAddress: '0x0521fa0bf785ae9759c7cb3cbe7512ebf20fbdaa',
    methodId: '0xb4b19278',
    network: 'mainnet',
    startBlock: '0',
    endBlock: 'latest',
    filterFunction: txFilter_Standard,
    transactionCondition: (txs: any[]) => txs.length > 0,
    // This cred uses the 'etherscan' API and checks for eligibility based on the presence of specific transactions.
  },
  2: {
    title: 'Date of your first transaction on Ethereum',
    credType: 'advanced',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.ETHERSCAN_API_KEY ?? '',
    contractAddress: 'any',
    methodId: 'any',
    network: 'mainnet',
    startBlock: '0',
    endBlock: 'latest',
    mintEligibility: (result: number) => result > 0,
    filterFunction: txFilter_Any,
    // Function to evaluate the condition based on the count of transactions
    transactionCountCondition: (txs: any[]) => txs[0]?.timeStamp || 0,
    // This cred uses the 'etherscan' API and returns a numeric value based on the block number of the first transaction.
  },
  3: {
    title: 'Holder of a wawa NFT',
    credType: 'advanced',
    apiChoice: 'contractCall',
    apiKeyOrUrl: '',
    contractAddress: '0x2d9181b954736971bb74043d4782dfe93b55a9af',
    // Name of the contract function to call
    functionName: 'balanceOf',
    // ABI (function signature) of the contract
    abi: [
      {
        name: 'balanceOf',
        type: 'function',
        inputs: [
          {
            name: 'account',
            type: 'address',
          },
        ],
        outputs: [
          {
            name: '',
            type: 'uint256',
          },
        ],
        stateMutability: 'view',
      },
    ],
    network: 'mainnet',
    mintEligibility: (result: number) => result > 0,
    // Function to evaluate the condition based on the result of the contract call
    contractCallCondition: (result: number) => result > 0,
    // This cred uses the 'contractCall' API and returns a numeric value based on the result of the 'balanceOf' function call.
  },
  // Add other creds and their configurations here
};
