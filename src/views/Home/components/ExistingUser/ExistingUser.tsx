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
  AlertIcon,Flex,
} from '@chakra-ui/react';
import { deleteWallet } from '../../services/calls';
import { createEncryptionKey, decrypt } from '@/utils/functions/cryptography';
import { Box, Button, Text, VStack, HStack, Circle, Icon, List, ListItem } from "@chakra-ui/react";
import { FaBeer, FaCoffee, FaPhabricator,FaEraser,FaDownload,FaCopy, FaExternalLinkAlt } from 'react-icons/fa';
import ClipboardJS from 'clipboard';


const theme = extendTheme({
  initialColorMode: 'dark',
});
function copyToClipboard(text: string) { // Specify the type of the 'text' parameter
  // Create a temporary textarea element
  const textarea = document.createElement('textarea');
  textarea.value = text;

  // Make the textarea invisible
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';

  // Append the textarea to the DOM
  document.body.appendChild(textarea);

  // Select and copy the text in the textarea
  textarea.select();
  document.execCommand('copy');

  // Remove the temporary textarea
  document.body.removeChild(textarea);
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
    fetch(`https://api.multiversx.com/accounts/${address}`)
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



  

  return (
    <Container maxW={'800px'}>
      <VStack spacing={6} p={4}>

        {/* Header */}
        <HStack width="100%" justifyContent="space-between">
          <Text>
            <b> Wallet Address:</b>
            <input id="address-to-copy" type="text" value={address} style={{ display: 'none' }} />
            {address}
            <Icon as={FaCopy} ml={2} cursor="pointer" onClick={handleCopyToClipboard} />
            <Icon as={FaExternalLinkAlt} ml={2} cursor="pointer" onClick={handleOpenExplorer} />
          </Text>
        </HStack>

        <Box bg="gray.800" p={6} borderRadius="md" width="100%">
          <Flex justifyContent="space-between" alignItems="center">
            <VStack alignItems="start" spacing={2}>
              <Text fontSize="lg" color="gray.400">Overview</Text>
              <Text fontSize="2xl" color="white">  {balance === null ? "Loading..." : balance === 0 ? "0 EGLD" : `${balance / Math.pow(10, 18)} EGLD`}</Text>
              <HStack justifyContent="space-between">
                <Text fontSize="md" color="gray.400">{balance === null || price === null ? 'Calculating...' : `$${((balance/ Math.pow(10, 18)) * price).toFixed(2)} USD`}</Text>
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
            </HStack>
          </Flex>
        </Box>

        {/* Rest of your code */}
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
          style={{
            backgroundImage: "linear-gradient(45deg, #85FFBD 0%, #586f2d 100%)",
          }}
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
function setPrice(price: any) {
  throw new Error('Function not implemented.');
}

