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
import NewUserForm from "../NewUserForm/NewUserForm";

export default function CreateWalletModal({ onClick, email, userGid, setClickedSubmit } : { onClick: () => void, email: string, userGid: string, setClickedSubmit: (clickedSubmit: boolean) => void }) {

    const [clickedSubmit, setClickedSubmit2] = useState(false);

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
            alignItems="center"
        >
            <ModalCloseButton />
            <ModalBody
            width={{ base: "100%", md: "80%", lg: "80%" }}
            >
                <NewUserForm email={email} userGid={userGid} setClickedSubmit={setClickedSubmit2} />
            </ModalBody>
        </MyModal>
    );
}

