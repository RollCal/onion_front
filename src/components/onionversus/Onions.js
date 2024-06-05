import React, {useCallback, useEffect, useState} from 'react';
import axios from "axios";
import {useParams} from "react-router";
import OnionFlow from "./OnionFlow";
import CreateOnion from "./CreateOnion";
import {Link} from "react-router-dom";
import {Box, Button, Flex, Grid, GridItem, Text, Tooltip} from "@chakra-ui/react";
import {FaArrowUp, FaArrowDown} from "react-icons/fa";

function Onions(props) {

    const param = useParams();

    const [onionList, setOnionList] = useState([]);
    const [onion, setOnion] = useState();
    const [onion_tiele, setOnion_title] = useState();
    const [onion_color, setOnion_color] = useState();

    // 댓글 목록 불러오기
    async function getVersusComment(onion_id) {
        try {

            // 로컬스토리지에서 토큰 가져오기
            const token = localStorage.getItem("token");
            // 헤더에 넣기
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };

            // 댓글 등록 대상 업데이트
            setOnion(onion_id);
            const response = await axios.get(`/api/onions/${onion_id}`,config);
            console.log(response.data);
            setOnion_title(response.data.title);
            setOnion_color(response.data.color);
            // 댓글 목록 리턴
            return response.data.children;
        } catch (error) {
            return [];
        }
    }

    // 댓글 렌더링
    const GetComments = ({comment, depth = 0},) => {
        return (
            <div style={{margin: "10px"}}>
                <h2><Link to={`/onion/${comment.id}`}>{comment.title}</Link></h2>
            </div>
        )
    }

    useEffect(() => {
        // 처음 렌더링시 route에서 가져온 id 로 댓글 목록 불러오기
        getVersusComment(param.onion_id).then((data => setOnionList(data)));
    }, [param.onion_id]); // 목록에있는 데이터들이 변경 될때마나 리랜더링, 공백일때는 무조건 한번 랜더링


    const upVoteButtonHandler = (onion_id, type) => {
        // 로컬스토리지에서 토큰 가져오기
        const token = localStorage.getItem("token");
        // 헤더에 넣기
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        };

        axios.post("/api/votes/", {
            onion_id,
            type
        }, config)
            .then(function (response) {
                if (response.status === 200) {
                    alert("정상적으로 투표하였습니다.");
                } else {
                    alert("투표가 취소되었습니다.");
                }
            })
            .catch(function () {
                alert("로그인이 필요합니다!");
            });
    }


    return (
        <div>
            {/*다이어 그램 생성*/}
            {/*getVersusComment는 노드 클릭시 해당 노드의 댓글을 가져오기 위해 사용*/}
            {/*setOnionList는 댓글 목록 리렌더링 하기위해 사용*/}
            <OnionFlow onion_id={param.onion_id} key={param.onion_id} getVersusComment={getVersusComment}
                       setOnionList={setOnionList}/>
            <Box>
                <Box p={5}>
                    <Flex gap={2}>
                        <Tooltip label='UP VOTE'>
                            <Button color={onion_color === "Orange" ? "#F24822" : "#9747FF"} border='2px'
                                    borderColor={onion_color === "Orange" ? "#F24822" : "#9747FF"} size='md'
                                    bgColor="white" onClick={() => {
                                upVoteButtonHandler(onion, "Up")
                            }}>
                                {onion_tiele}
                                <FaArrowUp/>
                            </Button>
                        </Tooltip>
                        <Tooltip label='DOWN VOTE'>
                            <Button color={onion_color === "Orange" ? "#F24822" : "#9747FF"} border='2px'
                                    borderColor={onion_color === "Orange" ? "#F24822" : "#9747FF"} size='md'
                                    bgColor="white" onClick={() => {
                                upVoteButtonHandler(onion, "Down")
                            }}>
                                {onion_tiele}
                                <FaArrowDown/>
                            </Button>
                        </Tooltip>
                    </Flex>
                </Box>
                <Box>
                    댓글
                    <hr/>
                    {onionList.map(comment =>
                        <Flex key={comment.id} gap={1}>
                            <GetComments comment={comment}/>
                            <Tooltip label='UP VOTE'>
                                <Button border='2px' size='xs' bgColor="white" marginTop="10px"
                                        onClick={() => {
                                            upVoteButtonHandler(comment.id, "Up")
                                        }}>
                                    <FaArrowUp/>
                                </Button>
                            </Tooltip>
                            <Tooltip label='DOWN VOTE'>
                                <Button border='2px' size='xs' bgColor="white" marginTop="10px"
                                        onClick={() => {
                                            upVoteButtonHandler(comment.id, "Down")
                                        }}>
                                    <FaArrowDown/>
                                </Button>
                            </Tooltip>
                        </Flex>
                    )}
                </Box>
            </Box>
            {/*댓글 작성 컴포넌트*/}
            {/*setOnionList는 댓글 작성후 댓글목록 리렌더링 하기위해 사용*/}
            <CreateOnion onion_id={onion} setOnionList={setOnionList}/>
        </div>
    );
}

export default Onions;