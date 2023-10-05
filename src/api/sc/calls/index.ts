import {
  Address,
  AddressValue,
  BigUIntValue,
  BytesValue,
  ContractFunction,
  Transaction,
  TransactionPayload,
  ContractCallPayloadBuilder,
  RelayedTransactionV2Builder,
} from "@multiversx/sdk-core/out";
import { ChainId, network } from "../../net.config";
import {
  EGLD_VAL,
  WspTypes,
  getInterface,
  runTransactions,
} from "@/api/sc/sc";
import BigNumber from "bignumber.js";
import { SmartContract, U32Value, Interaction, TokenTransfer, GasEstimator, TransferTransactionsFactory, Account} from "@multiversx/sdk-core";
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers";
import { UserSigner } from "@multiversx/sdk-wallet";
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers";

const proxyNetworkProvider = new ProxyNetworkProvider(network.gatewayAddress);
const apiNetworkProvider = new ApiNetworkProvider(network.apiAddress);

/* Messages */
const defaultProcessingMessage = "Processing transaction";
const defaultPerrorMessage = "An error has occured";
const defaultSuccessMessage = "Transaction successful";
const defaulttransactionDuration = 1000 * 60 * 2;

export const ScCallwithNoTransferByRelayer = async ({
  workspace,
  funcName,
  args = [],
  gasLimit = 10000000,
} : {
  workspace: WspTypes;
  funcName: string;
  args?: any[];
  gasLimit?: number;
}) => {
  const relayerAddressFromEnv: string | undefined = process.env.NEXT_PUBLIC_RELAYER_ADDRESS;
  // const relayerPemFromEnv: string | undefined = process.env.NEXT_PUBLIC_RELAYER_PEM;
  const relayerPemFromEnv = `-----BEGIN PRIVATE KEY for erd1ss83zpye22wx3wvndl8zpcl20ne3dvzmnylt3e2slhzezxgz26ms4cdhah-----
  MjUzYThiZGE0ZTE2YTU3MzA1YzBiODg0OGUxZmM5NmY3Y2RlYzQyZDc3NjcyM2Jk
  YzQ4NjBmODlmODIxODI0ODg0MGYxMTA0OTk1MjljNjhiOTkzNmZjZTIwZTNlYTdj
  ZjMxNmIwNWI5OTNlYjhlNTUwZmRjNTkxMTkwMjU2Yjc=
  -----END PRIVATE KEY for erd1ss83zpye22wx3wvndl8zpcl20ne3dvzmnylt3e2slhzezxgz26ms4cdhah-----`;

  if (!relayerAddressFromEnv || !relayerPemFromEnv) {
    return null;
  }

  const senderAddress = new Address(relayerAddressFromEnv);

  let { simpleAddress } = getInterface(workspace);
  if (simpleAddress === "") {
    simpleAddress = workspace;
  }

  const contract = new SmartContract({ address: new Address(simpleAddress)});
  let interaction = new Interaction(contract, new ContractFunction(funcName), args);

  const senderAccount = new Account(senderAddress);
  const senderOnNetwork = await apiNetworkProvider.getAccount(senderAddress);
  senderAccount.update(senderOnNetwork);

  let tx = interaction
    .withSender(senderAddress)
    .withNonce(senderAccount.nonce)
    .withValue(0)
    .withGasLimit(gasLimit)
    .withChainID(ChainId)
    .buildTransaction();

  const pemEncoded: Buffer = Buffer.from(relayerPemFromEnv, 'utf8');
  const pemDecoded: string = pemEncoded.toString('utf8');

  let signer = UserSigner.fromPem(pemDecoded);

  const serializedTransaction = tx.serializeForSigning();
  const transactionSignature = await signer.sign(serializedTransaction);

  tx.applySignature(transactionSignature);

  let result = await proxyNetworkProvider.sendTransaction(tx); 

  return result;
};