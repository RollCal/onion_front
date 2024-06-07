import React, {useContext, useEffect, useState} from 'react';
import axios from "axios";
import {useParams} from "react-router";
import OnionFlow from "./OnionFlow";
import CreateOnion from "./CreateOnion";
import {Link} from "react-router-dom";
import {
    Box,
    Button,
    ButtonGroup,
    Editable, EditableInput, EditablePreview,
    Flex,
    IconButton, Input,
    Spacer,
    Tooltip,
    useEditableControls
} from "@chakra-ui/react";
import {FaArrowUp, FaArrowDown} from "react-icons/fa";
import {GlobalContext} from "../GlobalState";
import {CheckIcon, CloseIcon, DeleteIcon, EditIcon} from "@chakra-ui/icons";

function Onions(props) {

    const param = useParams();

    const [onionList, setOnionList] = useState([]);
    const [onion, setOnion] = useState();
    const [onion_title, setOnion_title] = useState();
    const [onion_color, setOnion_color] = useState();
    const [onion_writer, setOnion_writer] = useState();

    const {isLoggedIn} = useContext(GlobalContext)

    const [isVote, setIsVote] = useState(null);

    // 댓글 목록 불러오기
    async function getVersusComment(onion_id) {
        try {

            // 로컬스토리지에서 토큰 가져오기
            const token = localStorage.getItem("token");
            // 헤더에 넣기
            let config = {};

            if (isLoggedIn) {
                config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                };
            }

            // 댓글 등록 대상 업데이트
            const response = await axios.get(`/api/onions/${onion_id}`, config);
            console.log(response.data);
            setOnion(onion_id);
            setOnion_title(response.data.title);
            setOnion_color(response.data.color);
            setIsVote(response.data.voted);
            setOnion_writer(response.data.writer);

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
                    if (type === "Up") {
                        setIsVote("Up");
                    } else {
                        setIsVote("Down");
                    }
                    alert("정상적으로 투표하였습니다.");
                } else {
                    setIsVote(null);
                    alert("투표가 취소되었습니다.");
                }
            })
            .catch(function (erorr) {
                alert("로그인이 필요합니다!");
            });
    }

    const commentVoteButtonHandler = (onion_id, type) => {
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
            .catch(function (erorr) {
                alert("로그인이 필요합니다!");
            });
    }

    const onionDeleteButtonHandler = (onion_id) => {
        // 로컬스토리지에서 토큰 가져오기
        const token = localStorage.getItem("token");

        if (!token) {
            alert("로그인이 필요합니다!");
        } else {
            // 헤더에 넣기
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };

            axios.delete(`/api/onions/${onion_id}`, config)
                .then(function (response) {
                    if (response.data.code === 200) {
                        alert("정상적으로 삭제되었습니다.");
                    } else {
                        alert("삭제기간이지나 관리자에게 삭제요청을 하였습니다");
                    }
                })
                .catch(function (error) {
                    if (error.response) {
                        if (error.response.data.code === 403) {
                            alert("글 작성자가 아닙니다.");
                        } else if (error.response.data.code === 400) {
                            alert("이미 삭제요청하셨습니다.");
                        } else {
                            alert("서버에서 문제가 발생하였습니다.");
                        }
                    } else {
                        alert("서버에서 문제가 발생하였습니다.");
                    }
                });
        }
    }

    useEffect(() => {
        // 처음 렌더링시 route에서 가져온 id 로 댓글 목록 불러오기
        getVersusComment(param.onion_id).then((data) => {
            setOnionList(data);
        });
    }, [param.onion_id, isLoggedIn]); // 목록에있는 데이터들이 변경 될때마나 리랜더링, 공백일때는 무조건 한번 랜더링

    function OnionEditor({onion_title}) {

        return (
            <Editable
                textAlign='center'
                defaultValue={onion_title} // defaultValue를 externalData에 기반하여 설정
                fontSize='2xl'
                isPreviewFocusable={false}
            >
                <EditablePreview/>
                {/* 여기서 사용자 정의 입력 */}
                <Input id="edit_input" as={EditableInput} value={onion_title}/> {/* readOnly로 설정하여 사용자가 직접 수정하지 못하게 */}
                <EditableControls/>
            </Editable>
        );
    }


    function EditableControls(edit_onion_id) {
        const {
            isEditing,
            getSubmitButtonProps,
            getCancelButtonProps,
            getEditButtonProps,
        } = useEditableControls();

        const onionEditButtonHandler = (onion_id) => {
            // 로컬스토리지에서 토큰 가져오기
            const token = localStorage.getItem("token");

            if (!token) {
                alert("로그인이 필요합니다!");
            } else {
                // 헤더에 넣기
                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                };

                axios.put(`/api/onions/${onion_id}`, {
                    title: document.getElementById("edit_input").value
                }, config)
                    .then(function (response) {
                        if (response.data.code === 200) {
                            alert("정상적으로 수정되었습니다.");
                            setOnion_title(document.getElementById("edit_input").value);
                        } else {
                            alert("수정기간이지나 관리자에게 삭제요청을 하였습니다");
                            setOnion_title(onion_title+" ");
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                        if (error.response) {
                            if (error.response.data.code === 403) {
                                alert("글 작성자가 아닙니다.");
                            } else if (error.response.data.code === 400) {
                                alert("이미 수정요청하셨습니다.");
                            } else {
                                alert("서버에서 문제가 발생하였습니다.");
                            }
                            setOnion_title(onion_title+" ");
                        } else {
                            alert("서버에서 문제가 발생하였습니다.");
                            setOnion_title(onion_title+" ");
                        }
                    });
            }
        }

        const checkIconProps = {
            ...getSubmitButtonProps(),
            onClick: (event) => {
                onionEditButtonHandler(onion);
            },
        };

        return isEditing ? (
            <ButtonGroup justifyContent='center' size='sm'>
                <IconButton icon={<CheckIcon/>} {...checkIconProps} />
                <IconButton icon={<CloseIcon/>} {...getCancelButtonProps()} />
            </ButtonGroup>
        ) : (
            <ButtonGroup>
                <Tooltip label='DELETE ONION'>
                    <Button border='2px' size='md' bgColor="white" color="red.300"
                            borderColor="red.300"
                            marginTop="10px"
                            onClick={() => {
                                onionDeleteButtonHandler(onion);
                            }}>
                        <DeleteIcon/>
                    </Button>
                </Tooltip>
                <Tooltip label='EDIT ONION'>
                    <IconButton border='2px' size='md' bgColor="white" color="grey" borderColor="grey"
                                marginTop="10px" icon={<EditIcon/>} {...getEditButtonProps()} />
                </Tooltip>
            </ButtonGroup>
        );
    }

    return (
        <div>
            {/*다이어 그램 생성*/}
            {/*getVersusComment는 노드 클릭시 해당 노드의 댓글을 가져오기 위해 사용*/}
            {/*setOnionList는 댓글 목록 리렌더링 하기위해 사용*/}
            <OnionFlow onion_id={param.onion_id} key={param.onion_id} getVersusComment={getVersusComment}
                       setOnionList={setOnionList} onionList={onionList}/>
            <Box>
                <Box p={5}>
                    <Flex gap={2}>
                        <Box>
                            <ButtonGroup>
                                {/* 투표했었던 건 구별되도록 설정 */}
                                {
                                    isVote === "Up" ? (

                                            <Tooltip label='UP VOTE'>
                                                <Button color="white" border='2px'
                                                        borderColor={onion_color === "Orange" ? "#F24822" : "#9747FF"}
                                                        size='md'
                                                        bgColor={onion_color === "Orange" ? "#F24822" : "#9747FF"}
                                                        onClick={() => {
                                                            upVoteButtonHandler(onion, "Up")
                                                        }}>
                                                    {onion_title}
                                                    <FaArrowUp/>
                                                </Button>
                                            </Tooltip>
                                        )
                                        :
                                        (
                                            <Tooltip label='UP VOTE'>
                                                <Button color={onion_color === "Orange" ? "#F24822" : "#9747FF"}
                                                        border='2px'
                                                        borderColor={onion_color === "Orange" ? "#F24822" : "#9747FF"}
                                                        size='md'
                                                        bgColor="white" onClick={() => {
                                                    upVoteButtonHandler(onion, "Up")
                                                }}>
                                                    {onion_title}
                                                    <FaArrowUp/>
                                                </Button>
                                            </Tooltip>
                                        )
                                }
                                {
                                    isVote === "Down" ? (
                                            <Tooltip label='DOWN VOTE'>
                                                <Button color="white" border='2px'
                                                        borderColor={onion_color === "Orange" ? "#F24822" : "#9747FF"}
                                                        size='md'
                                                        bgColor={onion_color === "Orange" ? "#F24822" : "#9747FF"}
                                                        onClick={() => {
                                                            upVoteButtonHandler(onion, "Down")
                                                        }}>
                                                    {onion_title}
                                                    <FaArrowDown/>
                                                </Button>
                                            </Tooltip>
                                        )
                                        :
                                        (
                                            <Tooltip label='DOWN VOTE'>
                                                <Button color={onion_color === "Orange" ? "#F24822" : "#9747FF"}
                                                        border='2px'
                                                        borderColor={onion_color === "Orange" ? "#F24822" : "#9747FF"}
                                                        size='md'
                                                        bgColor="white" onClick={() => {
                                                    upVoteButtonHandler(onion, "Down")
                                                }}>
                                                    {onion_title}
                                                    <FaArrowDown/>
                                                </Button>
                                            </Tooltip>
                                        )
                                }
                            </ButtonGroup>
                        </Box>
                        <Spacer/>
                        <Box>
                            <ButtonGroup>
                                <OnionEditor onion_title={onion_title}/>
                            </ButtonGroup>
                        </Box>
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
                                            commentVoteButtonHandler(comment.id, "Up")
                                        }}>
                                    <FaArrowUp/>
                                </Button>
                            </Tooltip>
                            <Tooltip label='DOWN VOTE'>
                                <Button border='2px' size='xs' bgColor="white" marginTop="10px"
                                        onClick={() => {
                                            commentVoteButtonHandler(comment.id, "Down")
                                        }}>
                                    <FaArrowDown/>
                                </Button>
                            </Tooltip>
                            <Tooltip label='DELETE ONION'>
                                <Button border='2px' size='xs' bgColor="white" color="red.300"
                                        borderColor="red.300"
                                        marginTop="10px"
                                        onClick={() => {
                                            onionDeleteButtonHandler(comment.id)
                                        }}>
                                    <DeleteIcon/>
                                </Button>
                            </Tooltip>
                            <Tooltip label='EDIT ONION'>
                                <Button border='2px' size='xs' bgColor="white" color="grey"
                                        borderColor="grey"
                                        marginTop="10px"
                                        onClick={() => {
                                            commentVoteButtonHandler(comment.id, "Down")
                                        }}>
                                    <EditIcon/>
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