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
        BytesValue.fromUTF8(email),
        BytesValue.fromUTF8(platform)
    ]);

    let data = scRes?.firstValue;

    let finalData: IScUserInfo = {
        username: "",
        address: "",
        secretWords: []
    };

    finalData.username = data.items[0].valueOf().toString();
    const address = new Address(data.items[1].valueOf());
    finalData.address = address.bech32();

    finalData.secretWords = [];

    for (let i = 2; i < data.items.length; i++) {
        finalData.secretWords.push(data.items[i].valueOf().toString());
    }

    return finalData;
};
