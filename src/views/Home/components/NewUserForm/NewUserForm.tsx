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
const steps = [{ label: "Step 1" }, { label: "Step 2" }, { label: "Step 3" }];


interface Step1Props {
    pinData: {
        pin?: string;
    };
    onPrevious: () => void;
    onNext: (data: { pin: string }) => void;
}

// function Step1({ pinData, onPrevious, onNext }: Step1Props) {
//     const [pin, setPin] = useState(pinData.pin || '');

//     const handlePrevious = () => {
//         onPrevious();
//     };

//     const handleNext = () => {
//         onNext({ pin });
//     };

//     const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         if (value.length <= 4 && /^\d*$/.test(value)) {
//             setPin(value);
//         }
//     };

//     return (
//         <VStack spacing={4}>
//             <Text fontSize="xl">Create PIN</Text>
//             <Text>
//                 This is the most important part.
//             </Text>
//             <Text>
//                 Your PIN (alongside your email) will be used to encrypt your 24 secret words in the SC. The encryption key will be created from a combination of your email and your PIN using a hashing algorithm.
//             </Text>
//             <Text>
//                 In order to maintain the security of your wallet, PIN will never be saved anywhere. Thus, if you forget your PIN, you lose access to your wallet. This is irreversible since nobody else can recover the PIN for you.
//             </Text>
//             <Text>
//                 Notice that you will need to enter your PIN every time you want to connect in a dApp using xLogin.
//             </Text>
//             <FormControl maxW={'250px'}>
//                 <Input
//                     type="text"
//                     placeholder="PIN"
//                     value={pin}
//                     onChange={handlePinChange}
//                     maxLength={4}
//                 />
//             </FormControl>
//             <Text>
//                 *only 4 digits
//             </Text>
//             <Stack direction="row">
//                 <Button colorScheme="gray" onClick={handlePrevious}>
//                     Previous
//                 </Button>
//                 <Button colorScheme="blue" onClick={handleNext}>
//                     Next
//                 </Button>
//             </Stack>
//         </VStack>
//     );
// }

// interface FormData {
//     pin?: string;
// }

function NewUserForm({ email, userGid }: { email: string; userGid: string; }) {

    const [pin, setPin] = useState("");

    const { nextStep, prevStep, reset, activeStep } = useSteps({
        initialStep: 0,
    });

    const isLastStep = activeStep === steps.length - 1;
    const hasCompletedAllSteps = activeStep === steps.length;
    const bg = useColorModeValue("gray.200", "gray.700");
    // const [step, setStep] = useState(1);
    // const [formData, setFormData] = useState<FormData>({});

    // const handleNext = (data: SetStateAction<{}>) => {
    //     setFormData({ ...formData, ...data });
    //     setStep(step + 1);
    // };

    // const handlePrevious = () => {
    //     setStep(step - 1);
    // };

    const handleReset = () => {
        setPin("");
        reset();
    }

    return (
        // <Container
        //     minW="800px"
        //     minH="800px"
        //     border="1px solid black"
        //     display="flex"
        //     justifyContent="center"
        // >
        //     {step === 1 && (
        //         <Step1 pinData={formData} onPrevious={handlePrevious} onNext={handleNext} />
        //     )}
        //     {step == 2 &&
        //         <VStack>
        //             <CreateWallet formData={formData} email={email} handleReset={handleReset} userGid={userGid} />
        //         </VStack>
        //     }
        // </Container>
        <Box
            px={20}
            marginTop={'100px'}
        >
            <Flex flexDir="column" width="100%">
                <Steps colorScheme="blue" activeStep={activeStep}>
                    {steps.map(({ label }, index) => (
                        <Step label={label} key={label}
                            description={index === 0 ? "Create pin" : index === 1 ? "Create wallet" : "Create account"}
                        >
                            <Box sx={{ p: 8, bg, my: 8, rounded: "md" }}>
                                <Heading fontSize="xl" textAlign="center">
                                    {index === 0 ? (
                                        <CreatePin setPin={setPin} />
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
                            <Button size="sm" onClick={nextStep}>
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