import React, {useEffect, useState} from 'react';
import axios from "axios";
import {useParams} from "react-router";
import OnionFlow from "./OnionFlow";
import CreateOnion from "./CreateOnion";
import {
    Accordion,
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box, Button, Input, InputGroup,
    InputRightElement
} from "@chakra-ui/react";
import {FaLongArrowAltRight} from "react-icons/fa";

function Onions(props) {

    const param = useParams();

    const [onionList, setOnionList] = useState([]);

    async function getVersusList(onion_id) {
        try {
            const response = await axios.get(`/api/onions/${onion_id}`);
            console.log(response.data.children);
            return response.data.children;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    const createOnionReply = (onion_id) => {
        // 로컬스토리지에서 토큰 가져오기
        // const token = localStorage.getItem("token");
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE3NDE5NjA5LCJpYXQiOjE3MTc0MDg4MDksImp0aSI6ImNiNGMyNGNlOTk5NzQzMTBhODJhZmQ1NjRjMDlkZmMyIiwidXNlcl9pZCI6MX0.gGD4GtgyN1hD4pW_w8G7pWkM7oWLR9SQOmRmh_8HuFc";
        // 헤더에 넣기
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };
        axios.post(`/api/onions/${onion_id}`, {
            title: document.getElementById(`onion_title_${onion_id}`).value,
            color: document.getElementById(`onion_color_${onion_id}`).value
        }, config)
            .then(function (response) {
                // 부모노드에서 함수 가져오기
                setOnionList([...onionList, response.data]);
                // 입력값 초기화
                document.getElementById(`onion_title_${onion_id}`).value="";
                document.getElementById(`onion_color_${onion_id}`).selectedIndex = 0;
            })
            .catch(function (error) {
                console.log(error);
                // api에서 가져온 데이터로 에러 메세지 생성
                alert(`[Error]\nMessage : ${error.message}\nDetail : ${error.response.data.detail}`);
            });
    }

    const GetComments = ({comment, depth = 0},) => {
        return (
            <div>
                <Accordion allowToggle>
                    <AccordionItem>
                        <h2>
                            <AccordionButton>
                                <Box as='span' flex='1' textAlign='left' style={{marginLeft: depth * 20}}>
                                    {comment.title}
                                </Box>
                                <AccordionIcon/>
                            </AccordionButton>
                        </h2>
                        <AccordionPanel pb={4}>
                            <InputGroup>
                                <InputRightElement width='150px'>
                                    <select id={`onion_color_${comment.id}`}>
                                        <option value={"Orange"}>Orange</option>
                                        <option value={"Purple"}>Purple</option>
                                    </select>
                                    <Button rightIcon={<FaLongArrowAltRight/>}
                                            colorScheme='orange' bgColor="#F24822"
                                            onClick={() => createOnionReply(comment.id)}>
                                        등록
                                    </Button>
                                </InputRightElement>
                                <Input placeholder='댓글' maxLength="30" id={`onion_title_${comment.id}`}/>
                            </InputGroup>
                        </AccordionPanel>
                    </AccordionItem>
                </Accordion>
                {comment.children && comment.children.map(childComment =>
                    <GetComments key={childComment.id} comment={childComment} depth={depth + 1}/>
                )}
            </div>
        )
    }

    const setOnionListFunction = (data) => {
        setOnionList([...onionList, data]);
    }

    useEffect(() => {
        getVersusList(param.onion_id).then((data => setOnionList(data)));
    }, [param]); // 목록에있는 데이터들이 변경 될때마나 리랜더링, 공백일때는 무조건 한번 랜더링


    return (
        <div>
            <OnionFlow onion_id={param.onion_id} key={param.onion_id}/>
            <div>
                댓글
                <hr/>
                {onionList.map(comment =>
                    <GetComments key={comment.id} comment={comment}/>
                )}
            </div>
            <CreateOnion onion_id={param.onion_id} setOnionList={setOnionListFunction}/>
        </div>
    );
}

export default Onions;