import React, {useCallback, useEffect} from 'react';
import axios from "axios";
import ReactFlow, {Controls, MiniMap, useEdgesState, useNodesState} from "reactflow";

function OnionFlow(props) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
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
                    data: {label: onion.title},
                    position: {x: 200 * new_node_list.length, y: 0},
                };

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

    useEffect(() => {
        getOnionChildNodes(props.onion_id);
    }, [getOnionChildNodes, props.onion_id]);

    const defaultViewport = { x: 200, y: 150, zoom: 1};

    // 노드 클릭시 댓글 목록 렌더링
    const onNodeClick = (event, node) => {
        props.getVersusComment(node.id).then((data => props.setOnionList(data)));
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