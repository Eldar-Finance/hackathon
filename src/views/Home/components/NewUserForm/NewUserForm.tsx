import { SetStateAction, useState } from "react"

import {
    Button,
    ChakraProvider,
    Container,
    FormControl,
    Input,
    Stack,
    Text,
    VStack,
    extendTheme,
    CSSReset,
    Box,
    Flex,
    Heading,
    useToast
} from '@chakra-ui/react';
import { createUser } from "../../services/calls";
import CreateWallet from "./CreateWallet";
import { createEncryptionKey } from "@/utils/functions/cryptography";
import { useColorModeValue } from "@chakra-ui/color-mode";
import { Step, Steps, useSteps } from "chakra-ui-steps";
import CreatePin from "./CreatePin";
import { useGetUserInfo } from "@/views/Home/hooks/hooks";
import { useEffect } from "react";
import ViewWallet from "./ViewWallet";

interface NewUserFormProps {
    email: string;
    userGid: string;
    setClickedSubmit: React.Dispatch<React.SetStateAction<boolean>>; // Callback function to update clickedSubmit in parent
}

function NewUserForm({ email, userGid, setClickedSubmit }: NewUserFormProps) {
    const platform = "google";
    const hootToast = useToast();
    const { userInfo, isLoadingUserInfo, errorUserInfo } = useGetUserInfo(email, platform);

    const [pin, setPin] = useState("");
    const [activeStep, setActiveStep] = useState(0);
    const steps = [{ label: "Step 1" }, { label: "Step 2" }, { label: "Step 3" }];

    const isLastStep = activeStep === steps.length - 1;
    const bg = useColorModeValue("gray.200", "gray.700");

    useEffect(() => {
        if (!isLoadingUserInfo && userInfo?.address !== "") {
            setActiveStep(2);
        }
    }, [isLoadingUserInfo, userInfo]);

    const handleReset = () => {
        setPin("");
        setActiveStep(0);
        setClickSubmit(false);
    }

    const handleCreatePinClick = () => {
        const isNumeric = /^[0-9]+$/.test(pin);

        if (isNumeric) {
            if (pin.trim() !== '') {
                handleNextStep();
            }
        } else {
            hootToast.closeAll();
            hootToast({
                title: "Pin Info",
                description: (
                    <Text>
                        Please enter a numeric pin.
                    </Text>
                ),
                status: "info",
                duration: 2500,
                isClosable: true,
            });
        }
    };

    const handleNextStep = () => {
        setActiveStep(activeStep + 1);
    };

    const handlePreviousStep = () => {
        setActiveStep(activeStep - 1);
    };

    const [clickedSubmit, setClickSubmit] = useState(false);
    const handleCreateWalletSubmit = () => {
        setClickSubmit(true);
        setClickedSubmit(true);
    }

    const [jsonPrettyData, setJsonPrettyData] = useState('');
    const handleJsonPrettyChange = (data: any) => {
        setJsonPrettyData(data);
    }
    return (
        <Box marginTop={'10px'}>
            <Flex flexDir="column" width="100%">
                <Steps colorScheme="blue" activeStep={activeStep}>
                    {steps.map(({ label }, index) => (
                        <Step
                            label={label}
                            key={label}
                            description={
                                index === 0
                                    ? "Create pin"
                                    : index === 1
                                        ? "Create wallet"
                                        : index === 2
                                            ? "View wallet"
                                            : ''
                            }
                        >
                            <Box sx={{ p: 8, bg, my: 8, rounded: "md" }}>
                                <Heading fontSize="xl" textAlign="center">
                                    {index === 0 && (
                                        <CreatePin
                                            setPin={setPin}
                                            pin={pin}
                                            onCreatePinClick={() => {
                                                handleCreatePinClick();
                                            }}
                                        />
                                    )}
                                    {index === 1 && (
                                        <CreateWallet pin={pin} email={email} handleReset={handleReset} userGid={userGid} setClickSubmit={handleCreateWalletSubmit}
                                            onJsonPrettyChange={handleJsonPrettyChange}
                                        />
                                    )}
                                    {index === 2 && userInfo && !isLoadingUserInfo &&
                                        <ViewWallet userInfo={userInfo} isLoadingUserInfo={isLoadingUserInfo} jsonPrettyData={jsonPrettyData} />
                                    }
                                    {index === 3 && !isLoadingUserInfo &&
                                        <Text>
                                            Connect
                                        </Text>
                                    }
                                </Heading>
                            </Box>
                        </Step>
                    ))}
                </Steps>
                <Flex width="100%" justify="flex-end" gap={4}>
                    {activeStep > 0 && userInfo?.address === "" && (
                        <Button size="sm" onClick={() => handlePreviousStep()}>
                            Back
                        </Button>
                    )}
                    {activeStep > 0 && !isLastStep && (!isLoadingUserInfo && userInfo?.address !== "") && (
                        <Button size="sm" onClick={() => handleNextStep()}>
                            Connect Wallet
                        </Button>
                    )}
                    {activeStep > 0 && isLastStep && (
                        <Button size="sm" onClick={() => handlePreviousStep()}>
                            Back
                        </Button>
                    )}
                </Flex>
            </Flex>
        </Box>
    );
}

export default NewUserForm;