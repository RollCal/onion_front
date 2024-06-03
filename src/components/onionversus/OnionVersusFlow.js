import React, { useEffect, useCallback } from 'react';
import ReactFlow, { Controls, MiniMap, useEdgesState, useNodesState } from 'reactflow';
import 'reactflow/dist/style.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function OnionVersusFlow({ versus_data }) {
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges] = useEdgesState([]);
    const navigate = useNavigate();

    const getVersusNodes = useCallback((versus_data) => {
        const orange_onion = versus_data.orange_onion;
        const purple_onion = versus_data.purple_onion;

        const initialNodes = [];

        if (!orange_onion.parent_onion) {
            const orangeNode = {
                id: orange_onion.id.toString(),
                sourcePosition: 'right',
                targetPosition: 'left',
                data: { label: orange_onion.title },
                position: { x: -200, y: 0 },
            };
            initialNodes.push(orangeNode);
        }

        if (!purple_onion.parent_onion) {
            const purpleNode = {
                id: purple_onion.id.toString(),
                sourcePosition: 'left',
                targetPosition: 'right',
                data: { label: purple_onion.title },
                position: { x: 200, y: 0 },
            };
            initialNodes.push(purpleNode);
        }

        setNodes(initialNodes);
    }, []);

    useEffect(() => {
        getVersusNodes(versus_data);
    }, [getVersusNodes, versus_data]);

    const defaultViewport = { x: 450, y: 150, zoom: 1 };

    const onNodeClick = (event, node) => {
        // Node 클릭 시 실행할 함수
    };

    // 컴포넌트 클릭 시 URL 이동 함수
    const handleComponentClick = () => {
        const id = nodes.length ? nodes[0].id : 'unknown';
        navigate(`/onion/${id}`);
    };

    return (
        <div
            onClick={handleComponentClick}
            style={{
                width: '1000px',
                height: '300px',
                border: '2px solid',
                marginTop: "10px",
                marginBottom: "10px",
                borderRadius: "10px",
                borderColor: "lightgrey",
                cursor: 'pointer'
            }}
        >
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                defaultViewport={defaultViewport}
                onNodeClick={onNodeClick}
            >
                <MiniMap />
                <Controls />
            </ReactFlow>
        </div>
    );
}

export default OnionVersusFlow;
