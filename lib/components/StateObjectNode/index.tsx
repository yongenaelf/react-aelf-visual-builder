import { memo } from "react";
import { Position, NodeProps, Handle, useReactFlow, Node } from "@xyflow/react";

function StateObjectNode({
  id,
  data,
}: NodeProps<Node<{ text?: string; type: string; }>>) {
  const { updateNodeData } = useReactFlow();

  return (
    <div
      style={{
        background: "#eee",
        color: "#222",
        padding: 10,
        fontSize: 12,
        borderRadius: 10,
      }}
    >
      <div>State Object</div>
      <div style={{ marginTop: 5 }}>
        <input
          onChange={(evt) => updateNodeData(id, { type: evt.target.value })}
          value={data.type}
          placeholder="Type Name"
          style={{ display: "block" }}
        />
      </div>
      <div style={{ marginTop: 5 }}>
        <input
          onChange={(evt) => updateNodeData(id, { text: evt.target.value })}
          value={data.text}
          placeholder="Name"
          style={{ display: "block" }}
        />
      </div>
      <Handle type="source" position={Position.Left} />
      <Handle type="target" position={Position.Right} />
    </div>
  );
}

export default memo(StateObjectNode);
