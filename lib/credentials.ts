import 'dotenv/config';
import { txFilter_Any, txFilter_Standard } from './filter';

// The credentialConfig object holds the configurations for various credentials.
// Each credential is represented as an object with a unique ID.
export const credentialConfig = {
  0: {
    // Title of the credential
    title: 'Complete a transaction on Basechain',
    // Type of the credential ('eligible' or 'numeric')
    credentialType: 'eligible',
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
    // Function to filter transactions
    filterFunction: txFilter_Any,
    // Function to evaluate the condition of transactions
    transactionCondition: (txs: any[]) => txs.length > 0,
    // This credential uses the 'etherscan' API and checks for eligibility based on the presence of transactions.
  },
  1: {
    title: 'DegenMinted',
    credentialType: 'eligible',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.ETHERSCAN_API_KEY ?? '',
    contractAddress: '0x0521fa0bf785ae9759c7cb3cbe7512ebf20fbdaa',
    methodId: '0xb4b19278',
    network: 'mainnet',
    startBlock: '0',
    endBlock: 'latest',
    filterFunction: txFilter_Standard,
    transactionCondition: (txs: any[]) => txs.length > 0,
    // This credential uses the 'etherscan' API and checks for eligibility based on the presence of specific transactions.
  },
  2: {
    title: 'Date of your first transaction on Ethereum',
    credentialType: 'numeric',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.ETHERSCAN_API_KEY ?? '',
    contractAddress: 'any',
    methodId: 'any',
    network: 'mainnet',
    startBlock: '0',
    endBlock: 'latest',
    filterFunction: txFilter_Any,
    // Function to evaluate the condition based on the count of transactions
    transactionCountCondition: (txs: any[]) => txs[0]?.blockNumber || 0,
    // This credential uses the 'etherscan' API and returns a numeric value based on the block number of the first transaction.
  },
  3: {
    title: 'Holder of a wawa NFT',
    credentialType: 'numeric',
    apiChoice: 'contractCall',
    apiKeyOrUrl: '',
    contractAddress: '0x0521fa0bf785ae9759c7cb3cbe7512ebf20fbdaa',
    // Name of the contract function to call
    functionName: 'balanceOf',
    // ABI (function signature) of the contract
    abi: ['function balanceOf(address) public view returns (uint256)'],
    network: 'mainnet',
    // Function to evaluate the condition based on the result of the contract call
    contractCallCondition: (result: number) => result > 0,
    // This credential uses the 'contractCall' API and returns a numeric value based on the result of the 'balanceOf' function call.
  },
  4: {
    title: 'Has made more than 10 transactions',
    credentialType: 'eligible',
    apiChoice: 'etherscan',
    apiKeyOrUrl: process.env.ETHERSCAN_API_KEY ?? '',
    contractAddress: 'any',
    methodId: 'any',
    network: 'mainnet',
    startBlock: '0',
    endBlock: 'latest',
    filterFunction: txFilter_Any,
    transactionCondition: (txs: any[]) => txs.length > 10,
    // This credential uses the 'etherscan' API and checks for eligibility based on the count of transactions being greater than 10.
  },
  // Add other credentials and their configurations here
};
