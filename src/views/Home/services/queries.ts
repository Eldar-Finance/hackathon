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

    let scRes: any = await scQuery("xloginWsp", "getUserInfo", [
        BytesValue.fromUTF8(email)
    ]);

    let data = scRes?.firstValue;

    let finalData: IScUserInfo = {
        address: "",
        secretWords: []
    };

    const address = new Address(data.items[0].valueOf());
    finalData.address = address.bech32();

    finalData.secretWords = [];

    for (let i = 1; i < data.items.length; i++) {
        finalData.secretWords.push(data.items[i].valueOf().toString());
    }

    return finalData;
};
