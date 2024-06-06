import React, { useEffect, useCallback } from 'react';
import ReactFlow, { Controls, useEdgesState, useNodesState } from 'reactflow';
import 'reactflow/dist/style.css';
import axios from "axios";
import { useNavigate } from "react-router";
import { Box, Grid, GridItem, Text } from "@chakra-ui/react";

function OnionVersusFlow(prop) {
    const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);
    const navigate = useNavigate();

    // 최상위 노드 생성
    const getVersusNodes = useCallback((versus_data) => {
        const orange_onion = versus_data.orange_onion;
        const purple_onion = versus_data.purple_onion;

        // 하위 노드 생성
        getNextNodes(orange_onion.id, "orange");
        getNextNodes(purple_onion.id);
    }, []);

    // 하위 노드 생성 함수
    const getNextNodes = useCallback((onion_id, type = "purple", new_node_list = [], new_edge_list = []) => {
        axios.get(`/api/onions/onionvisualize/${onion_id}`)
            .then(function (response) {
                const onion = response.data;

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
                    position: { x: 400 * new_node_list.length * loc_number + (200 * loc_number), y: 0 },
                };

                newNode.style = {
                    backgroundColor: onion.color === "Purple" ? "#9747FF" : "#F24822",
                    color: "white",
                    height: "200px",
                    width: "350px",
                    display: "flex",
                    justifyContent: "center",
                    fontSize: "40px",
                    paddingTop: "70px",
                    borderRadius: "10px",
                };

                new_node_list.push(newNode);
                setNodes(prevNodes => [...prevNodes, newNode]);

                if (onion.next) {
                    getNextNodes(onion.next.id, type, new_node_list, new_edge_list);
                }
            })
            .catch(function (error) {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        getVersusNodes(prop.versus_data);
    }, [getVersusNodes]);

    const defaultViewport = { x: 350, y: 150, zoom: 1 };

    // 노드 상세 페이지 이동
    const onNodeClick = (event, node) => {
        navigate(`/onion/${node.id}`);
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
                    <GridItem colSpan={1} w='100%' h='10'>
                        {ov_title}
                    </GridItem>
                </Grid>
                <Grid templateColumns={`repeat(${total_up_vote_cnt}, 1fr)`}>
                    <GridItem colSpan={orange_up_vote_cnt} w='100%' h='10' bg='#F24822' color="white" p={2} pl={5}>
                        {orange_onion_title}
                    </GridItem>
                    <GridItem colSpan={purple_up_vote_cnt} w='100%' h='10' bg='#9747FF' align='right' color="white" p={2} pr={5}>
                        {purple_onion_title}
                    </GridItem>
                </Grid>
            </>
        );
    };

    return (
        <Box p="10">
            <VersusInfo />
            <div style={{
                width: '70vw',
                height: '500px',
                border: '2px solid',
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
                >
                    <Controls />
                </ReactFlow>
            </div>
        </Box>
    );
}

export default OnionVersusFlow;
