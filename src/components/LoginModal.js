import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useGlobal } from './GlobalState';
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
    const { isLoggedIn, setIsLoggedIn } = useGlobal();

    useEffect(() => {
        const checkLoginStatus = () => {
            const loginTime = parseInt(localStorage.getItem('loginTime'), 10);
            const currentTime = new Date().getTime();

            if (currentTime - loginTime > 5000) { // 3분(180,000ms) 이상 경과한 경우
                localStorage.removeItem('token');
                localStorage.removeItem('refresh');
                localStorage.removeItem('loginTime');
                setIsLoggedIn(false);
                window.location.reload(); // 페이지 새로고침
            }
        };

        checkLoginStatus();
        const intervalId = setInterval(checkLoginStatus, 3000);
        return () => clearInterval(intervalId);
    }, [isLoggedIn]);

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
                const { access, refresh } = response.data;
                console.log('Server Response:', response.data);
                console.log('Access Token:', access);
                console.log('Refresh Token:', refresh);

                localStorage.setItem('token', access);
                localStorage.setItem('refresh', refresh);
                localStorage.setItem('loginTime', new Date().getTime());
                onLogin(access);
                onClose();
                setIsLoggedIn(true);
            } else {
                setError(response.data.message || 'Failed to log in');
            }

        } catch (error) {
            console.error('Error during login:', error);
            setError(error.response?.data?.message || 'An unexpected error occurred');
        }
    };

    return (
        <>
            <Button colorScheme='teal' bgColor="#9747FF" onClick={onOpen}>Log in</Button>

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
