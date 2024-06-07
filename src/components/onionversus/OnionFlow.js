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
            await getOnionChildNodes(onion.next.id, new_node_list, new_edge_list);
        }
    }, [setEdges, setNodes, props.onion_id]);

    const getOnionParentNodes = useCallback((onion_id, new_node_list = [], new_edge_list = []) => {
        axios.get(`/api/onions/onionvisualize/${onion_id}`)
            .then(function (response) {
                if (response.data.parent_onion) {
                    const parent_onion_id = response.data.parent_onion;
                    axios.get(`/api/onions/onionvisualize/${parent_onion_id}`)
                        .then(function (response) {
                            const onion = response.data;
                            if (onion.parent_onion) {
                                const newEdge = {
                                    id: `e${onion.id}-${onion.parent_onion}`,
                                    source: onion.id.toString(),
                                    target: onion.parent_onion.toString(),
                                    markerStart: 'myCustomSvgMarker', markerEnd: {type: 'arrow', color: '#f00'},
                                };

                                new_edge_list.push(newEdge);
                                setEdges(prevEdges => [...prevEdges, newEdge]);
                            }

                            const newNode = {
                                id: onion.id.toString(),
                                sourcePosition: 'left',
                                targetPosition: 'right',
                                data: {label: onion.title, onion_color: onion.color},
                                position: {x: 400 * new_node_list.length * -1 - 400, y: 0},
                            };

                            if (onion.color === "Purple") {
                                newNode.style = {
                                    backgroundColor: "#9747FF",
                                    color: "white",
                                    height: "200px",
                                    width: "350px",
                                    display: "flex",
                                    justifyContent: "center",
                                    fontSize: "30px",
                                    paddingTop: "70px",
                                    borderRadius: "10px",

                                }
                            } else {
                                newNode.style = {
                                    backgroundColor: "#F24822",
                                    color: "white",
                                    height: "200px",
                                    width: "350px",
                                    display: "flex",
                                    justifyContent: "center",
                                    fontSize: "30px",
                                    paddingTop: "70px",
                                    borderRadius: "10px",
                                }
                            }

                            new_node_list.push(newNode);
                            setNodes(prevNodes => [...prevNodes, newNode]);


                            if (onion.next) {
                                getOnionParentNodes(onion.id, new_node_list, new_edge_list);
                            }
                        })
                        .catch(function (error) {

                        });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }, [setEdges, setNodes])

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
