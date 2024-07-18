import { http, createPublicClient, Chain } from 'viem';
import { credConfig } from './creds';
import { getTransactions } from './transactionUtils';
import { mainnet } from 'viem/chains';

export async function check_cred(address: string, id: number): Promise<[boolean, string]> {
  // Get the cred configuration based on the provided id
  const config = credConfig[id];
  // Convert the address to lowercase for consistency
  const check_address = address.toLowerCase();

  if (config.apiChoice === 'contractCall') {
    let chain: Chain;
    let rpc: any;
    if (config.network === 'mainnet') {
      // If the network is mainnet, use the mainnet chain configuration
      chain = mainnet;
      rpc = 'https://rpc.ankr.com/eth';
    } else {
      // Otherwise, use the specified network
      throw Error('Invalid network');
    }
    // Create a public client using the specified network and HTTP transport
    const publicClient = createPublicClient({
      chain: mainnet,
      transport: http(rpc),
    });

    if (!publicClient) {
      console.error('Failed to create publicClient');
      throw new Error('Failed to create publicClient');
    }
    // Call the contract function with the provided address
    const contractCallResult = await publicClient.readContract({
      address: config.contractAddress,
      abi: config.abi,
      functionName: config.functionName,
      args: [check_address],
    });

    if (config.credType === 'advanced') {
      // If the cred type is advanced, return true and the contract call result
      if (contractCallResult === undefined) {
        throw new Error('advanced cred returned undefined');
      }
      return [true, contractCallResult.toString()];
    } else if (config.credType == 'basic') {
      // If the cred type is basic, return the ""
      return [config.contractCallCondition(contractCallResult), ''];
    } else {
      return [false, ''];
    }
  } else if (config.apiChoice === 'etherscan' || config.apiChoice === 'alchemy') {
    // Get the transactions using the specified API choice, API key or URL, address,
    // contract address, method ID, network, start block, end block, and filter function
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

    if (config.credType === 'advanced') {
      // If the cred type is advanced, return true and the result of the transaction count condition
      const advancedResult = config.transactionCountCondition(txs);
      if (advancedResult === undefined) {
        throw new Error('advanced cred returned undefined');
      }

      return [true, advancedResult.toString()];
    } else if (config.credType === 'basic') {
      // If the cred type is basic, return the result of the transaction condition
      return [config.transactionCondition(txs), ''];
    }
  } else {
    // Throw an error if the API choice is invalid
    throw new Error('Invalid API choice');
  }
  return [false, ''];
}
