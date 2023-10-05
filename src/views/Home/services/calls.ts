import {
    BytesValue,
    Address,
    AddressValue,
    BigUIntValue,
    BooleanValue,
    ContractFunction,
    Transaction,
    TransactionPayload,
    SmartContract,
    Interaction,
    Account,
    TokenTransfer,
    NothingValue,
    TokenIdentifierType,
    RelayedTransactionV2Builder
} from "@multiversx/sdk-core/out";
import { ScCallwithNoTransfer, ScCallwithEGLDTransfer, ScCallwithESDTTransfer, ScGasslessCallInnerTxSigning, ScRelayTx, ScCallwithNoTransferByRelayer } from "../../../api/sc/calls/index";
import BigNumber from "bignumber.js";
import { ChainId } from "../../../api/net.config";
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers";
import { useGetSignedTransactions } from "@multiversx/sdk-dapp/hooks";

export const createUser = async (username: string, email: string, platform: string, address: string, secret_words: string[]) => {

    const res = await ScCallwithNoTransferByRelayer({
        workspace: "xloginWsp",
        funcName: "createUser",
        args: [
            BytesValue.fromUTF8(username),
            BytesValue.fromUTF8(email),
            BytesValue.fromUTF8(platform),
            new AddressValue(new Address(address)),
            secret_words.map((word) => BytesValue.fromUTF8(word))
        ],
        gasLimit: 10000000
    });

    return res;
};
