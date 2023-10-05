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
} from "api/sc/sc";
import BigNumber from "bignumber.js";
import store from "redux/store";
import { SmartContract, U32Value, Interaction, TokenTransfer, GasEstimator, TransferTransactionsFactory, Account} from "@multiversx/sdk-core";
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers";
// import { useSignTransactions } from "@multiversx/sdk-dapp/hooks";
import { UserSigner } from "@multiversx/sdk-wallet";
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers";
import { sendTransactions } from "@multiversx/sdk-dapp/services";

const proxyNetworkProvider = new ProxyNetworkProvider(network.gatewayAddress);
const apiNetworkProvider = new ApiNetworkProvider(network.apiAddress);

/* Messages */
const defaultProcessingMessage = "Processing transaction";
const defaultPerrorMessage = "An error has occured";
const defaultSuccessMessage = "Transaction successful";
const defaulttransactionDuration = 1000 * 60 * 2;

export const ScCallwithNoTransfer = async ({
  workspace,
  funcName,
  args = [],
  gasLimit = 50000000,
  sender = null,
} : {
  workspace: WspTypes;
  funcName: string;
  args?: any[];
  gasLimit?: number;
  amount?: number;
  bigAmount?: number;
  sender?: any;
}) => {
  let { simpleAddress } = getInterface(workspace);

  if (simpleAddress === "") {
    simpleAddress = workspace;
  }

  const connectedAddress = store.getState().userAccount.connectedAddress;
  const senderAddress = new Address(sender ?? connectedAddress);

  const contract = new SmartContract({ address: new Address(simpleAddress)});
  let interaction = new Interaction(contract, new ContractFunction(funcName), args);

  let tx = interaction
    .withSender(senderAddress)
    .useThenIncrementNonceOf(new Account(senderAddress)) // den xerw an xreiazetai auto
    .withValue(0)
    .withGasLimit(gasLimit)
    .withChainID(ChainId)
    .buildTransaction();

  let transactionInput = { transactions: [tx] };

  return await runTransactions(transactionInput);
};

export const ScCallwithEGLDTransfer = async ({
  workspace,
  funcName,
  args = [],
  gasLimit = 50000000,
  amount = 0,
  bigAmount = 0,
  sender = null,
} : {
  workspace: WspTypes;
  funcName: string;
  args?: any[];
  gasLimit?: number;
  amount?: number;
  bigAmount?: number;
  sender?: any;
}) => {
  let { simpleAddress } = getInterface(workspace);

  if (simpleAddress === "") {
    simpleAddress = workspace;
  }

  const connectedAddress = store.getState().userAccount.connectedAddress;
  const senderAddress = new Address(sender ?? connectedAddress);

  const contract = new SmartContract({ address: new Address(simpleAddress)});
  let interaction = new Interaction(contract, new ContractFunction(funcName), args);

  let tx = interaction
    .withSender(senderAddress)
    .useThenIncrementNonceOf(new Account(senderAddress)) // den xerw an xreiazetai auto
    .withValue(bigAmount ?? amount * EGLD_VAL)
    .withGasLimit(gasLimit)
    .withChainID(ChainId)
    .buildTransaction();

  let transactionInput = { transactions: [tx] };

  return await runTransactions(transactionInput);
};

export const ScCallwithESDTTransfer = async ({
  workspace,
  funcName,
  token,
  args = [],
  gasLimit = 50000000,
  bigAmount = 0,
  sender = null,
} : {
  workspace: WspTypes;
  funcName: string;
  token: any;
  args?: any[];
  gasLimit?: number;
  bigAmount?: number;
  sender?: any;
}) => {
  let { simpleAddress } = getInterface(workspace);

  if (simpleAddress === "") {
    simpleAddress = workspace;
  }

  const connectedAddress = store.getState().userAccount.connectedAddress;
  const senderAddress = new Address(sender ?? connectedAddress);

  const contract = new SmartContract({ address: new Address(simpleAddress)});
  let interaction = new Interaction(contract, new ContractFunction(funcName), args);

  let tx = interaction
    .withSender(senderAddress)
    .withSingleESDTTransfer(TokenTransfer.fungibleFromBigInteger(token.identifier, bigAmount, token.decimals))
    .useThenIncrementNonceOf(new Account(senderAddress)) // den xerw an xreiazetai auto
    .withValue(0)
    .withGasLimit(gasLimit)
    .withChainID(ChainId)
    .buildTransaction();

  let transactionInput = { transactions: [tx] };

  return await runTransactions(transactionInput);
};


