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
  } from '@chakra-ui/react';
  
// Define custom Chakra UI theme to control transitions
const theme = extendTheme({
    initialColorMode: 'light',
});

interface Step1Props {
    formData: {
        username?: string;
    };
    onNext: (data: { username: string }) => void;
}

function Step1({ formData, onNext }: Step1Props) {
    const [username, setUsername] = useState(formData.username || '');

    const handleNext = () => {
        onNext({ username });
    };

    return (
        <VStack spacing={4}>
            <Text fontSize="xl">Step 1: Enter Username</Text>
            <FormControl>
                <Input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
            </FormControl>
            <Button colorScheme="blue" onClick={handleNext}>
                Next
            </Button>
        </VStack>
    );
}

interface Step2Props {
    formData: {
        pin?: string;
    };
    onPrevious: () => void;
    onNext: (data: { pin: string }) => void;
}

function Step2({ formData, onPrevious, onNext }: Step2Props) {
    const [pin, setPin] = useState(formData.pin || '');

    const handlePrevious = () => {
        onPrevious();
    };

    const handleNext = () => {
        onNext({ pin });
    };

    return (
        <VStack spacing={4}>
            <Text fontSize="xl">Step 2: Enter PIN</Text>
            <FormControl>
                <Input
                    type="text"
                    placeholder="PIN"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                />
            </FormControl>
            <Stack direction="row">
                <Button colorScheme="gray" onClick={handlePrevious}>
                    Previous
                </Button>
                <Button colorScheme="blue" onClick={handleNext}>
                    Next
                </Button>
            </Stack>
        </VStack>
    );
}

function Form() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});

    const handleNext = (data: SetStateAction<{}>) => {
        setFormData({ ...formData, ...data });
        setStep(step + 1);
    };

    const handlePrevious = () => {
        setStep(step - 1);
    };

    const handleReset = () => {
        setStep(1);
        setFormData({});
    }

    return (
        <ChakraProvider theme={theme}>
        <CSSReset />
        <Container maxW="sm">
            {step === 1 && <Step1 formData={formData} onNext={handleNext} />}
            {step === 2 && (
            <Step2 formData={formData} onPrevious={handlePrevious} onNext={handleNext} />
            )}
            {step > 2 && (
            <><Box>
                    <Text fontSize="xl">Review and Submit</Text>
                    <pre>{JSON.stringify(formData, null, 2)}</pre>
                    {/* Add a submit button here */}
                </Box>
                <Stack direction="row">
                    <Button colorScheme="gray" onClick={handlePrevious}>
                        Previous
                    </Button>
                    <Button colorScheme="blue" onClick={handleReset}>
                        Reset
                    </Button>
                </Stack></>
            )}
        </Container>
        </ChakraProvider>
    );
}

export default Form;