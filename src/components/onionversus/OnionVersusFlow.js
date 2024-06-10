import React, {useEffect, useCallback} from 'react';
import ReactFlow, {Controls, useEdgesState, useNodesState} from 'reactflow';
import 'reactflow/dist/style.css';
import axios from "axios";
import {useNavigate} from "react-router";
import {Box, Grid, GridItem, Text} from "@chakra-ui/react";
import './css/node.css';

function OnionVersusFlow(prop) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);
    const navigate = useNavigate();
    // 최상위 노드 에서 부터 하위 노드 생성
    const getVersusNodes = useCallback((versus_data) => {

        // VS 이미지 노드 생성
        const newVSNode = {
            id: "vs",
            position: {x: 25, y: 0},
            draggable: false,
        };

        const img = new Image();
        img.src = "/images/vs_img.png";
        newVSNode.style = {
            backgroundImage: "url('/images/vs_img.png')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            width: img.naturalWidth,
            height: img.naturalHeight,
            borderColor: "white",
        }

        setNodes(prevNodes => [...prevNodes, newVSNode]);

        const orange_onion = versus_data.orange_onion;
        const purple_onion = versus_data.purple_onion;
        // 하위 노드 생성
        getNextNodes(orange_onion, "orange");
        getNextNodes(purple_onion);
    }, []);

    // 하위 노드 생성 함수
    const getNextNodes = useCallback(async (onion, type = "purple", new_node_list = [], new_edge_list = []) => {

        let loc_number = 1;
        let sourcePosition = 'left';
        let targetPosition = 'right';

        if (type !== "purple") {
            loc_number = -1;
            sourcePosition = 'right';
            targetPosition = 'left';
        }

        if (onion.parent_onion) {
            const newEdge = {
                id: `e${onion.id}-${onion.parent_onion}`,
                source: onion.id.toString(),
                target: onion.parent_onion.toString(),
                markerStart: 'myCustomSvgMarker', markerEnd: { type: 'arrow', color: '#f00' },
            };

            new_edge_list.push(newEdge);
            setEdges(prevEdges => [...prevEdges, newEdge]);
        }

        const newNode = {
            id: onion.id.toString(),
            sourcePosition: sourcePosition,
            targetPosition: targetPosition,
            data: { label: onion.title },
            position: { x: 400 * new_node_list.length * loc_number + (400 * loc_number), y: 0 },
        };

        newNode.style = {
            backgroundColor: onion.color === "Purple" ? "#9747FF" : "#F24822",
            color: "white",
            height: "200px",
            width: "350px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center", // 수직으로 중앙 정렬
            fontSize: "40px",
            borderRadius: "10px",
        };

        new_node_list.push(newNode);
        setNodes(prevNodes => [...prevNodes, newNode]);

        if (onion.next) {
            await getNextNodes(onion.next, type, new_node_list, new_edge_list);
        }
    }, []);

    useEffect(() => {
        getVersusNodes(prop.versus_data);
    }, [getVersusNodes]);

    const defaultViewport = { x: 380, y: 150, zoom: 0.8};

    // 노드 상세 페이지 이동
    const onNodeClick = (event, node) => {
        if (node.id !== "vs") {
            navigate(`/onion/${node.id}`);
        }
    };

    // 투표 그래프와 versus 제목 및 하이라이트 레이아웃
    const VersusInfo = () => {
        const versus = prop.versus_data;
        const ov_title = versus.ov_title;
        const orange_onion_title = versus.orange_onion.title;
        let orange_up_vote_cnt = 1;
        if (Number(versus.orange_onion.up_vote_num)) {
            orange_up_vote_cnt = Number(versus.orange_onion.up_vote_num);
        }
        const purple_onion_title = versus.purple_onion.title;
        let purple_up_vote_cnt = 1;
        if (Number(versus.purple_onion.up_vote_num)) {
            purple_up_vote_cnt = Number(versus.purple_onion.up_vote_num);
        }
        const total_up_vote_cnt = orange_up_vote_cnt + purple_up_vote_cnt;

        const highlight = versus.highlight;

        return (
            <>
                {highlight && (
                    <Text color="red.500" fontSize="xl" mb="2">
                        {highlight}
                    </Text>
                )}
                <Grid>
                    <GridItem colSpan={1} w='100%'>
                        <Text fontSize={'30px'} ml={2} mb={2}>{ov_title}</Text>
                    </GridItem>
                </Grid>
                <Grid templateColumns={`repeat(${total_up_vote_cnt}, 1fr)`}>
                    <GridItem colSpan={orange_up_vote_cnt} w='100%' h='10' bg='#F24822' color="white" p={2} pl={5}>
                        {orange_onion_title}
                    </GridItem>
                    <GridItem colSpan={purple_up_vote_cnt} w='100%' h='10' bg='#9747FF' align='right' color="white"
                              p={2} pr={5}>
                        {purple_onion_title}
                    </GridItem>
                </Grid>
            </>
        );
    };

    return (
        <Box p="10">
            <VersusInfo/>
            <Box style={{
                width: '70vw',
                height: '500px',
                border: '6px solid',
                marginTop: "10px",
                marginBottom: "10px",
                borderRadius: "10px",
                borderColor: "lightgrey"
            }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    defaultViewport={defaultViewport}
                    onNodeClick={onNodeClick}
                    onNodesChange={onNodesChange}
                >
                    <Controls/>
                </ReactFlow>
            </Box>
        </Box>
    );
}

export default OnionVersusFlow;