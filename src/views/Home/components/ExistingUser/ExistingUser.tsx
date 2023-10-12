import React, { useState } from 'react';
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
  Grid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { IScUserInfo } from "@/utils/types/sc.interface";
import { deleteWallet } from '../../services/calls';
import { createEncryptionKey, decrypt } from '@/utils/functions/cryptography';

const theme = extendTheme({
  initialColorMode: 'light',
});

function ExistingUser({address, email, secretWords, userGid}: {address: string, email: string, secretWords: string[], userGid: string}) {
    const [isWordsVisible, setWordsVisible] = useState(false);
    const [isPinModalOpen, setPinModalOpen] = useState(false);
    const [pin, setPin] = useState('');
    const [encryptionKey, setEncryptionKey] = useState('');
    const [showError, setShowError] = useState(false);
    const [walletDeletionHash, setWalletDeletionHash] = useState('');

    const handleClickWords = () => {
        if (isWordsVisible) {
            setWordsVisible(false);
        } else {
            setPinModalOpen(true);
        }
    };

    const handlePinSubmit = () => {
        setEncryptionKey(createEncryptionKey(pin, userGid));
        setWordsVisible(true);
        setPinModalOpen(false);
    };

    const handleDeleteWallet = (email: string) => {
        deleteWallet(email)
            .then((res) => {
                setWalletDeletionHash(res?.toString() || '');
                console.log("⚠️ ~ file: ExistingUser.tsx:59 ~ .then ~ res::::", walletDeletionHash)
            })
            .catch((error) => {
                console.error(error);
                // Handle any errors that occur during the promise execution here
            });
    };

    return (
    <ChakraProvider theme={theme}>
        <CSSReset />
        <Container maxW={'800px'}>
            <Text>
                <b>Address:</b> {address}
            </Text>
            <Button
                m={5}
                onClick={handleClickWords}
                size="sm"
                colorScheme="teal"
            >
                Words
            </Button>
            {isWordsVisible && (
                <Grid templateColumns="repeat(6, 1fr)" gap={6}>
                {secretWords.map((word, index) => (
                    <Text key={index} as="span" border="1px solid black" padding="1" m={1}>
                    {decrypt(word, encryptionKey)}
                    </Text>
                ))}
                </Grid>
            )}
            <Modal isOpen={isPinModalOpen} onClose={() => setPinModalOpen(false)} isCentered>
                <ModalOverlay />
                <ModalContent
                    bg="transparent" // Set background to transparent
                    w="30%" // Set the width to 30% of the screen
                    borderWidth="2px" // Add border for visibility
                    borderColor="teal.500" // Customize the border color
                    borderRadius="15px" // Add border radius
                >
                <ModalHeader color="white">Enter PIN</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <FormControl>
                    <Input
                        type="password"
                        placeholder="Enter 4-digit PIN"
                        value={pin}
                        onChange={(e) => {
                            setPin(e.target.value)
                        }}
                    />
                    </FormControl>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="teal" onClick={handlePinSubmit}>
                    Submit
                    </Button>
                </ModalFooter>
                </ModalContent>
            </Modal>
            {showError && (
                <Alert status="error">
                <AlertIcon />
                    Incorrect PIN. Please try again.
                </Alert>
            )}
            <Button
                m={5}
                onClick={() => handleDeleteWallet(email)}
                size="sm"
                colorScheme="teal"
            >
                Delete Wallet
            </Button>
        </Container>
    </ChakraProvider>
    );
}

export default ExistingUser;
