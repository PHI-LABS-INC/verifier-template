import { encodeAbiParameters, parseAbiParameters, toBytes, Hex, hashMessage, keccak256, toHex, Address } from 'viem';
import { sign } from 'viem/accounts';

export async function create_signature(valueArray: [Address, boolean, `0x${string}`]): Promise<Hex> {
  if (process.env.SIGNER_PRIVATE_KEY === undefined) {
    throw new Error('SIGNER_PRIVATE_KEY is not defined');
  } else {
    const types = 'address, bool, bytes32';
    const encodedData = encodeAbiParameters(parseAbiParameters(types), valueArray);
    const { r, s, v } = await sign({
      hash: hashMessage({ raw: toBytes(keccak256(encodedData)) }),
      privateKey: process.env.SIGNER_PRIVATE_KEY as `0x${string}`,
    });
    // Sign the hash message using the private key
    // The sign function returns an object with r, s, and v components of the signature

    let sBigInt = BigInt(s);
    if (v !== BigInt(27)) {
      // Check if the v value is not equal to 27
      // If v is not 27, it means the s value is greater than half of the curve order
      sBigInt = sBigInt | (BigInt(1) << BigInt(255));
      // Modify the s value by setting its most significant bit to 1
      // This is done by performing a bitwise OR operation with BigInt(1) left-shifted by 255 bits
      // This modification is equivalent to replacing s with n - s, where n is the curve order
    }

    const sHex = toHex(sBigInt);
    // Convert the modified s value to its hexadecimal representation

    const signature = `0x${r.slice(2)}${sHex.slice(2)}` as Hex;
    // Construct the final signature by concatenating the r and modified s values in hexadecimal format
    // The resulting signature is prefixed with "0x" and cast as a Hex type
    return signature;
  }
}
