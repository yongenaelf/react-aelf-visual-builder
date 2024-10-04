import React, { useRef, useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Controls,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useShallow } from 'zustand/react/shallow';
import { AppState } from './types';

import { DnDProvider, useDnD, Sidebar } from '../../main';

import './index.css';
import ViewFunctionNode from '../ViewFunctionNode';
import SendFunctionNode from '../SendFunctionNode';
import useStore from './store';
import EventNode from '../EventNode';

const selector = (state: AppState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  setNodes: state.setNodes,
});

interface Props {
  colorMode?: 'light' | 'dark';
}

const nodeTypes = {
  ViewFunctionNode,
  SendFunctionNode,
  EventNode,
};

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = ({colorMode}: Props) => {
  const reactFlowWrapper = useRef(null);
  const { screenToFlowPosition } = useReactFlow();
  const [type] = useDnD();

  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, setNodes } = useStore(
    useShallow(selector),
  );

  const onDragOver: React.DragEventHandler<HTMLDivElement> = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop: React.DragEventHandler<HTMLDivElement> = useCallback(
    (event) => {
      event.preventDefault();

      // check if the dropped element is valid
      if (!type) {
        return;
      }

      // project was renamed to screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });
      const newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type} node` },
      };

      setNodes(nodes.concat(newNode));
    },
    [screenToFlowPosition, type, nodes],
  );

  return (
    <div className="dndflow">
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          nodeTypes={nodeTypes}
          fitView
          colorMode={colorMode}
        >
          <Controls />
        </ReactFlow>
      </div>
      <Sidebar />
    </div>
  );
};

export const Flow = (props: Props) => (
  <ReactFlowProvider>
    <DnDProvider>
      <DnDFlow {...props} />
    </DnDProvider>
  </ReactFlowProvider>
);