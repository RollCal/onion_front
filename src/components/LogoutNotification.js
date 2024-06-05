import React, { useEffect } from 'react';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    ModalFooter,
    Button,
    useDisclosure,
    Alert,
    AlertIcon,
    Box
} from '@chakra-ui/react';

const LogoutNotificationModal = ({ onClose }) => {
    const { isOpen, onOpen, onClose: onModalClose } = useDisclosure({ isOpen: true });

    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onModalClose();
                window.location.reload(); // 페이지 새로고침
            }, 3000); // 3초 후에 모달 닫기 및 페이지 새로고침
            return () => clearTimeout(timer);
        }
    }, [isOpen, onModalClose]);

    useEffect(() => {
        onOpen();
    }, [onOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onModalClose}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>장시간 자리를 비워 자동으로 로그아웃되었습니다.</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box textAlign="center">
                        <Alert status="warning" mb={4}>
                            <AlertIcon />
                            장시간 자리를 비워두어 자동으로 로그아웃되었습니다. 다시 로그인해주세요.
                        </Alert>
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={() => window.location.reload()}>
                        로그인 페이지로 돌아가기
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default LogoutNotificationModal;
