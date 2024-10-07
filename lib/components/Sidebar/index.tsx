import { useDnD } from '../DnDContext';
import { ProjectName } from '../ProjectName';

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
      <ProjectName />
      <div className="description">You can drag these nodes to the pane on the left.</div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'ViewFunctionNode')} draggable>
        View Function Node
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'SendFunctionNode')} draggable>
        Send Function Node
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'EventNode')} draggable>
        Event Node
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'StateObjectNode')} draggable>
        State Object Node
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'StateTypeNode')} draggable>
        State Type Node
      </div>
    </aside>
  );
};
