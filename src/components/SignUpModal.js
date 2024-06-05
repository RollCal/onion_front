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

function RegisterModal({ onRegister }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [gender, setGender] = useState('');
    const [birth, setBirth] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/accounts/signup/', {
                username,
                password,
                password2,
                email,
                nickname,
                gender,
                birth
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 201) {
                setSuccess('Registration successful!');
                onRegister();
                onClose();
            } else {
                setError(response.data.message || 'Failed to register');
            }
        } catch (error) {
            console.error('Error during registration:', error);
            const errorMessage = error.response?.data || 'An unexpected error occurred';
            setError(JSON.stringify(errorMessage));
        }
    };

    return (
        <>
            <Button colorScheme='orange' bgColor="#F24822" onClick={onOpen}>Sign up</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Sign up</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        {error && (
                            <Alert status="error" mb={4}>
                                <AlertIcon />
                                {error}
                            </Alert>
                        )}
                        {success && (
                            <Alert status="success" mb={4}>
                                <AlertIcon />
                                {success}
                            </Alert>
                        )}
                        <FormControl id="username">
                            <FormLabel>Username</FormLabel>
                            <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                        </FormControl>
                        <FormControl id="email" mt={4}>
                            <FormLabel>Email</FormLabel>
                            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                        </FormControl>
                        <FormControl id="nickname" mt={4}>
                            <FormLabel>Nickname</FormLabel>
                            <Input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                        </FormControl>
                        <FormControl id="gender" mt={4}>
                            <FormLabel>Gender</FormLabel>
                            <Input type="text" value={gender} onChange={(e) => setGender(e.target.value)} />
                        </FormControl>
                        <FormControl id="birth" mt={4}>
                            <FormLabel>Birth</FormLabel>
                            <Input type="date" value={birth} onChange={(e) => setBirth(e.target.value)} />
                        </FormControl>
                        <FormControl id="password" mt={4}>
                            <FormLabel>Password</FormLabel>
                            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                        </FormControl>
                        <FormControl id="password2" mt={4}>
                            <FormLabel>Confirm Password</FormLabel>
                            <Input type="password" value={password2} onChange={(e) => setPassword2(e.target.value)} />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleRegister}>
                            Sign up
                        </Button>
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default RegisterModal;
