import { Button, Flex, VStack, Text, HStack, Grid, Stack } from "@chakra-ui/react";
import { Mnemonic, UserWallet } from "@multiversx/sdk-wallet";
import { getShardOfAddress } from "@multiversx/sdk-dapp/utils/account"
import { useState } from "react";
import { createUser } from "../../services/calls";

export default function CreateWallet({formData, email, platform, handleReset}: {formData: any, email: string, platform: string, handleReset: any}) {

    const walletInfoTypes = {
        mnemonic: "mnemonic",
        words: "words",
        mnemonicString: "mnemonicString",
        mnemonicKey: "mnemonicKey",
        mnemonicPublicKey: "mnemonicPublicKey",
        address: "address",
        addressShard: "addressShard",
        password: "password",
        addressIndex: "addressIndex",
        secretKey: "secretKey",
        userWallet: "userWallet",
        jsonFileContent: "jsonFileContent",
        jsonPretty: "jsonPretty",
    } as const;

    type WalletInfoType = keyof typeof walletInfoTypes;

    // Create a null wallet info object
    const nullWalletInfo = Object.fromEntries(
        Object.entries(walletInfoTypes).map(([key, value]) => [value, null])
    ) as Record<WalletInfoType, any>;
    const [walletInfo, setWalletInfo] = useState(nullWalletInfo);
    const [clickedForInfo, setClickedForInfo] = useState(false);
    const [jsonFileContent, setJsonFileContent] = useState("");

    const generateWalletInfo = () => {
        const mnemonic = Mnemonic.generate();
        const words = mnemonic.getWords().join('.');
        const mnemonicString = mnemonic.toString();
        const mnemonicKey = mnemonic.deriveKey();
        const mnemonicPublicKey = mnemonicKey.generatePublicKey();
        const address = mnemonicPublicKey.toAddress().bech32();
        const addressShard = getShardOfAddress(mnemonicPublicKey);
        const password = "password";
        const addressIndex = 0;
        const secretKey = mnemonic.deriveKey(addressIndex);
        const userWallet = UserWallet.fromSecretKey({ secretKey, password });
        const jsonFileContent = userWallet.toJSON();
        const jsonPretty = JSON.stringify(jsonFileContent);

        const walletInfo: Record<WalletInfoType, unknown> = {
            [walletInfoTypes.mnemonic]: mnemonic,
            [walletInfoTypes.words]: words,
            [walletInfoTypes.mnemonicString]: mnemonicString,
            [walletInfoTypes.mnemonicKey]: mnemonicKey,
            [walletInfoTypes.mnemonicPublicKey]: mnemonicPublicKey,
            [walletInfoTypes.address]: address,
            [walletInfoTypes.addressShard]: addressShard,
            [walletInfoTypes.password]: password,
            [walletInfoTypes.addressIndex]: addressIndex,
            [walletInfoTypes.secretKey]: secretKey,
            [walletInfoTypes.userWallet]: userWallet,
            [walletInfoTypes.jsonFileContent]: jsonFileContent,
            [walletInfoTypes.jsonPretty]: jsonPretty,
        };

        return walletInfo;
    };

    const handleGenerateWalletInfo = () => {
        setClickedForInfo(true);
        const walletInfo = generateWalletInfo();
        setWalletInfo(walletInfo);
        console.log("⚠️ ~ file: CreateWallet.tsx:97 ~ handleGenerateWalletInfo ~ walletInfo::::", walletInfo)
    }

    const handleSubmit = () => {
        console.log("⚠️ ~ file: NewUserForm.tsx:158 ~ handleSubmit ~ email::::", formData.username, email, platform)
        createUser(formData.username || "", email, platform, walletInfo.address, walletInfo.words);

        const password = "password";
        const addressIndex = 0;
    
        const secretKey = walletInfo.mnemonic.deriveKey(walletInfo.addressIndex);
        const userWallet = UserWallet.fromSecretKey({ secretKey, password });
        const jsonFileContent = userWallet.toJSON();
        const jsonPretty = JSON.stringify(jsonFileContent);
        
        setJsonFileContent(jsonPretty);
    }

    return (
        <>
            <Flex m={10} gap={5}>
                <VStack>
                    <Text fontWeight={'bold'} fontSize={'3xl'}>
                        Wallet Creation
                    </Text>
                    {!clickedForInfo &&
                        <HStack>
                            <Text>
                                Click to generate the information for a new wallet:
                            </Text>
                            <Button
                                w={'fit'}
                                _hover={{
                                    opacity: 1,
                                    boxShadow: 'lg'
                                }}
                                onClick={handleGenerateWalletInfo}
                            >
                                Generate
                            </Button>
                        </HStack>
                    }
                    {clickedForInfo &&
                        <VStack>
                            <Text fontWeight={'semibold'}>New wallet information:</Text>
                            <Text>
                                <b>Shard:</b> {walletInfo.addressShard}
                            </Text>
                            <Text>
                                <b>Address:</b> {walletInfo.address}
                            </Text>
                            <Text>
                                <b>Secret Words:</b>
                                <Grid templateColumns="repeat(4, 1fr)">
                                    {walletInfo.words.split('.').map((word: string, index: number) => (
                                        <Text key={index} as="span" border="1px solid black" padding="1" m={1}>
                                            {word}
                                        </Text>
                                    ))}
                                </Grid>
                            </Text>
                            {jsonFileContent == "" &&
                            <HStack mt={20}>
                                <Button colorScheme="red" onClick={handleReset}>
                                    Reset
                                </Button>
                                <Button
                                    w={'fit'}
                                    _hover={{
                                        opacity: 1,
                                        boxShadow: 'lg'
                                    }}
                                    onClick={handleGenerateWalletInfo}
                                >
                                    Re-generate Wallet
                                </Button>
                                <Button colorScheme="blue" onClick={handleSubmit}>
                                    Submit
                                </Button>
                            </HStack>
                            }
                            {jsonFileContent != "" &&
                                <>
                                <Text maxW={'700px'}>
                                    <b>JSON File:</b> {jsonFileContent}
                                </Text>
                                <Text fontWeight={'semibold'} maxW={'400px'}>
                                    Congratsulations! Now you can save the JSON file in a safe place and connect using it (password is &#34;password&#34; 😎).
                                </Text>
                                <Text mt={20} fontWeight={'semibold'} maxW={'400px'}>
                                    Wait a few seconds and refresh the page. You should see your information if everything run successfully.
                                </Text>
                                </>
                            }
                        </VStack>
                    }
                </VStack>
        </Flex>
        </>
    );
}
