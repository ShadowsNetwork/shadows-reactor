import BigNumber from 'bignumber.js'
import { Event } from '@ethersproject/contracts/src.ts/index'

export interface Transaction {
  hash?: string;

  to?: string;
  from?: string;
  nonce: number;

  gasLimit: BigNumber;
  gasPrice: BigNumber;

  data: string;
  value: BigNumber;
  chainId: number;

  r?: string;
  s?: string;
  v?: number;
}

export interface TransactionResponse extends Transaction {
  hash: string;

  // Only if a transaction has been mined
  blockNumber?: number,
  blockHash?: string,
  timestamp?: number,

  confirmations: number,

  // Not optional (as it is in Transaction)
  from: string;

  // The raw transaction
  raw?: string,

  // This function waits until the transaction has been mined
  wait: (_confirmations?: number) => Promise<TransactionReceipt>
}

export interface TransactionReceipt {
  to: string;
  from: string;
  contractAddress: string,
  transactionIndex: number,
  root?: string,
  gasUsed: BigNumber,
  logsBloom: string,
  blockHash: string,
  transactionHash: string,
  logs: Array<Log>,
  blockNumber: number,
  confirmations: number,
  cumulativeGasUsed: BigNumber,
  byzantium: boolean,
  status?: number
}

export interface Log {
  blockNumber: number;
  blockHash: string;
  transactionIndex: number;

  removed: boolean;

  address: string;
  data: string;

  topics: Array<string>;

  transactionHash: string;
  logIndex: number;
}

export interface ContractReceipt extends TransactionReceipt {
  events?: Array<Event>;
}

export interface ContractTransaction extends TransactionResponse {
  wait(_confirmations?: number): Promise<ContractReceipt>;
}
