import {
    Address,
    AddressValue,
    BigUIntValue
} from "@multiversx/sdk-core/out";
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