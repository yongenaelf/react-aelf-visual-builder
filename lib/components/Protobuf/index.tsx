import { generateProtoFile, ProtoFile } from '@yongenaelf/protobuf-generator-ts';
import CodeMirror from '@uiw/react-codemirror';
import { protobuf } from "@codemirror/legacy-modes/mode/protobuf";
import { StreamLanguage } from "@codemirror/language";
import { AppState } from '../Store/types';
import { useShallow } from 'zustand/react/shallow';
import useStore from '../Store';
import { useMemo } from 'react';
import camelCase from 'camelcase';

const selector = (state: AppState) => ({
  nodes: state.nodes,
  edges: state.edges,
  projectName: state.projectName,
});

export function Protobuf({height}: {height?: string}) {
  const { nodes, edges, projectName } = useStore(
    useShallow(selector),
  );

  const value = useMemo(() => {

    const name = camelCase(projectName, {pascalCase: true}) || "HelloWorld";

    const viewMethods = nodes.filter(node => node.type === 'ViewFunctionNode').map(node => ({
        name: String(node.data.text || node.id),
        inputType: "google.protobuf.Empty",
        outputType: String(nodes.find(node => edges.find(edge => edge.source === node.id)?.target)?.data.text || "google.protobuf.StringValue"),
        options: [
            { key: "aelf.is_view", value: "true" }
        ]
    }));

    const sendMethods = nodes.filter(node => node.type === 'SendFunctionNode').map(node => ({
        name: String(node.data.text || node.id),
        inputType: "google.protobuf.StringValue",
        outputType: "google.protobuf.Empty"
    }));

    const events = nodes.filter(node => node.type === 'EventNode').map(node => ({
        name: String(node.data.text || node.id),
        fields: [
            { name: "value", type: "string", id: 1 }
        ],
        options: {
            "aelf.is_event": "true",
        }
    }));

    const states = nodes.filter(node => node.type === 'StateNode').map(node => ({
        name: String(node.data.text || node.id),
        fields: edges.filter(edge => edge.target === node.id).map(edge => nodes.find(node => node.id === edge.source)).map((node, id) => ({
            name: String(node?.data.text || node?.id),
            type: String(node?.data.type).toLowerCase(),
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

