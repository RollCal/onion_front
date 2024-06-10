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
    AlertIcon,
    Spinner
} from '@chakra-ui/react';


function SignUpModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    // 성별 선택 상태 추가
    const [selectedGender, setSelectedGender] = useState('');
    const [birth, setBirth] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [emailSent, setEmailSent] = useState(false);
    const [loading, setLoading] = useState(false);


    const handleRegister = async () => {
        try {
            const response = await axios.post('/api/accounts/signup/', {
                username,
                password,
                password2,
                email,
                nickname,
                gender: selectedGender, // 선택된 성별 값 전달
                birth,
                confirm
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.status === 201) {
                setSuccess('Registration successful!');
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

    const handleSendConfirmEmail = async () => {
        setLoading(true);
        try {
            const response = await axios.post('/api/accounts/confirm/', {
                email
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            setLoading(false);
            if (response.status === 200) {
                setEmailSent(true);
                setError();
                setSuccess(`${email}로 인증 메일이 전송되었습니다.`);
            }
        } catch (error) {
            setLoading(false);
            setSuccess();
            if (error.response.status === 400) {
                setError(error.response.data.error);
            }else {
                setError(error.message)
            }
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
                            <Button mt={2} colorScheme="blue" onClick={handleSendConfirmEmail} isDisabled={emailSent}>
                                {loading ? (<>Send Confirmation Email <Spinner marginLeft={3} /></>) : 'Send Confirmation Email'}
                            </Button>
                        </FormControl>
                        <FormControl id="confirm" mt={4} isDisabled={!emailSent}>
                            <FormLabel>Confirmation Code</FormLabel>
                            <Input type="text" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
                        </FormControl>
                        <FormControl id="nickname" mt={4}>
                            <FormLabel>Nickname</FormLabel>
                            <Input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
                        </FormControl>
                        <FormControl id="gender" mt={4}>
                            <FormLabel>Gender</FormLabel>
                            <Button colorScheme={selectedGender === 'M'? 'blue' : 'gray'} onClick={() => setSelectedGender('M')} isDisabled={selectedGender === 'M'}>
                                M
                            </Button>
                            <Button colorScheme={selectedGender === 'F'? 'blue' : 'gray'} onClick={() => setSelectedGender('F')} isDisabled={selectedGender === 'F'}>
                                F
                            </Button>
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
                        <Button colorScheme="blue" mr={3} onClick={handleRegister} isDisabled={!emailSent}>
                            Sign up
                        </Button>
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default SignUpModal;
