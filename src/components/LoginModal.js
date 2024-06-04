import React, { useState } from 'react';
import axios from 'axios';
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    FormControl,
    FormLabel,
    Input,
    Alert,
    AlertIcon
} from '@chakra-ui/react';

function LoginModal({ onLogin }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/accounts/login/', {
                username,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                const { access, refresh } = response.data; // 속성 이름 변경
                console.log('Server Response:', response.data);
                console.log('Access Token:', access); // 이제 access 토큰 출력
                console.log('Refresh Token:', refresh); // 이제 refresh 토큰 출력

                // 로그인 성공, 토큰 저장
                localStorage.setItem('token', access); // access 토큰 저장
                localStorage.setItem('refresh', refresh); // refresh 토큰 저장
                onLogin(access); // access 토큰 전달
                onClose();
            } else {
                // 로그인 실패
                setError(response.data.message || 'Failed to log in');
            }


        } catch (error) {
            console.error('Error during login:', error);
            setError(error.response?.data?.message || 'An unexpected error occurred');
        }
    };

    return (
        <>
            <Button colorScheme='purple' onClick={onOpen}>Log in</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Log in</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {error && (
                            <Alert status="error" mb={4}>
                                <AlertIcon />
                                {error}
                            </Alert>
                        )}
                        <FormControl id="username">
                            <FormLabel>Username</FormLabel>
                            <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </FormControl>
                        <FormControl id="password" mt={4}>
                            <FormLabel>Password</FormLabel>
                            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleLogin}>
                            Log in
                        </Button>
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default LoginModal;
