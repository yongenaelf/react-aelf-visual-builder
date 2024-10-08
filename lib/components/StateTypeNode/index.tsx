import { memo, useEffect } from "react";
import { Position, NodeProps, Handle, useReactFlow, Node } from "@xyflow/react";

function StateTypeNode({
  id,
  data,
}: NodeProps<Node<{ text: string; type: string; }>>) {
  const { updateNodeData } = useReactFlow();

  useEffect(() => {
    if (!data.type) {
      updateNodeData(id, { type: "string" });
    }
  }, [data.type])

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
          <option>repeated</option>
        </select>
      </div>
      <Handle type="source" position={Position.Left} />
      <Handle type="target" position={Position.Right} />
    </div>
  );
}

export default memo(StateTypeNode);
