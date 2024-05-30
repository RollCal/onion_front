import React, {useEffect, useCallback, useState} from 'react';
import ReactFlow, {Background, Controls, Handle, MiniMap, useEdgesState, useNodesState} from 'reactflow';
import 'reactflow/dist/style.css';
import axios from "axios";

function OnionVersusFlow(prop) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);


    const getVersusNodes = useCallback((versus_id) => {
        if (versus_id) {
            axios.get("/api/onions/onionlist")
                .then(function (response) {
                    const versus_onion = response.data.find((item) => {
                        return item.id === Number(prop.versus_id);
                    });

                    const orange_onion = versus_onion.orange_onion
                    const purple_onion = versus_onion.purple_onion;

                    getNextNodes(orange_onion.id, "orange");
                    getNextNodes(purple_onion.id);

                })
                .catch(function (error) {
                    console.error(error);
                });
        }
    }, []);


    const getNextNodes = useCallback((onion_id, type = "purple", new_node_list = [], new_edge_list = []) => {
        if (onion_id) {
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
                        setEdges(prevEdges => [...prevEdges, newEdge]); // Correctly update edges state
                    }

                    const newNode = {
                        id: onion.id.toString(),
                        sourcePosition: sourcePosition,
                        targetPosition: targetPosition,
                        data: {label: onion.title},
                        position: {x: 200 * new_node_list.length * loc_number + (200 * loc_number), y: 0},
                    };

                    new_node_list.push(newNode);
                    setNodes(prevNodes => [...prevNodes, newNode]); // Correctly update nodes state


                    if (onion.next) {
                        getNextNodes(onion.next.id, type, new_node_list, new_edge_list);
                    }
                })
                .catch(function (error) {
                    console.error(error);
                });
        }
    }, []); // Empty dependency array means this callback does not depend on any values outside of itself


    useEffect(() => {
        getVersusNodes(1);
    }, [getVersusNodes]);

    return (
        <div style={{width: '50vw', height: '30vh', border: '1px solid', marginTop: "10px", marginBottom: "10px"}}>
            <ReactFlow nodes={nodes} edges={edges} onNodesChange={onNodesChange}>
                <MiniMap/>
                <Controls/>
            </ReactFlow>
        </div>
    );
}

export default OnionVersusFlow;