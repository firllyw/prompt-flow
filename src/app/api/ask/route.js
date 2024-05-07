import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";



export async function POST(req) {
    const anthropic = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
    });

    try {
        const body = await req.json()
        const { question } = body
        const msg = await anthropic.messages.create({
            model: "claude-3-opus-20240229",
            max_tokens: 4000,
            temperature: 0,
            system: "i only need answer with these 2 format of array. first is for nodes object, second one is for edges (don't put the \"nodes\" and \"edges\" on the response, only the array directly). Also no need for conversational response and your response should be in json format. wrap the nodes response with [nodes-start] and [nodes-end], do the same with edges . \nNodes: \n1. for each item, the default for type is \"default\", but for a step/flow that can branch out into optional step, the type should be \"gateway\\, and please adjust the position accordingly. the flow should be top to bottom and any gateway type should branch out the next optional nodes to specific position too. negative output should be in left side of previous / source node, positive output should be in  right side of source node.\n[ {\nid: '1',\nposition: { x: 0, y: 0 },\ntype: \\\"input\\\",\ndata: { label: 'Identify Hiring Need' }\n}]\n\nEdges: \n1. for edges, the id should be in the format of `ed${originNode}-${targetNode}-xxx` \n2. for edges between gateway type of nodes, add key sourceHandle 'negative' for negative output, and 'positive' for positive output.\n[\n{ id: 'ed1-2-negative', source: '1', target: '2', sourceHandle: 'negative', label: 'No' },\n{ id: 'ed1-2-positive', source: '1', target: '2', sourceHandle: 'positive', label: 'Yes' } \n];",
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
        })

        if (!msg) {
            return NextResponse.json({ error: 'Failed to get response from Claude' }, { status: 500 })
        }

        const textResponse = msg.content[0].text;
        console.log(textResponse)
        // node response is between [nodes-start] and [nodes-end]
        let nodesResponse = textResponse.split('[nodes-start]')[1].trim();
        nodesResponse = nodesResponse.split('[nodes-end]')[0].trim();
        // edge response is between [edges-start] and [edges-end]
        let edgesResponse = textResponse.split('[edges-start]')[1].trim();
        edgesResponse = edgesResponse.split('[edges-end]')[0].trim();

        return NextResponse.json({ nodes: JSON.parse(nodesResponse), edges: JSON.parse(edgesResponse) }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: err }, { status: 500 });
    }
}