# Verifier Template

This project provides a template for verifying Ethereum addresses on the Base network. It includes two main verification methods: balance checking and transaction history verification.

## Project Structure

```
VERIFIER-TEMPLATE
├── api
│   ├── balance-of-eth-base.ts
│   ├── create-tx-base.ts
│   └── signature.ts
├── test
│   └── verify.test.ts
├── .env
├── .env.sample
├── .gitignore
├── bun.lockb
├── jest.config.js
├── package.json
├── README.md
└── tsconfig.json
```

## Features

1. **Balance Verification**: Checks if an address has a minimum balance of 0.1 ETH on the Base network.
2. **Transaction Verification**: Verifies if an address has any transactions on the Base network.
3. **Signature Generation**: Creates a signature for verified addresses.

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   bun install
   ```
3. Copy `.env.sample` to `.env` and fill in the required values:
   ```
   BASESCAN_API_KEY=your_basescan_api_key
   SIGNER_PRIVATE_KEY=your_private_key
   ```

## Usage

### Balance Verification

The `balance-of-eth-base.ts` file contains the logic for checking an address's balance on the Base network.

### Transaction Verification

The `create-tx-base.ts` file handles the verification of an address's transaction history using the Basescan API.

### Running Tests

To run the tests:

```
bun run test
```

## API Endpoints

The project is designed to be deployed as serverless functions. The main handler functions are:

- `/api/balance-of-eth-base`: Checks the balance of a given address
- `/api/create-tx-base`: Verifies the transaction history of a given address

Both endpoints return a JSON response with the verification result and a signature.

## Environment Variables

- `BASESCAN_API_KEY`: Your Basescan API key for accessing the Basescan API
- `SIGNER_PRIVATE_KEY`: Private key used for signing the verification results

## API Endpoints (Vercel Functions)

This project is designed to be deployed as serverless functions using Vercel Functions. Each file in the api directory corresponds to a serverless function:

/api/balance-of-eth-base: Checks the balance of a given address
/api/create-tx-base: Verifies the transaction history of a given address

Both endpoints return a JSON response with the verification result and a signature.

Please also setup environment values to your vercel.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
