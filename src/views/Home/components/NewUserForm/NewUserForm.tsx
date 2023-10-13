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
    Heading
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
    const { userInfo, isLoadingUserInfo, errorUserInfo } = useGetUserInfo(email, platform);

    const [pin, setPin] = useState("");
    const [isPinFilled, setIsPinFilled] = useState(false);
    const [activeStep, setActiveStep] = useState(0);
    const steps = [{ label: "Step 1" }, { label: "Step 2" }, { label: "Step 3" }, { label: "Finally" }];

    const isLastStep = activeStep === steps.length - 1;
    const hasCompletedAllSteps = activeStep === steps.length;
    const bg = useColorModeValue("gray.200", "gray.700");

    useEffect(() => {
        if (!isLoadingUserInfo && userInfo?.address !== "") {
            setActiveStep(3);
        }
    }, [isLoadingUserInfo, userInfo]);

    const handleReset = () => {
        setPin("");
        setIsPinFilled(false);
        setActiveStep(0);
        setClickSubmit(false);
    }

    const handleCreatePinClick = () => {
        setIsPinFilled(true);
    };

    const handleNextStep = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep(activeStep + 1);
        }
    };

    const handlePreviousStep = () => {
        if (activeStep < steps.length - 1) {
            setActiveStep(activeStep - 1);
        }
    };

    const [clickedSubmit, setClickSubmit] = useState(false);
    const handleCreateWalletSubmit = () => {
        console.log("clicked submit from new user form")
        setClickSubmit(true);
        setClickedSubmit(true);
    }

    return (
        <Box px={20} marginTop={'100px'}>
            <Flex flexDir="column" width="100%">
                <Steps colorScheme="blue" activeStep={activeStep}>
                    {steps.map(({ label }, index) => (
                        <Step
                            label={label}
                            key={label}
                            description={
                                index === 0
                                    ? "Create a digit pin"
                                    : index === 1
                                        ? "Create a wallet"
                                        : index === 2
                                            ? "View the wallet"
                                            : undefined
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
                                                setIsPinFilled(true);
                                                handleNextStep();
                                            }}
                                        />
                                    )}
                                    {index === 1 && isPinFilled && (
                                        <CreateWallet pin={pin} email={email} handleReset={handleReset} userGid={userGid} setClickSubmit={handleCreateWalletSubmit }/>
                                    )}
                                    {index > 1 && userInfo && !isLoadingUserInfo &&
                                        <ViewWallet userInfo={userInfo} isLoadingUserInfo={isLoadingUserInfo} />
                                    }
                                </Heading>
                            </Box>
                        </Step>
                    ))}
                </Steps>
                <Flex width="100%" justify="flex-end" gap={4}>
                    {activeStep > 0 && (isLoadingUserInfo && userInfo?.address === "") &&(
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