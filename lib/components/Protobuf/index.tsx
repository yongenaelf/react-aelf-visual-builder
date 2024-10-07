import { generateProtoFile, ProtoFile } from '@yongenaelf/protobuf-generator-ts';
import CodeMirror from '@uiw/react-codemirror';
import { protobuf } from "@codemirror/legacy-modes/mode/protobuf";
import { StreamLanguage } from "@codemirror/language";
import { AppState, AppNode } from '../Store/types';
import { useShallow } from 'zustand/react/shallow';
import useStore from '../Store';
import { useMemo } from 'react';
import camelCase from 'camelcase';

const selector = (state: AppState) => ({
  nodes: state.nodes,
  edges: state.edges,
  projectName: state.projectName,
});

function getProtobufType(node?: AppNode) {
    if (!node) return "google.protobuf.Empty";

    switch(node.type) {
        case "StateTypeNode": return node.data.type === 'object' ? (node.data.text as string) : getProtobufDefaultType(node.data.type as string);
        default: return "google.protobuf.Empty";
    }
}

function getProtobufDefaultType(type: string) {
    switch(type) {
        case "string": return "google.protobuf.StringValue";
        case "int64": return "google.protobuf.Int64Value";
        case "boolean": return "google.protobuf.BoolValue";
        default: return "google.protobuf.Empty";
    }
}

export function Protobuf({height}: {height?: string}) {
  const { nodes, edges, projectName } = useStore(
    useShallow(selector),
  );

  const value = useMemo(() => {

    const name = camelCase(projectName, {pascalCase: true}) || "HelloWorld";

    const viewMethods = nodes.filter(node => node.type === 'ViewFunctionNode').map(node => ({
        name: String(node.data.text || node.id),
        inputType: getProtobufType(nodes.find(node => edges.find(edge => edge.source === node.id && edge.targetHandle === 'input')?.target)),
        outputType: getProtobufType(nodes.find(node => edges.find(edge => edge.source === node.id && edge.targetHandle === 'output')?.target)),
        options: [
            { key: "aelf.is_view", value: "true" }
        ]
    }));

    const sendMethods = nodes.filter(node => node.type === 'SendFunctionNode').map(node => ({
        name: String(node.data.text || node.id),
        inputType: getProtobufType(nodes.find(node => edges.find(edge => edge.source === node.id)?.target)),
        outputType: "google.protobuf.Empty"
    }));

    const events = nodes.filter(node => node.type === 'EventNode').map(node => ({
        name: String(node.data.text || node.id),
        fields: edges.filter(edge => edge.target === node.id).map(edge => nodes.find(node => node.id === edge.source)).map((node, id) => ({
            name: String(node?.data.text || node?.id),
            type: String(node?.data.type),
            id: id + 1
        })),
        options: {
            "aelf.is_event": "true",
        }
    }));

    const states = nodes.filter(node => node.type === 'StateObjectNode').map(node => ({
        name: String(node.data.type || node.id),
        fields: edges.filter(edge => edge.target === node.id).map(edge => nodes.find(node => node.id === edge.source)).map((node, id) => ({
            name: String(node?.data.text || node?.id),
            type: String(node?.data.type),
            id: id + 1
        })),
    }));

    const ast: ProtoFile = {
      syntax: "proto3",
      package: "",  // No package for this file
      imports: [
          "aelf/options.proto",
          "google/protobuf/empty.proto",
          "google/protobuf/wrappers.proto",
          "Protobuf/reference/acs12.proto"
      ],
    
      messages: [
          ...events,
          ...states
      ],
    
      services: [
          {
              name,
              options: [
                  { key: "aelf.csharp_state", value: `"AElf.Contracts.${name}.${name}State"` },
                  { key: "aelf.base", value: `"Protobuf/reference/acs12.proto"` }
              ],
              methods: [
                  ...sendMethods,
                  ...viewMethods
              ]
          }
      ],
    
      options: {
          "csharp_namespace": `"AElf.Contracts.${name}"`
      }
    };


    return generateProtoFile(ast);
  }, [nodes, projectName, edges])
  
  return <CodeMirror value={value} height={height || "200px"} extensions={[StreamLanguage.define(protobuf)]} readOnly />
}

