import { ChainId, contractAddr, network } from "../net.config";
import { Address, Transaction } from "@multiversx/sdk-core/out";
import { ProxyNetworkProvider } from "@multiversx/sdk-network-providers";
import { sendTransactions } from "@multiversx/sdk-dapp/services";

//abis import
import xloginAbi from "../../assets/abi/xlogin.abi.json";

/* Queries */
export const provider = new ProxyNetworkProvider(network.gatewayAddress, {
    timeout: 30000,
});

export const abiPath = "/api";

export const EGLD_VAL = 1000000000000000000;


/* Calls */
export const runTransactions = async ({
    transactions,
    processingMessage = "Processing transaction",
    errorMessage = "An error has occurred",
    successMessage = "Transaction successful",
    transactionDuration = 1000 * 60 * 2,
}: {
    transactions: any;
    processingMessage?: string;
    errorMessage?: string;
    successMessage?: string;
    transactionDuration?: number;
}) => {

    const res = await sendTransactions({
        transactions,
        transactionsDisplayInfo: {
            processingMessage,
            errorMessage,
            successMessage,
            transactionDuration,
        },
    });

    return res;
};

export type WspTypes =
    | "xloginWsp";

export const getInterface = (workspace: WspTypes) => {

    let address = null;
    let abiUrl: any = null;
    let implementsInterfaces = "";
    let simpleAddress = "";

    switch (workspace) {
        case "xloginWsp":
            simpleAddress = contractAddr.xlogin;
            address = new Address(simpleAddress);
            abiUrl = xloginAbi;
            implementsInterfaces = "xloginWsp";
            break;
        default:
            break;
    }

    return { address, abiUrl, implementsInterfaces, simpleAddress };
}