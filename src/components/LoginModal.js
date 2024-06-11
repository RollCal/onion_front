import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { GlobalContext } from './GlobalState'
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

function LoginModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { Login } = useContext(GlobalContext);


    const handleLogin = async () => {
        try {
            if (!document.getElementById("user_id").value) {
                setError("유저네임을 입력해주세요.");
                return;
            }
            if (!document.getElementById("user_pw").value) {
                setError("비밀번호를 입력해주세요.");
                return;
            }
            const response = await axios.post('/api/accounts/login/', {
                username,
                password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 200) {
                const { access, refresh } = response.data;

                localStorage.setItem('username', username);
                localStorage.setItem('token', access);
                localStorage.setItem('refresh', refresh);
                localStorage.setItem('loginTime', new Date().getTime());
                onClose();
                Login(true);
            }
        } catch (error) {
            if (400 <= error.response.status && error.response.status < 500){
                setError('유저네임 혹은 비밀번호가 존재하지 않습니다.');
                return;
            }
        }
    };

    return (
        <>
            <Button colorScheme='purple' onClick={onOpen}>로그인</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>로그인</ModalHeader>
                    <ModalCloseButton />
                    <form onSubmit={(e) => { e.preventDefault(); handleLogin(); onClose(); }}>
                        <ModalBody>
                            {error && (
                                <Alert status="error" mb={4}>
                                    <AlertIcon />
                                    {error}
                                </Alert>
                            )}
                            <FormControl id="username">
                                <FormLabel>Username</FormLabel>
                                <Input id="user_id" type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                            </FormControl>
                            <FormControl id="password" mt={4}>
                                <FormLabel>Password</FormLabel>
                                <Input id="user_pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </FormControl>
                        </ModalBody>

                        <ModalFooter>
                            <Button type="submit" colorScheme="blue" mr={3}>
                                Log in
                            </Button>
                            <Button variant="ghost" onClick={onClose}>Cancel</Button>
                        </ModalFooter>
                    </form>
                </ModalContent>
            </Modal>
        </>
    );
}

export default LoginModal;
