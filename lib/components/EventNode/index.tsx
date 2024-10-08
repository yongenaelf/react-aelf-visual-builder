import { memo } from "react";
import { Position, NodeProps, Handle, useReactFlow, Node } from "@xyflow/react";

function EventNode({
  id,
  data,
}: NodeProps<Node<{ text: string; label?: string }>>) {
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
      <div>Event</div>
      <div style={{ marginTop: 5 }}>
        <input
          onChange={(evt) => updateNodeData(id, { text: evt.target.value })}
          value={data.text}
          style={{ display: "block" }}
        />
      </div>
      <Handle type="target" position={Position.Right} />
    </div>
  );
}

export default memo(EventNode);
