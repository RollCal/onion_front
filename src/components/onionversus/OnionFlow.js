import React, {useCallback, useEffect} from 'react';
import axios from "axios";
import ReactFlow, {Controls, MiniMap, useEdgesState, useNodesState} from "reactflow";
import {useNavigate} from "react-router";

function OnionFlow(props) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);
    const navigate = useNavigate()

    const getOnionNodes = useCallback((onion_id, type = "purple", new_node_list = [], new_edge_list = []) => {
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
                    position: {x: 200 * new_node_list.length * loc_number + (200 * loc_number), y: 0},
                };

                new_node_list.push(newNode);
                setNodes(prevNodes => [...prevNodes, newNode]);


                if (onion.next) {
                    getOnionNodes(onion.next.id, type, new_node_list, new_edge_list);
                }
            })
            .catch(function (error) {
                console.error(error);
            });
    }, []);

    useEffect(() => {
        getOnionNodes(props.onion_id);
    }, [getOnionNodes]);

    const defaultViewport = { x: 200, y: 150, zoom: 1};

    const onNodeClick = (event, node) => {
        navigate(`/onion/${node.id}`);
    }

    return (
        <div style={{width: '1000px', height: '300px', border: '2px solid', marginTop: "10px", marginBottom: "10px", borderRadius: "10px", borderColor: "lightgrey"}}>
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

export default OnionFlow;