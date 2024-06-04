import { http, createPublicClient } from 'viem';
import { credentialConfig } from './credentials';
import { getTransactions } from './transactionUtils';

export async function check_credential(address: string, id: number): Promise<[boolean, number]> {
  // Get the credential configuration based on the provided id
  const config = credentialConfig[id];
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

    if (config.credentialType === 'numeric') {
      // If the credential type is numeric, return true and the contract call result
      return [true, contractCallResult];
    } else {
      // If the credential type is not numeric, return the result of the contract call condition
      // and a numeric representation of the condition (1 for true, 0 for false)
      return [
        config.contractCallCondition(contractCallResult),
        config.contractCallCondition(contractCallResult) ? 1 : 0,
      ];
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

    if (config.credentialType === 'numeric') {
      // If the credential type is numeric, return true and the result of the transaction count condition
      return [true, config.transactionCountCondition(txs)];
    } else {
      // If the credential type is not numeric, return the result of the transaction condition
      // and a numeric representation of the condition (1 for true, 0 for false)
      return [config.transactionCondition(txs), config.transactionCondition(txs) ? 1 : 0];
    }
  } else {
    // Throw an error if the API choice is invalid
    throw new Error('Invalid API choice');
  }
}
