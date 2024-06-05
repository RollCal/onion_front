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
        paddingTop: "70px",
        borderRadius: "10px",
        color: "white",
    },
    purple: {
        backgroundColor: "#9747FF",
    },
    red: {
        backgroundColor: "#F24822",
    },
    selected: {
        backgroundColor: "#A75D36",
    }
};

function OnionFlow(props) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const getOnionData = async (onion_id) => {
        try {
            const response = await axios.get(`/api/onions/onionvisualize/${onion_id}`);
            return response.data;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    const getOnionChildNodes = useCallback(async (onion_id, new_node_list = [], new_edge_list = []) => {
        const onion = await getOnionData(onion_id);
        if (!onion) return;

        if (onion.parent_onion) {
            const newEdge = {
                id: `e${onion.id}-${onion.parent_onion}`,
                source: onion.id.toString(),
                target: onion.parent_onion.toString(),
                markerStart: 'myCustomSvgMarker',
                markerEnd: { type: 'arrow', color: '#f00' },
            };
            new_edge_list.push(newEdge);
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
                ...(Number(props.onion_id) === onion.id ? nodeStyles.selected :
                    onion.color === "Purple" ? nodeStyles.purple : nodeStyles.red),
            }
        };
        new_node_list.push(newNode);
        setNodes(prevNodes => [...prevNodes, newNode]);

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
                position: { x: 400 * new_node_list.length * -1 - 200, y: 0 },
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
                    backgroundColor: item.id === node.id ? nodeStyles.selected.backgroundColor : item.data.onion_color === "Purple" ? nodeStyles.purple.backgroundColor : nodeStyles.red.backgroundColor,
                }
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
