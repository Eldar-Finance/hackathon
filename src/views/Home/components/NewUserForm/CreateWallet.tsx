import { Button, Flex, VStack, Text, HStack, Grid, Stack } from "@chakra-ui/react";
import { Mnemonic, UserWallet } from "@multiversx/sdk-wallet";
import { getShardOfAddress } from "@multiversx/sdk-dapp/utils/account"
import { useEffect, useState } from "react";
import { createUser } from "../../services/calls";
import React from 'react';
import { createEncryptionKey, encrypt } from "@/utils/functions/cryptography";
import { network } from "@/config.devnet";
import { TransactionActionsEnum } from "@multiversx/sdk-dapp/types";

export default function CreateWallet({pin, email, handleReset, userGid}: {pin: string, email: string, handleReset: any, userGid: string}) {

    const [encryptionKey, setEncryptionKey] = useState(createEncryptionKey(pin, userGid));
    const [walletCreationHash, setWalletCreationHash] = useState("");
    const [txDetails, setTxDetails] = useState('');

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
    // console.log("⚠️ ~ file: CreateWallet.tsx:1 ~ CreateWallet ~ txDetails", txDetails)
    // if !txDetails && txDetails.status == "pending" show Loading in the middle of the screen with blur behind it


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
    }

    const handleSubmit = async () => {
        setClickedSubmit(true);
        try {
            const hash = await createUser(
                email,
                walletInfo.address,
                walletInfo.words.split('.').map((word: string) => encrypt(word, encryptionKey)).join('.')
            );
            setWalletCreationHash(hash?.toString() || "");

            const password = 'password';
            const addressIndex = 0;

            const secretKey = walletInfo.mnemonic.deriveKey(walletInfo.addressIndex);
            const userWallet = UserWallet.fromSecretKey({ secretKey, password });
            const jsonFileContent = userWallet.toJSON();
            const jsonPretty = JSON.stringify(jsonFileContent);

            setJsonFileContent(jsonPretty);
        } catch (error) {
            console.error(error);
        }
    };
   
    return (
        <>
            <Flex m={10} gap={5}>
                <VStack>
                    <Text fontWeight={'bold'} fontSize={'3xl'}>
                        Create Wallet
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
                            {jsonFileContent != "" && !jsonFileDownloaded && (
                                <HStack mt={20}>
                                    <Button colorScheme="red" onClick={handleReset}>
                                    Reset
                                    </Button>
                                    <Button
                                    w={'fit'}
                                    _hover={{
                                        opacity: 1,
                                        boxShadow: 'lg',
                                    }}
                                    onClick={handleGenerateWalletInfo}
                                    >
                                    Re-generate Wallet
                                    </Button>
                                    <Button colorScheme="blue" onClick={handleSubmit}>
                                        {clickedSubmit || (!txDetails && txDetails == "pending") ? "Loading..." : "Submit"}
                                    </Button>
                                </HStack>
                            )}
                            {jsonFileContent != "" && jsonFileDownloaded && (
                            <>
                            {/* 
                            <Text maxW={'700px'}>
                            <b>JSON File:</b> {jsonFileContent}
                            </Text>
                            */}
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
                        )}
                        </VStack>
                    }
                </VStack>
            </Flex>
        </>
    );
}
