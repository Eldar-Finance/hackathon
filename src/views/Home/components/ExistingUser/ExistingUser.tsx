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

const theme = extendTheme({
  initialColorMode: 'light',
});

function ExistingUser(userInfo: IScUserInfo) {
  const [isWordsVisible, setWordsVisible] = useState(false);
  const [isPinModalOpen, setPinModalOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [showError, setShowError] = useState(false);
  const correctPin = '1234';

  const toggleWordsVisibility = () => {
    if (pin === correctPin) {
      setWordsVisible(!isWordsVisible);
      setShowError(false); // Reset error state
    } else {
      setPinModalOpen(true);
    }
  };

  const handlePinSubmit = () => {
    if (pin === correctPin) {
      setWordsVisible(true);
      setPinModalOpen(false);
      setShowError(false); // Reset error state
    } else {
      setShowError(true);
      setPin('');
      setPinModalOpen(false); // Close the modal when PIN is incorrect
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <CSSReset />
      <Container maxW={'800px'}>
        <Text>
          <b>Username:</b> {userInfo.username}
        </Text>
        <Text>
          <b>Address:</b> {userInfo.address}
        </Text>
        <Button
  onClick={toggleWordsVisibility}
  size="sm"
  colorScheme="teal"
>
  Words
</Button>

        {isWordsVisible && (
          <Grid templateColumns="repeat(6, 1fr)" gap={6}>
            {userInfo.secretWords.map((word, index) => (
              <Text key={index} as="span" border="1px solid black" padding="1" m={1}>
                {word}
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
          onChange={(e) => setPin(e.target.value)}
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
    </ChakraProvider>
  );
}

export default ExistingUser;