export const ScGasslessCallInnerTxSigning = async ({
  workspace,
  funcName = "",
  args = [],
  gasLimit = 0,
  sender = null,
} : {
  workspace: WspTypes;
  funcName?: string;
  args?: any[];
  gasLimit?: number;
  amount?: number;
  bigAmount?: number;
  sender?: any;
}) => {
  let { simpleAddress } = getInterface(workspace);

  if (simpleAddress === "") {
    simpleAddress = workspace;
  }

  const connectedAddress = store.getState().userAccount.connectedAddress;
  const senderAddress = new Address(sender ?? connectedAddress);

  const contract = new SmartContract({ address: new Address(simpleAddress)});
  let interaction = new Interaction(contract, new ContractFunction(funcName), args);

  const senderAccount = new Account(senderAddress);
  const userOnNetwork = await apiNetworkProvider.getAccount(senderAddress);
  senderAccount.update(userOnNetwork);

  let inner_tx = interaction
    .withSender(senderAddress)
    .withValue(0)
    .withNonce(senderAccount.nonce)
    .withGasLimit(gasLimit)
    .withChainID(ChainId)
    .buildTransaction();

  const { sessionId } = await sendTransactions({
    transactions: [inner_tx],
    signWithoutSending: true
  })

  return {sessionId, inner_tx};
};



export const ScRelayTx = async ({
  inner_tx,
  gasLimit = 10000000,
} : {
  inner_tx: Transaction;
  gasLimit?: number;
}) => {
  let networkConfig = {
    MinGasLimit: 50_000,
    GasPerDataByte: 1_500,
    GasPriceModifier: 0.01,
    ChainID: ChainId
  };

  const relayerAddressFromEnv: string | undefined = process.env.NEXT_PUBLIC_RELAYER_ADDRESS;
  const relayerPemFromEnv: string | undefined = process.env.NEXT_PUBLIC_RELAYER_PEM;


  if (!relayerAddressFromEnv || !relayerPemFromEnv) {
    return null;
  }

  const relayerAddress = new Address(relayerAddressFromEnv);
  const relayerAccount = new Account(relayerAddress);
  const relayerOnNetwork = await apiNetworkProvider.getAccount(relayerAddress);
  relayerAccount.update(relayerOnNetwork);

  const relayed_tx = new RelayedTransactionV2Builder()
    .setInnerTransaction(inner_tx)
    .setInnerTransactionGasLimit(gasLimit)
    .setRelayerAddress(relayerAddress)
    .setRelayerNonce(relayerAccount.nonce)
    .setNetworkConfig(networkConfig)
    .build();

  const pemEncoded: Buffer = Buffer.from(relayerPemFromEnv, 'utf8');
  const pemDecoded: string = pemEncoded.toString('utf8');

  let signer = UserSigner.fromPem(pemDecoded);

  const serializedTransaction = relayed_tx.serializeForSigning();
  const transactionSignature = await signer.sign(serializedTransaction);

  relayed_tx.applySignature(transactionSignature);

  let result = await proxyNetworkProvider.sendTransaction(relayed_tx); 

  return result;
};

export const EGLDPayment = async (
  workspace: WspTypes,
  funcName: string,
  amount: number,
  args = [],
  gasLimit: number = 60000000,
  finalAmount = null
) => {
  let { simpleAddress } = getInterface(workspace);

  if (simpleAddress === "") {
    simpleAddress = workspace;
  }
  const sender = store.getState().userAccount.connectedAddress;
  const senderAddress = new Address(sender);

  const contract = new SmartContract({ address: new Address(simpleAddress)});
  let interaction = new Interaction(contract, new ContractFunction(funcName), args);

  let tx = interaction
    .withSender(senderAddress)
    .useThenIncrementNonceOf(new Account(senderAddress)) // den xerw an xreiazetai auto
    .withValue(finalAmount ?? amount * EGLD_VAL)
    .withGasLimit(gasLimit)
    .withChainID(ChainId)
    .buildTransaction();

  let transactionInput = { transactions: [tx] };

  return await runTransactions(transactionInput);
};

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
  const relayerPemFromEnv: string | undefined = process.env.NEXT_PUBLIC_RELAYER_PEM;
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

  let tx = interaction
    .withSender(senderAddress)
    .useThenIncrementNonceOf(new Account(senderAddress)) // den xerw an xreiazetai auto
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