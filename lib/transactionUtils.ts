import axios from 'axios';
import {
  AlchemyDetailTxItem,
  AlchemyResponse,
  AlchemyResponseForTxDetails,
  EtherscanResponse,
  GeneralTxItem,
  TxFilterFunction,
} from './types';

export async function getTransactions(
  apiChoice: 'etherscan' | 'alchemy',
  api_key: string,
  address: string,
  contractAddress: string,
  methodId: string,
  network: 'mainnet' | 'sepolia',
  startblock: string,
  endblock: string,
  txFilter: (tx: any, contractAddress: string, methodId: string) => boolean,
): Promise<GeneralTxItem[]> {
  if (apiChoice === 'etherscan') {
    return getTransactionsEtherscan(
      api_key,
      address,
      contractAddress,
      methodId,
      network,
      startblock,
      endblock,
      txFilter,
    );
  } else if (apiChoice === 'alchemy') {
    return getTransactionsAlchemy(api_key, address, contractAddress, methodId, startblock, endblock, txFilter);
  } else {
    throw new Error('Invalid API choice');
  }
}

async function fetchEtherscanTransactions(network, address, startblock, endblock, api_key) {
  let networkUrlPart;

  if (network === 'mainnet') {
    networkUrlPart = 'api.etherscan.io';
  } else if (network === 'arbitrum') {
    networkUrlPart = 'api.arbiscan.io';
  } else if (network === 'basechain') {
    networkUrlPart = 'api.basescan.org';
  } else {
    networkUrlPart = 'api-' + network + '.etherscan.io';
  }

  const etherscanAPIBaseURL = `https://${networkUrlPart}`;
  const url = `${etherscanAPIBaseURL}/api?module=account&action=txlist&address=${address}&startblock=${startblock}&endblock=${endblock}&sort=desc&apikey=${api_key}`;

  try {
    const response = await axios.get(url);
    return response;
  } catch (error) {
    console.error('Error fetching Etherscan transactions:', error);
    throw error;
  }
}

async function getTransactionsEtherscan(
  api_key: string,
  address: string,
  contractAddress: string,
  methodId: string,
  network: 'mainnet' | 'sepolia',
  startblock: string = '0',
  endblock: string = 'latest',
  filterFunction: TxFilterFunction,
): Promise<GeneralTxItem[]> {
  const response = await fetchEtherscanTransactions(network, address, startblock, endblock, api_key);
  if (response.data.status === '0' && response.data.message === 'No transactions found') {
    return [];
  }
  if (response.data.message !== 'OK') {
    const msg = `${network}scan API error: ${JSON.stringify(response.data)}`;
    throw new Error(`${network}scan API failed: ${msg}`);
  }
  // Filter transactions using the provided filterFunction
  return response.data.result.filter((tx) => filterFunction(tx, contractAddress, methodId));
}

async function getTransactionsAlchemy(
  alchemy_url: string,
  address: string,
  contractAddress: string,
  methodId: string,
  startblock: string = '0',
  endblock: string = 'latest',
  filterFunction: TxFilterFunction,
): Promise<GeneralTxItem[]> {
  let params: { [key: string]: any } = {
    fromBlock: '0x' + BigInt(startblock).toString(16),
    toBlock: endblock === 'latest' ? 'latest' : '0x' + BigInt(endblock).toString(16),
    fromAddress: address.toLowerCase(),
    withMetadata: false,
    excludeZeroValue: false,
    maxCount: '0x3e8',
    order: 'desc',
    category: ['external'],
  };

  try {
    const res = await fetch(alchemy_url, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 1,
        jsonrpc: '2.0',
        method: 'alchemy_getAssetTransfers',
        params: [params],
      }),
    });
    const json = (await (res as any).json()) as AlchemyResponse;
    if (!json || !json.result) {
      throw new Error('Failed to fetch transactions from Alchemy');
    }

    // Process and filter transactions
    const transactions = json.result.transfers;
    const detailedTransactions = await Promise.all(
      transactions.map((tx) => getAlchemyTransactionDetails(alchemy_url, tx.hash)),
    );

    return detailedTransactions
      .filter((tx) => tx !== null)
      .map((tx) => transformAlchemyTxToGeneralTx(tx as AlchemyDetailTxItem))
      .filter((tx) => filterFunction(tx, contractAddress, methodId));
  } catch (e) {
    console.error(`Error fetching transactions from Alchemy: ${e}`);
    throw e;
  }
}

// Function to fetch transaction details by hash
async function getAlchemyTransactionDetails(alchemy_url: string, txHash: string): Promise<AlchemyDetailTxItem | null> {
  try {
    const res = await fetch(alchemy_url, {
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: 1,
        jsonrpc: '2.0',
        method: 'eth_getTransactionByHash',
        params: [txHash],
      }),
    });
    const json = (await (res as any).json()) as AlchemyResponseForTxDetails;
    return json.result;
  } catch (e) {
    console.error(`Error fetching transaction details: ${e}`);
    return null;
  }
}

function transformAlchemyTxToGeneralTx(alchemyTx: AlchemyDetailTxItem): GeneralTxItem {
  return {
    hash: alchemyTx.hash,
    from: alchemyTx.from,
    to: alchemyTx.to,
    blockNumber: alchemyTx.blockNumber,
    // value: alchemyTx.value,
    input: alchemyTx.input,
    methodId: extractMethodId(alchemyTx),
    // Add other necessary mappings
  };
}

// Function to extract methodId from the transaction's input
function extractMethodId(tx: AlchemyDetailTxItem): string {
  if (tx.input && tx.input.length >= 10) {
    return tx.input.substring(0, 10);
  }
  return '';
}
