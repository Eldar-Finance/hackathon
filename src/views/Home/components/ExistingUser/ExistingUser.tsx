import React, { useState } from 'react';
import {
  ChakraProvider,
  Container,
  FormControl,
  Input,
  Stack,
  extendTheme,
  CSSReset,
  Grid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Alert,
  AlertIcon,Flex,
} from '@chakra-ui/react';
import { IScUserInfo } from "@/utils/types/sc.interface";
import { deleteWallet } from '../../services/calls';
import { createEncryptionKey, decrypt } from '@/utils/functions/cryptography';
import { Box, Button, Text, VStack, HStack, Circle, Icon, List, ListItem } from "@chakra-ui/react";
import { FaBeer, FaCoffee, FaPhabricator,FaEraser } from 'react-icons/fa';


const theme = extendTheme({
  initialColorMode: 'dark',
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
        <Container maxW={'800px'} backgroundColor={'#121212'}>
        <VStack spacing={6} p={4}>

{/* Header */}
<HStack width="100%" justifyContent="space-between">
  
<Text>
                <b> Wallet Address:</b> {address}
            </Text>
  <Button variant="link">Exit wallet</Button>
</HStack>

<Box bg="gray.800" p={6} borderRadius="md" width="100%">
      <Flex justifyContent="space-between" alignItems="center">
        <VStack alignItems="start" spacing={2}>
          <Text fontSize="lg" color="gray.400">Overview</Text>
          <Text fontSize="2xl" color="white">134.23 EGLD</Text>
          <HStack justifyContent="space-between">
            <Text fontSize="md" color="gray.400">$835.39 USD</Text>
            {/* Add other details like percentage change here */}
          </HStack>
        </VStack>

        <HStack spacing={4}>
          <Button
            bg="transparent"
            p={0}
            _hover={{ bg: "transparent" }}
            _active={{ bg: "transparent" }}
            _focus={{ boxShadow: "none" }}
            onClick={handleClickWords}
          >
            <VStack spacing={1}>    
              <Circle size="50px" bg="blue.500" color="white">
                <Icon as={FaPhabricator} w="24px" h="24px" />
              </Circle>
              <Text fontSize="sm">Seed Phrase</Text>
            </VStack>
          </Button>
          <Button
            bg="transparent"
            p={0}
            _hover={{ bg: "transparent" }}
            _active={{ bg: "transparent" }}
            _focus={{ boxShadow: "none" }}
            onClick={() => handleDeleteWallet(email)}
          >
            <VStack spacing={1}>    
              <Circle size="50px" bg="blue.500" color="white">
                <Icon as={FaEraser} w="24px" h="24px" />
              </Circle>
              <Text fontSize="sm">Delete Wallet</Text>
            </VStack>
          </Button>

        </HStack>
      </Flex>
    </Box>

{/* Light Component */}
<Box bg="gray.100" p={6} borderRadius="md" width="100%">
  <Text fontSize="lg" color="gray.800">Recent transactions</Text>
  <List spacing={4} mt={4}>
  <ListItem>
    <Box display="flex" alignItems="center">
        <VStack align="start">
            <Text fontSize="sm" color="gray.600">Received from erd1u66v59...</Text>
            <Text fontSize="sm" color="gray.600">March 27th 2020, 3:39 PM</Text>
        </VStack>
        <Text fontSize="md" color="green.500" ml="auto">+100.20 ERD</Text>
    </Box>
</ListItem>

  </List>
</Box>

</VStack>
            
            
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

        </Container>
    );
}

export default ExistingUser;
