import { Handle, Position } from "reactflow";

function GatewayNode({ data }) {
  console.log(data, 'gateway')
    return (
        <div className="diamond">
          <Handle
            type="target"
            position={Position.Top}
            id="option"
            style={{ borderRadius: 0 }}
          />
          <div id={data.id}>{data.label}</div>
          <Handle
            type="source"
            position={Position.Left}
            id={`negative`}
            style={{ top: "30%", borderRadius: 0 }}
          />
          <Handle
            type="source"
            position={Position.Right}
            id={`positive`}
            style={{ top: "70%", borderRadius: 0 }}
          />
        </div>
      );
}

export default GatewayNode;