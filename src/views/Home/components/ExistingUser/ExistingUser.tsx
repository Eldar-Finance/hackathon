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
import { IScUserInfo } from "@/utils/types/sc.interface";
  
// Define custom Chakra UI theme to control transitions
const theme = extendTheme({
    initialColorMode: 'light',
});

function ExistingUser(userInfo: IScUserInfo) {

    return (
        <ChakraProvider theme={theme}>
        <CSSReset />
        <Container>
            <Text>
                <b>Username:</b> {userInfo.username}
            </Text>
            <Text>
                <b>Address:</b> {userInfo.address}
            </Text>
            <Text>
                <b>Words:</b>
            </Text>
            <Box>
                {userInfo.secretWords.map((word, index) => (
                    <Text key={index}>{word}</Text>
                ))}
            </Box>
        </Container>
        </ChakraProvider>
    );
}

export default ExistingUser;