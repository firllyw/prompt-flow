"use client"
import ReactFlow, { useEdgesState, useNodesState, addEdge, Background, Controls } from 'reactflow';
import 'reactflow/dist/style.css';

import { ThreadView } from '@/components/dashboard/chat/thread-view';
import { use, useCallback, useEffect, useLayoutEffect, useState } from 'react';
import GatewayNode from '@/components/node/gateway-node';
import BottomBar from '@/components/dashboard/my-diagrams/bottom-bar';
import Anthropic from "@anthropic-ai/sdk";
import { node } from 'prop-types';
import { toast } from 'sonner';


const defaultEdgeOptions = {
    type: 'smoothstep',
};

const initialNodes = [
    {
        "id": "1",
        "position": {
            "x": 0,
            "y": 0
        },
        "data": {
            "label": "Melakukan walkthrough bisnis proses ke tata pelaksana"
        }
    },
    {
        "id": "2",
        "position": {
            "x": 0,
            "y": 100
        },
        "data": {
            "label": "Identifikasi proses bisnis, dokumen terkait dan analisa risiko"
        }
    },
    {
        "id": "3",
        "position": {
            "x": -200,
            "y": 200
        },
        "type": "gateway",
        "data": {
            "label": "Terdapat risiko?"
        }
    },
    {
        "id": "4",
        "position": {
            "x": -200,
            "y": 300
        },
        "data": {
            "label": "Catat di dokumen risk list beserta pengendalian yang dilakukan"
        }
    },
    {
        "id": "5",
        "position": {
            "x": -400,
            "y": 400
        },
        "type": "gateway",
        "data": {
            "label": "Sudah ada pengendalian?"
        }
    },
    {
        "id": "6",
        "position": {
            "x": -400,
            "y": 500
        },
        "data": {
            "label": "Analisa pengendalian yang paling tepat"
        }
    },
    {
        "id": "7",
        "position": {
            "x": 0,
            "y": 400
        },
        "data": {
            "label": "Transformasi bisnis proses dalam bentuk diagram"
        }
    }
];
const initialEdges = [
    {
        "id": "ed1-2",
        "source": "1",
        "target": "2"
    },
    {
        "id": "ed2-3",
        "source": "2",
        "target": "3"
    },
    {
        "id": "ed3-4-positive",
        "source": "3",
        "target": "4",
        "sourceHandle": "positive",
        "label": "Ya"
    },
    {
        "id": "ed3-7-negative",
        "source": "3",
        "target": "7",
        "sourceHandle": "negative",
        "label": "Tidak"
    },
    {
        "id": "ed4-5",
        "source": "4",
        "target": "5"
    },
    {
        "id": "ed5-6-negative",
        "source": "5",
        "target": "6",
        "sourceHandle": "negative",
        "label": "Belum"
    },
    {
        "id": "ed5-7-positive",
        "source": "5",
        "target": "7",
        "sourceHandle": "positive",
        "label": "Sudah"
    },
    {
        "id": "ed6-7",
        "source": "6",
        "target": "7"
    }
]


const nodeTypes = {
    gateway: GatewayNode
}

function MyDiagrams() {

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
    const [loading, setLoading] = useState(false);



    const askClaude = async (question) => {
        setLoading(true);
        const asking = await fetch('/api/ask', {
            method: 'POST',
            body: JSON.stringify({ question }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch((err) => {
            console.error(err);
            toast.error('Failed to get response from Claude');
            setLoading(false);
            return;
        }); 

        if (!asking.ok) {
            toast.error('Failed to get response from Claude');
            setLoading(false);
            return;
        }
        const msg = await asking.json();
        console.log(msg.nodes)
        console.log(msg.edges)
        setNodes(msg.nodes)
        setEdges(msg.edges)
        setLoading(false);
    }


    const onConnect = useCallback(
        (params) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    return (
        <>
            <div className='component-container'>
                {loading && (
                    <div className='loading-overlay'>
                        <div className='spinner'></div>
                    </div>
                )}
                <div style={{ width: '100vw', height: '70vh' }}>
                    <ReactFlow
                        nodes={nodes} edges={edges} onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange} onConnect={onConnect}
                        defaultEdgeOptions={defaultEdgeOptions}
                        nodeTypes={nodeTypes}
                    >
                        <Background />
                        <Controls />
                    </ReactFlow>
                </div>
            </div>
            <BottomBar askClaude={askClaude} />
        </>
    )
}

export default MyDiagrams;