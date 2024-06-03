import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import ReactFlow, { Controls, MiniMap, useEdgesState, useNodesState } from 'reactflow';
import 'reactflow/dist/style.css';

function Detail() {
    const { id } = useParams(); // URL 파라미터에서 id를 가져옴
    const [nodes, setNodes] = useState([]); // 노드 상태
    const [edges, setEdges] = useState([]); // 엣지 상태

    useEffect(() => {
        // id를 기반으로 데이터를 가져와서 노드와 엣지를 설정함
        axios.get(`http:///api/data/${id}`)
            .then(response => {
                const data = response.data;

                // 노드와 엣지 설정
                setNodes(data.nodes);
                setEdges(data.edges);
            })
            .catch(error => {
                console.error(error);
            });
    }, [id]); // id가 변경될 때마다 호출

    const defaultViewport = { x: 450, y: 150, zoom: 1 };

    return (
        <div style={{ width: '100%', height: '100%' }}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                defaultViewport={defaultViewport}
            >
                <MiniMap />
                <Controls />
            </ReactFlow>
        </div>
    );
}

export default Detail;
