/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from 'react';
import {
    Box,
    Flex,
    Text,
    ModalBody,
    ModalCloseButton,
    Center,
    Grid,
    VStack,
} from '@chakra-ui/react';
import MyModal from "@/components/Modal/Modal";
import ExistingUser from "../ExistingUser/ExistingUser";

export default function ExistingUserModal({ onClick, email, address, secretWords, sub } : 
    { onClick: () => void, email: string, address: string, secretWords: string[], sub: string}) {

    return (
        <MyModal
            isOpen={true}
            onClose={onClick}
            size={"6xl"}
            overlayProps={{
                backdropFilter: "blur(6px)",
                background: "transparent",
            }}
            background={"white"}
            borderRadius={"20px"}
            py={25}
            isCentered={true}
            justifyItems="center"
            alignItems="center"
        >
            <ModalCloseButton />
            <ModalBody>
                <Text>
                    <ExistingUser email={email} address={address || ""} secretWords={secretWords || []} userGid={sub}/>
                </Text>
            </ModalBody>
        </MyModal>
    );
}

