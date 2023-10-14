import {
  Modal,
  ModalContent,
  ModalContentProps,
  ModalOverlayProps,
  ModalOverlay
} from "@chakra-ui/react";
import { PropsWithChildren } from "react";

interface IProps extends ModalContentProps {
  isOpen: boolean;
  isCentered?: boolean;
  onClose: () => void;
  size?: string;
  overlayProps?: ModalOverlayProps;
}

const MyModal = ({
  isOpen,
  onClose,
  children,
  size,
  overlayProps,
  isCentered = true,
  ...props
}: PropsWithChildren<IProps>) => {
  return (
    <>
      <Modal
        isCentered={isCentered}
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
        size={size}
      >
        <ModalOverlay background={"rgba(0,0,0,0.7)"} {...overlayProps} />
        <ModalContent
          background={"black.light"}
          borderRadius="15px"
          width={"90%"}
          {...props}
        >
          {children}
        </ModalContent>
      </Modal>
    </>
  );
};

export default MyModal;
