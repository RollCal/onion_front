import React, {useCallback, useEffect} from 'react';
import axios from "axios";
import ReactFlow, {Controls, useEdgesState, useNodesState} from "reactflow";

function OnionFlow(props) {
    const [nodes, setNodes] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);

    // 자식 노드 생성
    const getOnionChildNodes = useCallback((onion_id, new_node_list = [], new_edge_list = []) => {
        axios.get(`/api/onions/onionvisualize/${onion_id}`)
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
                    position: {x: 400 * new_node_list.length, y: 0},
                };

                if (Number(props.onion_id) === onion.id) {
                    newNode.style = {
                        backgroundColor: "#A75D36",
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
                }

                new_node_list.push(newNode);
                setNodes(prevNodes => [...prevNodes, newNode]);


                if (onion.next) {
                    getOnionChildNodes(onion.next.id, new_node_list, new_edge_list);
                }
            })
            .catch(function (error) {
                console.error(error);
            });
    }, [setEdges, setNodes]);

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
        // 하위 노드 생성
        getOnionChildNodes(props.onion_id);
        // 상위 노드 생성
        getOnionParentNodes(props.onion_id);
    }, [getOnionChildNodes, getOnionParentNodes, props.onion_id]);

    const defaultViewport = {x: 200, y: 150, zoom: 1};

    // 노드 클릭시 댓글 목록 렌더링
    const onNodeClick = (event, node) => {
        props.getVersusComment(node.id).then((data => props.setOnionList(data)));
        setNodes((nodes) =>
            nodes.map((item) => {
                if (item.id === node.id) {
                    item.style = {...item.style, backgroundColor: "#A75D36", color: "white"};
                } else {
                    if (item.data.onion_color === "Purple") {
                        item.style = {
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
                        item.style = {
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
                }
                return item;
            })
        );
    }

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
                defaultViewport={defaultViewport}
                onNodeClick={onNodeClick}
            >
                <Controls/>
            </ReactFlow>
        </div>
    );
}

export default OnionFlow;
