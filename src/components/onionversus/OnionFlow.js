import React, { useCallback, useEffect } from 'react';
import axios from "axios";
import ReactFlow, { Controls, useEdgesState, useNodesState } from "reactflow";

// 스타일 상수 정의
const nodeStyles = {
    default: {
        height: "200px",
        width: "350px",
        display: "flex",
        justifyContent: "center",
        fontSize: "30px",
        alignItems: "center", // 수직으로 중앙 정렬
        borderRadius: "10px",
        color: "white",
        zIndex: "0"
    },
    purple: {
        backgroundColor: "#9747FF",
    },
    red: {
        backgroundColor: "#F24822",
    },
    selectedPurple: {
        backgroundColor: "#D8BFFF",
    },
    selectedRed: {
        backgroundColor: "#FFA07A",
    }
};

function OnionFlow(props) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    // 데이터 가져오기
    const getOnionData = async (onion_id) => {
        try {
            const response = await axios.get(`/api/onions/onionvisualize/${onion_id}`);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    // 노드 생성
    const getOnionChildNodes = useCallback(async (onion_id, new_node_list = [], new_edge_list = []) => {
        const onion = await getOnionData(onion_id);
        if (!onion) return;

        if (onion.parent_onion) {
            const newEdge = {
                id: `e${onion.id}-${onion.parent_onion}`,
                source: onion.id.toString(),
                target: onion.parent_onion.toString(),
                markerStart: { type: 'arrowstart', color: '#000' },
                markerEnd: { type: 'arrowclosed', color: '#000' },
                style: { strokeWidth: 3, stroke: '#000' },
            };
            new_edge_list.push(newEdge);

            // 랜더링 넣기
            setEdges(prevEdges => [...prevEdges, newEdge]);
        }

        const newNode = {
            id: onion.id.toString(),
            sourcePosition: 'left',
            targetPosition: 'right',
            data: { label: onion.title, onion_color: onion.color },
            position: { x: 400 * new_node_list.length, y: 0 },
            style: {
                ...nodeStyles.default,
                ...(Number(props.onion_id) === onion.id ? (onion.color === "Purple" ? nodeStyles.selectedPurple : nodeStyles.selectedRed) :
                    onion.color === "Purple" ? nodeStyles.purple : nodeStyles.red),
            }
        };

        new_node_list.push(newNode);

        // 랜더링 넣기
        setNodes(prevNodes => [...prevNodes, newNode]);

        // 하위가 있으면 재호출
        if (onion.next) {
            getOnionChildNodes(onion.next.id, new_node_list, new_edge_list);
        }
    }, [setEdges, setNodes, props.onion_id]);

    const getOnionParentNodes = useCallback(async (onion_id, new_node_list = [], new_edge_list = []) => {
        const onion = await getOnionData(onion_id);
        if (!onion) return;

        if (onion.parent_onion) {
            const parent_onion_id = onion.parent_onion;
            const parentOnion = await getOnionData(parent_onion_id);
            if (!parentOnion) return;

            if (parentOnion.parent_onion) {
                const newEdge = {
                    id: `e${parentOnion.id}-${parentOnion.parent_onion}`,
                    source: parentOnion.id.toString(),
                    target: parentOnion.parent_onion.toString(),
                    markerStart: 'myCustomSvgMarker',
                    markerEnd: { type: 'arrow', color: '#f00' },
                };
                new_edge_list.push(newEdge);
                setEdges(prevEdges => [...prevEdges, newEdge]);
            }

            const newNode = {
                id: parentOnion.id.toString(),
                sourcePosition: 'left',
                targetPosition: 'right',
                data: { label: parentOnion.title, onion_color: parentOnion.color },
                position: { x: 400 * new_node_list.length * -1 - 400, y: 0 },
                style: {
                    ...nodeStyles.default,
                    ...(parentOnion.color === "Purple" ? nodeStyles.purple : nodeStyles.red),
                }
            };
            new_node_list.push(newNode);
            setNodes(prevNodes => [...prevNodes, newNode]);

            if (parentOnion.next) {
                getOnionParentNodes(parentOnion.id, new_node_list, new_edge_list);
            }
        }
    }, [setEdges, setNodes]);

    useEffect(() => {
        getOnionChildNodes(props.onion_id);
        getOnionParentNodes(props.onion_id);
    }, [getOnionChildNodes, getOnionParentNodes, props.onion_id]);

    const defaultViewport = { x: 200, y: 150, zoom: 1 };

    const onNodeClick = (event, node) => {
        props.getVersusComment(node.id).then(data => props.setOnionList(data));
        setNodes(nodes =>
            nodes.map(item => ({
                ...item,
                style: {
                    ...item.style,
                    backgroundColor: item.id === node.id ? (item.data.onion_color === "Purple" ? nodeStyles.selectedPurple.backgroundColor : nodeStyles.selectedRed.backgroundColor) : (item.data.onion_color === "Purple" ? nodeStyles.purple.backgroundColor : nodeStyles.red.backgroundColor),
                } // node id(기존 노드)와 item id(클릭된 노드)의 id가 일치한다면 = 클릭된 노드 -> 색깔변환
            }))
        );
    };

    return (
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
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                defaultViewport={defaultViewport}
                onNodeClick={onNodeClick}
            >
                <Controls />
            </ReactFlow>
        </div>
    );
}

export default OnionFlow;
