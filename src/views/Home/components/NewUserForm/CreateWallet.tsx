import { Button, Flex, VStack, Text, HStack, Grid, Stack } from "@chakra-ui/react";
import { Mnemonic, UserWallet } from "@multiversx/sdk-wallet";
import { getShardOfAddress } from "@multiversx/sdk-dapp/utils/account"
import { useEffect, useState } from "react";
import { createUser } from "../../services/calls";
import React from 'react';
import { createEncryptionKey, encrypt } from "@/utils/functions/cryptography";
import { network } from "@/config.devnet";
import { TransactionActionsEnum } from "@multiversx/sdk-dapp/types";

interface CreateWalletProps {
    pin: string;
    email: string;
    handleReset: () => void;
    userGid: string;
    setClickSubmit: React.Dispatch<React.SetStateAction<boolean>>;
    onJsonPrettyChange: (jsonPretty: string) => void;
}

export default function CreateWallet({ pin, email, handleReset, userGid, setClickSubmit, onJsonPrettyChange }: CreateWalletProps) {

    const [encryptionKey, setEncryptionKey] = useState(createEncryptionKey(pin, userGid));
    const [walletCreationHash, setWalletCreationHash] = useState("");
    const [txDetails, setTxDetails] = useState('');
    const [jsonPretty, setJsonPretty] = useState('');

    useEffect(() => {
        if (walletCreationHash != "") {

            const fetchDetails = async () => {
                try {
                    const response = await fetch(`${network.apiAddress}/transactions/${walletCreationHash}`);
                    const data = await response.json();
                    return data.status;
                } catch (error) {
                    throw new Error('Unable to fetch token info');
                }
            };
            // Fetch the token information and update tokenDecimals state
            fetchDetails()
                .then((details) => {
                    setTxDetails(details);
                })
                .catch((error) => {
                    console.error('Error fetching tx details:', error);
                });
        }
    }, [walletCreationHash]);

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

    const [jsonFileDownloaded, setJsonFileDownloaded] = useState(false);

    const downloadJsonFile = () => {
        // Create a Blob from the JSON content
        const blob = new Blob([jsonFileContent], { type: 'application/json' });

        // Create a data URL for the Blob
        const url = URL.createObjectURL(blob);

        // Create an anchor element for downloading
        const a = document.createElement('a');
        a.href = url;
        a.download = 'mywallet.json';

        // Trigger a click event on the anchor element
        a.click();

        // Clean up by revoking the URL
        URL.revokeObjectURL(url);

        // Set the state to indicate that the file has been downloaded
        setJsonFileDownloaded(true);
    };


    // Create a null wallet info object
    const nullWalletInfo = Object.fromEntries(
        Object.entries(walletInfoTypes).map(([key, value]) => [value, null])
    ) as Record<WalletInfoType, any>;
    const [walletInfo, setWalletInfo] = useState(nullWalletInfo);
    const [clickedForInfo, setClickedForInfo] = useState(false);
    const [clickedSubmit, setClickedSubmit] = useState(false);
    const [jsonFileContent, setJsonFileContent] = useState("");

    const generateWalletInfo = () => {
        const mnemonic = Mnemonic.generate();
        const words = mnemonic.getWords().join('.');
        const mnemonicString = mnemonic.toString();
        const mnemonicKey = mnemonic.deriveKey();
        const mnemonicPublicKey = mnemonicKey.generatePublicKey();
        const address = mnemonicPublicKey.toAddress().bech32();
        const addressShard = getShardOfAddress(mnemonicPublicKey);
        const password = pin;
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
    }

    const handleSubmit = async () => {
        setClickedSubmit(true);
        setClickSubmit(true);
        try {
            const hash = await createUser(
                email,
                walletInfo.address,
                walletInfo.words.split('.').map((word: string) => encrypt(word, encryptionKey)).join('.')
            );
            setWalletCreationHash(hash?.toString() || "");

            const password = pin;
            const addressIndex = 0;

            const secretKey = walletInfo.mnemonic.deriveKey(walletInfo.addressIndex);
            const userWallet = UserWallet.fromSecretKey({ secretKey, password });
            const jsonFileContent = userWallet.toJSON();
            const jsonPretty = JSON.stringify(jsonFileContent);

            setJsonFileContent(jsonPretty);
            setJsonPretty(jsonPretty);
            onJsonPrettyChange(jsonPretty);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <Flex gap={2} direction={'column'}>
                <Text alignSelf={'flex-start'} fontWeight={'bold'}>Create a wallet</Text>
                {!clickedForInfo &&
                    <Flex direction={'column'} gap={5}>
                        <Text alignSelf={'flex-start'} fontWeight={'400'}>
                            Click to generate the information for a new wallet:
                        </Text>
                        <Button
                            border={'1px solid black'}
                            background={'black'}
                            color={'white'}
                            _hover={{ background: 'white', color: 'black' }}
                            outline={'none'}
                            _active={{ outline: 'none' }}
                            onClick={handleGenerateWalletInfo}
                        >
                            Generate
                        </Button>
                    </Flex>
                }
                {clickedForInfo &&
                    <Flex
                        direction={'column'}
                        gap={1}
                        alignItems={'flex-start'}
                    >
                        <Text fontWeight={'400'}>New wallet information</Text>
                        <Text style={{ wordWrap: 'break-word' }} textAlign={'left'}>
                            Shard: {walletInfo.addressShard}
                        </Text>
                        <Text style={{ wordWrap: 'break-word' }} textAlign={'left'}>
                            Address: {walletInfo.address}
                        </Text>
                        {jsonFileContent == "" &&
                            <Flex
                            direction={{ base: 'column', md: 'row' }}
                            pt={10}
                            justify={'space-between'}
                            gap={5}
                            width={'100%'}
                            >
                                <Button colorScheme="red" w={'100%'} onClick={handleReset}>
                                    Reset
                                </Button>
                                <Button
                                    w={'100%'}
                                    _hover={{
                                        opacity: 1,
                                        boxShadow: 'lg'
                                    }}
                                    onClick={handleGenerateWalletInfo}
                                >
                                    Re-generate Wallet
                                </Button>
                                <Button colorScheme="blue" onClick={handleSubmit}  w={'100%'}>
                                    Submit
                                </Button>
                            </Flex>
                        }
                        {jsonFileContent != "" && !jsonFileDownloaded && (
                            <Flex
                            pt={10}
                            justify={'space-between'}
                            gap={5}
                            width={'100%'}
                            >
                                <Button colorScheme="red" w={'100%'} onClick={handleReset}>
                                    Reset
                                </Button>
                                <Button
                                    w={'100%'}
                                    _hover={{
                                        opacity: 1,
                                        boxShadow: 'lg',
                                    }}
                                    onClick={handleGenerateWalletInfo}
                                >
                                    Re-generate Wallet
                                </Button>
                                <Button colorScheme="blue" onClick={handleSubmit}  w={'100%'}>
                                    {clickedSubmit || (!txDetails && txDetails == "pending") ? "Loading..." : "Submit"}
                                </Button>
                            </Flex>
                        )}
                        {/* {jsonFileContent != "" && jsonFileDownloaded && (
                                <>
                                    <Button
                                        colorScheme="teal"
                                        onClick={downloadJsonFile}
                                    >
                                        Download JSON
                                    </Button>
                                    <Text fontWeight={'semibold'} maxW={'400px'}>
                                        Congratulations! Now you can save the JSON file in a safe place and connect using it (password is &apos;password&apos; 😎).
                                    </Text>
                                    <Text mt={20} fontWeight={'semibold'} maxW={'400px'}>
                                        Wait a few seconds and refresh the page. You should see your information if everything ran successfully.
                                    </Text>
                                </>
                            )} */}
                    </Flex>
                }

            </Flex>
        </>
    );
}
