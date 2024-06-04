# Verifier-Sample

This project consists of TypeScript code for verifying various credentials associated with Ethereum addresses.

## How to Use

You can choose from one of the following two methods to use this repository:

### One-Click Deploy

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=vercel-examples):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/PHI-LABS-INC/verifier-template&project-name=verifier&repository-name=verifier)

### Clone and Deploy

```bash
git clone https://github.com/PHI-LABS-INC/verifier-template
```

Install the Vercel CLI:

```bash
npm i -g vercel
```

Then run the app at the root of the repository:

```bash
vercel dev
```

##

Below is a description of each file.

- check.ts
  check.ts contains the main logic for verifying credentials based on a given address and ID. It provides the following key functions:check_credential function: Accepts an address and ID, and verifies the credential based on the corresponding credential configuration.
  Retrieves transactions for the specified address using either the Etherscan API or Alchemy API.
  Evaluates the transaction conditions based on the credential type (eligibility or numeric).
  Performs contract calls and verifies credentials based on the results.

- credentials.ts
  credentials.ts is a file that contains the configurations for various credentials. The credentialConfig object includes details such as the title, type, API choice, contract address, method ID, network, start block, end block, filter function, and transaction condition function for each credential.

- filter.ts
  filter.ts provides functions for filtering transactions. It defines two functions:txFilter_Standard: Filters transactions based on the contract address and method ID.
  txFilter_Any: A filter function that allows all transactions.

- signature.ts
  signature.ts provides the create_signature function for creating a signature based on a given array of values. This function signs the hash message using the private key and returns the final signature.

- transactionUtils.ts
  transactionUtils.ts is a file that provides utility functions for retrieving transactions using either Etherscan or Alchemy. The main functions are:getTransactions: Retrieves transactions from either Etherscan or Alchemy based on the API choice.
  getTransactionsEtherscan: Retrieves transactions using the Etherscan API.
  getTransactionsAlchemy: Retrieves transactions using the Alchemy API.
  getTransactionDetails: Retrieves transaction details using the transaction hash.
  transformAlchemyTxToGeneralTx: Transforms an Alchemy transaction to the GeneralTxItem format.

These files provide functionality for verifying credentials associated with Ethereum addresses and support both the Etherscan API and Alchemy API.
