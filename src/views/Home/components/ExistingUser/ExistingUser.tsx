import React, { useEffect, useState } from 'react';
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
  AlertIcon, Flex,
} from '@chakra-ui/react';
import { deleteWallet } from '../../services/calls';
import { createEncryptionKey, decrypt } from '@/utils/functions/cryptography';
import { Box, Button, Text, VStack, HStack, Circle, Icon, List, ListItem } from "@chakra-ui/react";
import { FaBeer, FaCoffee, FaPhabricator, FaEraser, FaDownload, FaCopy, FaExternalLinkAlt } from 'react-icons/fa';
import { addressIsValid } from '@multiversx/sdk-dapp/utils/account';


const theme = extendTheme({
  initialColorMode: 'dark',
});

function copyToClipboard(text: string) {
  if (!navigator.clipboard) {
    return;
  }

  navigator.clipboard.writeText(text)
    .then(() => {
      console.log('Text copied to clipboard');
    })
    .catch(err => {
      console.error('Unable to copy text: ', err);
    });
}

function ExistingUser({ address, email, secretWords, userGid }: { address: string, email: string, secretWords: string[], userGid: string }) {

  const [isWordsVisible, setWordsVisible] = useState(false);
  const [isPinModalOpen, setPinModalOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [encryptionKey, setEncryptionKey] = useState('');
  const [showError, setShowError] = useState(false);
  const [walletDeletionHash, setWalletDeletionHash] = useState('');
  const [balance, setBalance] = useState(null); // Added state for balance
  const [price, setPrice] = useState<number | null>(null); // Added state for price


  const handleClickWords = () => {
    if (isWordsVisible) {
      setWordsVisible(false);
    } else {
      setPinModalOpen(true);
    }
  };

  const handleCopyToClipboard = () => {
    // Copy the address to the clipboard
    copyToClipboard(address);
  };

  const handleOpenExplorer = () => {
    // Open the explorer link in a new tab
    window.open(`https://devnet-explorer.multiversx.com/accounts/${address}`, '_blank');
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

  useEffect(() => {

    // Make the API call to fetch balance
    fetch(`https://devnet-api.multiversx.com/accounts/${address}`)
      .then((response) => response.json())
      .then((data) => {
        // Update the balance state with the data from the API response
        setBalance(data.balance);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    // Make the API call to fetch the price
    fetch('https://devnet-api.multiversx.com/economics')
      .then((response) => response.json())
      .then((data) => {
        // Update the price state with the data from the API response
        setPrice(data.price);
      })
      .catch((error) => {
        console.error('Error fetching price data:', error);
      });
  }, [address]);



  let isPinCorrect = false;
  if (secretWords.length > 0) {
    const decryptedWord = decrypt(secretWords[0], encryptionKey);

    // pin correct if word is only with letters
    isPinCorrect = /^[a-z]+$/.test(decryptedWord);
  }

  useEffect(() => {
    if (pin.length == 4 && !isPinCorrect) {
      setShowError(true);
    }
    if (isPinCorrect) {
      setShowError(false);
    }
  }, [isPinCorrect, pin]);

  return (
    <Container maxW={'800px'}>
      <VStack spacing={6} p={4}>

        {/* Header */}
        <Flex>
          <Box maxW="100%">
            <Flex alignItems="center" direction={{ base: 'column', lg: 'row' }} gap={2}>
              <Flex gap={1} direction={{ base: 'column', lg: 'row' }} textAlign={'center'}>
                <Text fontWeight="bold">Wallet Address:</Text>
                <Text overflowWrap="break-word">{address.substring(0, 12)}...{address.slice(-12)}</Text>
              </Flex>
              <Flex>
                <Icon as={FaCopy} ml={2} cursor="pointer" onClick={handleCopyToClipboard} />
                <Icon as={FaExternalLinkAlt} ml={2} cursor="pointer" onClick={handleOpenExplorer} />
              </Flex>
            </Flex>
          </Box>
        </Flex>

        <Box bg="gray.800" p={10} borderRadius="md" width="100%" >
          <Flex alignItems="center" justifyContent={'space-between'} direction={{ base: 'column', lg: 'row' }}>
            <VStack alignItems="start" spacing={2}>
              <Text fontSize="lg" color="gray.400">Overview</Text>
              <Text fontSize="2xl" color="white">  {balance === null ? "Loading..." : balance === 0 ? "0 EGLD" : `${balance / Math.pow(10, 18)} EGLD`}</Text>
              <Flex justifyContent="space-between">
                <Text fontSize="md" color="gray.400">{balance === null || price === null ? 'Calculating...' : `$${((balance / Math.pow(10, 18)) * price).toFixed(2)} USD`}</Text>
              </Flex>
            </VStack>

            <Flex direction={{ base: 'column', lg: 'row' }} gap = {{ base: 16, lg: 10 }} mt= {{ base: 10, lg: 0 }}>
              <Button
                bg="transparent"
                p={0}
                _hover={{ bg: "transparent" }}
                _active={{ bg: "transparent" }}
                _focus={{ boxShadow: "none" }}
                onClick={handleClickWords}
                isDisabled={true}  // Disabling the button
              >
                <VStack spacing={1}>
                  <Circle size="50px" bg="blue.500" color="white">
                    <Icon as={FaDownload} w="24px" h="24px" />
                  </Circle>
                  <Text style={{ color: 'white', display: 'inline-block', fontSize: 'small' }}>Download JSON</Text>
                </VStack>
              </Button>
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
                  <Text style={{ color: 'white', display: 'inline-block', fontSize: 'small' }}>Seed Phrase</Text>
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
                  <Text style={{ color: 'white', display: 'inline-block', fontSize: 'small' }}>Delete Wallet</Text>
                </VStack>
              </Button>
            </Flex>
          </Flex>
        </Box>

        {/* Rest of your code */}
      </VStack>

      {isWordsVisible && !showError && (
        <Grid templateColumns={{base: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)'}}>
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
          bg="transparent"
          w="90%"
          borderWidth="2px"
          borderColor="teal.500"
          borderRadius="15px"
          style={{
            backgroundImage: "linear-gradient(45deg, #85FFBD 0%, #586f2d 100%)",
          }}
        >
          <ModalHeader color="white">Enter PIN</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
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
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="teal" onClick={handlePinSubmit}>
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {showError && encryptionKey != '' && (
        <Alert status="error">
          <AlertIcon />
          Incorrect PIN. Please try again.
        </Alert>
      )}

    </Container>
  );
}

export default ExistingUser;
function setPrice(price: any) {
  throw new Error('Function not implemented.');
}

