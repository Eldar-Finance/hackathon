import React, { ChangeEvent } from 'react';
import { Input, Text, Box, Flex } from '@chakra-ui/react';
interface CreatePinProps {
    setPin: React.Dispatch<React.SetStateAction<string>>;
    onPinChange: (pin: string) => void;
    pin: string;
}
function CreatePin({ setPin, onPinChange, pin }: CreatePinProps) {
    const handlePinChange = (event: ChangeEvent<HTMLInputElement>) => {
        const newPin = event.target.value;
        setPin(newPin);
        onPinChange(newPin);
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
                <Text alignSelf={'center'} fontWeight={'bold'}>Create PIN</Text>
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
            </Flex>
        </Box>
    );
}
export default CreatePin;