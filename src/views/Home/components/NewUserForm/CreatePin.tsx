import React, { ChangeEvent } from 'react';
import { useState } from 'react';
import { Input, Text, Box, Flex, Button, useToast } from '@chakra-ui/react';
import { BsFillInfoCircleFill } from 'react-icons/bs';
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
        onCreatePinClick();
    }

    const hootToast = useToast();

    const handleHover = () => {
        hootToast.closeAll();
        hootToast({
            title: "Pin Info",
            description: (
                <Flex
                direction={'column'}
                gap={2}
                py={'10px'}
                fontSize={'sm'}
                >
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
                </Flex>
            ),
            status: "info",
            duration: 8000,
            isClosable: true,
        });
    }
    const handleMouseLeave = () => {
        setTimeout(() => {
            hootToast.closeAll();
        }, 5000);
    }
    return (
        <Box>
            <Flex
                flexDirection={'column'}
                fontWeight={100}
                gap={6}
            >
                <Flex
                    align={'center'}
                    gap={2}
                >
                    <Text fontWeight={'bold'}>Create a digit PIN</Text>
                    <BsFillInfoCircleFill color={'black'} size={20} cursor={'pointer'}
                        onMouseEnter={handleHover}
                        onMouseLeave={handleMouseLeave}
                    />
                </Flex>
                <Input
                    type="number"
                    placeholder="Enter 4-digit PIN"
                    value={pin}
                    onChange={(e) => {
                    const re = /^[0-9\b]{0,4}$/; // regex to accept only digits and max 4
                    if (e.target.value === '' || re.test(e.target.value)) {
                        setPin(e.target.value)
                    }
                    }}
                />
                <Button
                    border={'1px solid black'}
                    background={'black'}
                    color={'white'}
                    _hover={{ background: 'white', color: 'black' }}
                    outline={'none'}
                    _active={{ outline: 'none' }}
                    onClick={() => handleCreatePin()}
                >
                    Create Pin
                </Button>
            </Flex>
        </Box>
    );
}
export default CreatePin;