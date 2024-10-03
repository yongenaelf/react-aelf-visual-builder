import { useDnD } from '../DnDContext';

export const Sidebar = () => {
  const [_, setType] = useDnD();

  interface DragEventWithTransfer extends React.DragEvent {
    dataTransfer: DataTransfer;
  }

  const onDragStart = (event: DragEventWithTransfer, nodeType: string) => {
    setType(nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside>
      <div className="description">You can drag these nodes to the pane on the left.</div>
      <div className="dndnode input" onDragStart={(event) => onDragStart(event, 'input')} draggable>
        Input Node
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'default')} draggable>
        Default Node
      </div>
      <div className="dndnode output" onDragStart={(event) => onDragStart(event, 'output')} draggable>
        Output Node
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'ViewFunctionNode')} draggable>
        View Function Node
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'SendFunctionNode')} draggable>
        Send Function Node
      </div>
    </aside>
  );
};
