import { memo } from "react";
import { Position, NodeProps, Handle, useReactFlow, Node } from "@xyflow/react";

function StateTypeNode({
  id,
  data,
}: NodeProps<Node<{ text: string; type: string; label?: string }>>) {
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
      <div>State Type</div>
      <div style={{ marginTop: 5 }}>
        <input
          onChange={(evt) => updateNodeData(id, { text: evt.target.value })}
          value={data.text}
          style={{ display: "block" }}
        />
        <select
          value={data.type}
          style={{ display: "block" }}
          onChange={(evt) => updateNodeData(id, { type: evt.target.value })}
        >
          <option>string</option>
          <option>int64</option>
          <option>boolean</option>
        </select>
      </div>
      <Handle type="source" position={Position.Left} />
    </div>
  );
}

export default memo(StateTypeNode);
