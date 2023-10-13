import React, { ChangeEvent } from 'react';
import { useState } from 'react';
import { Input, Text, Box, Flex, Button } from '@chakra-ui/react';
interface CreatePinProps {
    setPin: React.Dispatch<React.SetStateAction<string>>;
    onCreatePinClick: () => void;
    pin: string;
    
}
function CreatePin({ setPin, pin, onCreatePinClick }: CreatePinProps) {

    const handlePinChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newPin = event.target.value;
        setPin(newPin);
    }

    const handleCreatePin = () => {
        onCreatePinClick(); // Trigger the callback from the parent component
      }
    return (
        <Box>
            <Flex
                flexDirection={'column'}
                align={'start'}
                fontWeight={100}
                gap={6}
                textAlign={'left'}
            >
                <Text alignSelf={'center'} fontWeight={'bold'}>Create a digit PIN</Text>
                <Text>
                    This is the most important part.
                </Text>
                <Text>
                    Your PIN (alongside your email) will be used to encrypt your 24 secret words in the SC.
                    The encryption key will be created from a combination of your email and your PIN using a hashing algorithm.
                </Text>
                <Text>
                    In order to maintain the security of your wallet, PIN will never be saved anywhere.
                    Thus, if you forget your PIN, you lose access to your wallet. This is irreversible since nobody else can recover the PIN for you.
                </Text>
                <Text>
                    Notice that you will need to enter your PIN every time you want to connect in a dApp using xLogin.
                </Text>
                <Input
                    value={pin}
                    placeholder='Type your pin' onChange={handlePinChange}
                    borderColor={'1px solid #E2E8F0'}
                />
                <Button
                    onClick={() => handleCreatePin()}
                >
                    Create Pin
                </Button>
            </Flex>
        </Box>
    );
}
export default CreatePin;