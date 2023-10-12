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
import { ScCallwithNoTransferByRelayer } from "../../../api/sc/calls/index";
import BigNumber from "bignumber.js";
import { ChainId } from "../../../api/net.config";
import { ApiNetworkProvider } from "@multiversx/sdk-network-providers";
import { useGetSignedTransactions } from "@multiversx/sdk-dapp/hooks";

export const createUser = async (email: string, address: string, secretWords: string) => {

    const words = secretWords.split('.').filter((value) => value !== "").map((value) => BytesValue.fromUTF8(value));
    const args = [
        BytesValue.fromUTF8(email),
        new AddressValue(new Address(address)),
        ...words
    ];

    const res = await ScCallwithNoTransferByRelayer({
        workspace: "xloginWsp",
        funcName: "createUser",
        args,
        gasLimit: 13000000
    });

    return res;
};
