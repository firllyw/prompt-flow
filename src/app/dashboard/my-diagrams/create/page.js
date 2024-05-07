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
const url = 'http://localhost:3000/anthropic/';
const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    baseURL: url,
});

function MyDiagrams() {

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
    const [loading, setLoading] = useState(false);



    const askClaude = async (question) => {
        console.log('ask claude', url)
        setLoading(true);
        const msg = await anthropic.messages.create({
            model: "claude-3-opus-20240229",
            max_tokens: 1000,
            temperature: 0,
            system: "\ni only need answer with these 2 format of array. first is for nodes object, second one is for edges (don't put the \"nodes\" and \"edges\" on the response, only the array directly). also no need for conversational response and your response should be in json format. and separate between nodes and edges response with ### character.\n\nNodes: \n1. for each item, the default for type is input, but for a step/flow that can branch out into optional step, the type should be \"gateway\", and please adjust the position accordingly. the flow should be top to bottom and any gateway type should branch out the next optional nodes to specific position too. \n\n   [ {\n        id: '1',\n        position: { x: 0, y: 0 },\n        type: \"input\",\n        data: { label: 'Identify Hiring Need' }\n    }\n]\n\nEdges: \n1. for edges, the id should be in the format of `ed${originNode}-${targetNode}`, for edges between gateway type of nodes, add key sourceHandle 'negative' for negative output, and 'positive' for positive output\n\n[{ id: 'ed1', source: '1', target: '2' }];\n",
            messages: [
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": question
                        }
                    ]
                }
            ]
        }).catch(err => {
            console.log(err)
            setLoading(false);
            toast.error('Failed to get response from Claude');
        });

        if (!msg) {
            setLoading(false);
            toast.error('Failed to get response from Claude');
            return;
        }
        const textResponse = msg.content[0].text;
        let nodesResponse = textResponse.split('###')[0].trim();
        let edgesResponse = textResponse.split('###')[1].trim();
        // remove any char before the first [ and after the last ]
        nodesResponse = nodesResponse.slice(nodesResponse.indexOf('['), nodesResponse.lastIndexOf(']') + 1);
        edgesResponse = edgesResponse.slice(edgesResponse.indexOf('['), edgesResponse.lastIndexOf(']') + 1);
        setNodes(JSON.parse(nodesResponse));
        setEdges(JSON.parse(edgesResponse));
        setLoading(false);
        console.log(nodes)
        console.log(edges)
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