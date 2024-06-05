import React, {useEffect, useCallback} from 'react';
import ReactFlow, {Controls, MiniMap, useEdgesState, useNodesState} from 'reactflow';
import 'reactflow/dist/style.css';
import axios from "axios";
import {useNavigate} from "react-router";
// import CustomNode from '../../CustomNode.css';

function OnionVersusFlow(prop) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);
    const navigate = useNavigate()


    // 최상위 노드 생성
    const getVersusNodes = useCallback((versus_data) => {
        const orange_onion = versus_data.orange_onion
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
                        markerStart: 'myCustomSvgMarker', markerEnd: {type: 'arrow', color: '#f00'},
                    };

                    new_edge_list.push(newEdge);
                    setEdges(prevEdges => [...prevEdges, newEdge]);
                }

                const newNode = {
                    id: onion.id.toString(),
                    sourcePosition: sourcePosition,
                    targetPosition: targetPosition,
                    data: {label: onion.title},
                    position: {x: 400 * new_node_list.length * loc_number + (200 * loc_number), y: 0},
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
                        paddingTop: "30px",
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
                        paddingTop: "30px",
                        borderRadius: "10px",
                    }
                }

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

    const defaultViewport = {x: 350, y: 150, zoom: 1};


    // 노드 상세 페이지 이동
    const onNodeClick = (event, node) => {
        navigate(`/onion/${node.id}`);
    }

    return (
        <div style={{
            width: '80vw',
            height: '500px',
            border: '2px solid',
            marginTop: "10px",
            marginBottom: "10px",
            borderRadius: "10px",
            borderColor: "lightgrey",
            backgroundImage: `url(${process.env.PUBLIC_URL + '/images/logo.png'})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '600px',
            backgroundSize: '20px 20px',
        }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                defaultViewport={defaultViewport}
                onNodeClick={onNodeClick}
            >
                <MiniMap/>
                <Controls/>
            </ReactFlow>
        </div>
    );
}

export default OnionVersusFlow;
