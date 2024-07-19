import { http, createPublicClient, Chain, PublicClient } from 'viem';
import { credConfig } from './creds';
import { getTransactions } from './transactionUtils';
import { mainnet } from 'viem/chains';

export async function check_cred(address: string, id: number): Promise<[boolean, string]> {
  const config = credConfig[id];
  if (!config) {
    throw new Error(`Invalid cred id: ${id}`);
  }

  const check_address = address.toLowerCase();

  if (config.apiChoice === 'contractCall') {
    const publicClient = await createPublicClientForNetwork(config.network);
    const contractCallResult = await callContract(publicClient, config, check_address);
    return handleContractCallResult(config, contractCallResult);
  } else if (config.apiChoice === 'etherscan' || config.apiChoice === 'alchemy') {
    const txs = await getTransactions(
      config.apiChoice,
      config.apiKeyOrUrl,
      check_address,
      config.contractAddress,
      config.methodId,
      config.network,
      config.startBlock,
      config.endBlock,
      config.filterFunction,
    );
    return handleTransactionResult(config, txs);
  } else {
    throw new Error(`Invalid API choice: ${config.apiChoice}`);
  }
}

async function createPublicClientForNetwork(network: string): Promise<PublicClient> {
  let chain: Chain;
  let rpc: string;
  if (network === 'mainnet') {
    chain = mainnet;
    rpc = 'https://eth.llamarpc.com';
  } else {
    throw new Error(`Invalid network: ${network}`);
  }

  const publicClient = createPublicClient({
    chain,
    transport: http(rpc),
  });

  if (!publicClient) {
    throw new Error('Failed to create publicClient');
  }

  return publicClient;
}

async function callContract(publicClient: PublicClient, config: any, check_address: string): Promise<any> {
  return publicClient.readContract({
    address: config.contractAddress,
    abi: config.abi,
    functionName: config.functionName,
    args: [check_address],
  });
}

function handleContractCallResult(config: any, contractCallResult: any): [boolean, string] {
  if (config.credType === 'advanced') {
    if (contractCallResult === undefined) {
      throw new Error('advanced cred returned undefined');
    }
    return [true, contractCallResult.toString()];
  } else if (config.credType === 'basic') {
    return [config.contractCallCondition(contractCallResult), ''];
  } else {
    return [false, ''];
  }
}

function handleTransactionResult(config: any, txs: any): [boolean, string] {
  if (config.credType === 'advanced') {
    const advancedResult = config.transactionCountCondition(txs);
    if (advancedResult === undefined) {
      throw new Error('advanced cred returned undefined');
    }
    return [true, advancedResult.toString()];
  } else if (config.credType === 'basic') {
    return [config.transactionCondition(txs), ''];
  } else {
    return [false, ''];
  }
}
