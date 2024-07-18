import { http, createPublicClient } from 'viem';
import { credConfig } from './creds';
import { getTransactions } from './transactionUtils';

export async function check_cred(address: string, id: number): Promise<[boolean, string]> {
  // Get the cred configuration based on the provided id
  const config = credConfig[id];
  // Convert the address to lowercase for consistency
  const check_address = address.toLowerCase();

  if (config.apiChoice === 'contractCall') {
    // Create a public client using the specified network and HTTP transport
    const client = createPublicClient({
      chain: config.network,
      transport: http(),
    });

    // Call the contract function with the provided address
    const contractCallResult = await client.readContract({
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
      console.log(txs);
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
