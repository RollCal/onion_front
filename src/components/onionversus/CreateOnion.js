import React from 'react';
import {Button, Input, InputGroup, InputRightElement} from "@chakra-ui/react";
import {FaLongArrowAltRight} from "react-icons/fa";
import axios from "axios";

function CreateOnion(props) {
    const OnionCreateButtonHandler = () => {
        // 로컬스토리지에서 토큰 가져오기
        // const token = localStorage.getItem("token");
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE3NDkxNDY3LCJpYXQiOjE3MTc0ODA2NjcsImp0aSI6IjcwNzJkMWQ5ZWZjYTQxNGE4M2E2MDRlMWIzZjRjODExIiwidXNlcl9pZCI6MX0.Y0ECI02wkecnb_Kp0Fna1xusgGo9otbM2LQJ7fZ_GXU";
        // 헤더에 넣기
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
                props.setOnionList(preOnionList => [...preOnionList, response.data]);
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