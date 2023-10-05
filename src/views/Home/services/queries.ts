import { scQuery } from "@/api/sc/queries";
import { IScUserInfo } from "@/utils/types/sc.interface";
import {
    Address,
    AddressValue,
    BigUIntValue,
    BytesValue
} from "@multiversx/sdk-core/out";
import BigNumber from "bignumber.js";

export const fetchUserInfo = async (email: string, platform: string): Promise<IScUserInfo> => {

    let scRes;
    scRes = await scQuery("xloginWsp", "getUserInfo", [
        BytesValue.fromUTF8(email),
        BytesValue.fromUTF8(platform)
    ]);

    let data = scRes?.firstValue?.valueOf();

    const finalData: IScUserInfo = data.map((item: any) => {
        return item.valueOf().toString();
    });

    return finalData;
};
