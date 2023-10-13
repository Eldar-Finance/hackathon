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
const steps = [{ label: "Step 1" }, { label: "Step 2" }, { label: "Step 3" }, { label: "Finally" }];

function NewUserForm({ email, userGid }: { email: string; userGid: string; }) {

    const [pin, setPin] = useState("");
    const [isPinFilled, setIsPinFilled] = useState(false);

    const { nextStep, prevStep, reset, activeStep } = useSteps({
        initialStep: 0,
    });

    const isLastStep = activeStep === steps.length - 1;
    const hasCompletedAllSteps = activeStep === steps.length;
    const bg = useColorModeValue("gray.200", "gray.700");

    const handleReset = () => {
        setPin("");
        reset();
    }

    return (
        <Box
            px={20}
            marginTop={'100px'}
        >
            <Flex flexDir="column" width="100%">
                <Steps colorScheme="blue" activeStep={activeStep}>
                    {steps.map(({ label }, index) => (
                        <Step label={label} key={label}
                            description={index === 0 ? "Create pin" : index === 1 ? "Create wallet" : index === 2 ? "Create account" : "View your wallet"}
                        >
                            <Box sx={{ p: 8, bg, my: 8, rounded: "md" }}>
                                <Heading fontSize="xl" textAlign="center">
                                    {index === 0 ? (
                                        <CreatePin setPin={setPin} onPinChange={(pin) => setIsPinFilled(pin.length > 0)} pin={pin}/>
                                    ) : index === 1 ? (
                                        <CreateWallet pin={pin} email={email} handleReset={handleReset} userGid={userGid}/>
                                    ) : "Create your account"}
                                </Heading>
                            </Box>
                        </Step>
                    ))}
                </Steps>
                {hasCompletedAllSteps && (
                    <Box sx={{ bg, my: 8, p: 8, rounded: "md" }}>
                        <Heading fontSize="xl" textAlign={"center"}>
                            Woohoo! All steps completed! 🎉
                        </Heading>
                    </Box>
                )}
                <Flex width="100%" justify="flex-end" gap={4}>
                    {hasCompletedAllSteps ? (
                        <Button size="sm" onClick={reset}>
                            Reset
                        </Button>
                    ) : (
                        <>
                            <Button
                                isDisabled={activeStep === 0}
                                onClick={prevStep}
                                size="sm"
                                variant="ghost"
                            >
                                Prev
                            </Button>
                            <Button isDisabled={!isPinFilled} size="sm" onClick={nextStep}>
                                {isLastStep ? "Finish" : "Next"}
                            </Button>
                        </>
                    )}
                </Flex>
            </Flex>
        </Box>
    );
}

export default NewUserForm;