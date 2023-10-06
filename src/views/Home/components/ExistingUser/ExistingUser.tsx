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
    Grid,
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
        <Container maxW={'800px'}>
            <Text>
                <b>Username:</b> {userInfo.username}
            </Text>
            <Text>
                <b>Address:</b> {userInfo.address}
            </Text>
            <Text>
                <b>Words:</b>
            </Text>
            <Grid templateColumns="repeat(6, 1fr)" gap={6}>
                {userInfo.secretWords.map((word, index) => (
                    <Text key={index} as="span" border="1px solid black" padding="1" m={1}>
                        {word}
                    </Text>
                ))}
            </Grid>
        </Container>
        </ChakraProvider>
    );
}

export default ExistingUser;