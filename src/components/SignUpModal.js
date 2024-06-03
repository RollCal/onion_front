import React, { useState } from 'react';
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
    RadioGroup,
    Radio,
    Stack,
    useToast
} from '@chakra-ui/react';
import axios from 'axios';

function SignUpModal() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        nickname: '',
        gender: '',
        birth: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleGenderChange = (value) => {
        setFormData(prevState => ({
            ...prevState,
            gender: value
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:8000/api/accounts/signup/', formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (response.status === 201) {
                toast({
                    title: "Account created.",
                    description: "Your account has been created successfully.",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });
                onClose();
            }
        } catch (error) {
            toast({
                title: "An error occurred.",
                description: "Unable to create account.",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        }
    };

    return (
        <>
            <Button colorScheme='teal' bgColor="#F24822" onClick={onOpen}>Sign Up</Button>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Sign Up</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl id="username" mb={4}>
                            <FormLabel>Username</FormLabel>
                            <Input type="text" name="username" value={formData.username} onChange={handleChange} />
                        </FormControl>
                        <FormControl id="password" mb={4}>
                            <FormLabel>Password</FormLabel>
                            <Input type="password" name="password" value={formData.password} onChange={handleChange} />
                        </FormControl>
                        <FormControl id="confirmPassword" mb={4}>
                            <FormLabel>Confirm Password</FormLabel>
                            <Input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
                        </FormControl>
                        <FormControl id="email" mb={4}>
                            <FormLabel>Email</FormLabel>
                            <Input type="email" name="email" value={formData.email} onChange={handleChange} />
                        </FormControl>
                        <FormControl id="nickname" mb={4}>
                            <FormLabel>Nickname</FormLabel>
                            <Input type="text" name="nickname" value={formData.nickname} onChange={handleChange} />
                        </FormControl>
                        <FormControl id="gender" mb={4}>
                            <FormLabel>Gender</FormLabel>
                            <RadioGroup name="gender" value={formData.gender} onChange={handleGenderChange}>
                                <Stack direction="row">
                                    <Radio value="M">Male</Radio>
                                    <Radio value="F">Female</Radio>
                                </Stack>
                            </RadioGroup>
                        </FormControl>
                        <FormControl id="birth" mb={4}>
                            <FormLabel>Birth Date</FormLabel>
                            <Input type="date" name="birth" value={formData.birth} onChange={handleChange} />
                        </FormControl>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                            Sign Up
                        </Button>
                        <Button variant="ghost" onClick={onClose}>Cancel</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default SignUpModal;
