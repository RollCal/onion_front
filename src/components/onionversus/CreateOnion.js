import React from 'react';
import {Button, Input, InputGroup, InputRightElement} from "@chakra-ui/react";
import {FaLongArrowAltRight} from "react-icons/fa";
import axios from "axios";

function CreateOnion(props) {
    const OnionCreateButtonHandler = () => {


        // 테스트용###################3

        const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE3NDA4NzkzLCJpYXQiOjE3MTczOTc5OTMsImp0aSI6IjZjOTIzNWI1YmFhZTQzYTc4ODgwOTA5ZWEwNGU5OGM4IiwidXNlcl9pZCI6MX0.sHGwk2xBb415N5FSqbGx_IIBlNaWlBurE9vl1vOqJqg';

        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        // 테스트용###################3


        axios.post(`/api/onions/${props.onion_id}`, {
            title: document.getElementById("onion_title").value,
            color: document.getElementById("onion_color").value
        }, config)
            .then(function (response) {
                // 부모노드에서 함수 가져오기
                props.setOnionList(response.data);
                // 입력값 초기화
                document.getElementById("onion_title").value="";
                document.getElementById("onion_color").selectedIndex = 0;
            })
            .catch(function (error) {
                console.log(error);
                // api에서 가져온 데이터로 에러 메세지 생성
                alert(`[Error]\nMessage : ${error.message}\nDetail : ${error.response.data.detail}`);
            });
    }

    return (
        <>
            <InputGroup>
                <InputRightElement width='150px'>
                    <select id="onion_color">
                        <option value={"Orange"}>Orange</option>
                        <option value={"Purple"}>Purple</option>
                    </select>
                    <Button rightIcon={<FaLongArrowAltRight/>}
                            colorScheme='orange' bgColor="#F24822" onClick={OnionCreateButtonHandler}>
                        등록
                    </Button>
                </InputRightElement>
                <Input placeholder='댓글' maxLength="30" id="onion_title"/>
            </InputGroup>
        </>
    );
}

export default CreateOnion;