import {
    Address,
    AddressValue,
    BigUIntValue
} from "@multiversx/sdk-core/out";
// import { useAppSelector } from "../../../components/utils/hooks/redux";
// import { selectUserAddress } from "../../../redux/slices/userAccount/account-slice";
import useSwr from "swr";
import { ApiNetworkProvider, ProxyNetworkProvider } from "@multiversx/sdk-network-providers";
import { ChainId, network } from "../../../api/net.config";
import { IScUserInfo } from "@/utils/types/sc.interface";
import { fetchUserInfo } from "../services/queries";

export const useGetUserInfo = (email: string, platform: string) => {
    const {
        data: data,
        isLoading,
        error,
    } = useSwr<IScUserInfo>(
        email != "" && platform != "" ? `xloginWsp:getUserInfo:${email}~${platform}` : null,
        async () => {
            return await fetchUserInfo(email, platform);
        },
        {
            fallbackData: {
                username: "",
                address: "",
                secretWords: [""]
            },
        }
    );

    return {
        userInfo: data,
        isLoadingUserInfo: isLoading,
        errorUserInfo: error,
    };
};



// if (!relayerAddressFromEnv || !relayerPemFromEnv) {
//     return null;
//   }

//   const relayerAddress = new Address(relayerAddressFromEnv);
//   const relayerAccount = new Account(relayerAddress);
//   const relayerOnNetwork = await apiNetworkProvider.getAccount(relayerAddress);
//   relayerAccount.update(relayerOnNetwork);

//   const relayed_tx = new RelayedTransactionV2Builder()
//     .setInnerTransaction(inner_tx)
//     .setInnerTransactionGasLimit(gasLimit)
//     .setRelayerAddress(relayerAddress)
//     .setRelayerNonce(relayerAccount.nonce)
//     .setNetworkConfig(networkConfig)
//     .build();