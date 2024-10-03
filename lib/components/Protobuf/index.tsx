import { generateProtoFile, ProtoFile } from '@yongenaelf/protobuf-generator-ts';
import CodeMirror from '@uiw/react-codemirror';
import { protobuf } from "@codemirror/legacy-modes/mode/protobuf";
import { StreamLanguage } from "@codemirror/language";
import { AppState } from '../Flow/types';
import { useShallow } from 'zustand/react/shallow';
import useStore from '../Flow/store';
import { useMemo } from 'react';

const selector = (state: AppState) => ({
  nodes: state.nodes,
});

export function Protobuf({height}: {height?: string}) {
  const { nodes } = useStore(
    useShallow(selector),
  );

  const value = useMemo(() => {

    const viewMethods = nodes.filter(node => node.type === 'ViewFunctionNode').map(node => ({
        name: String(node.data.text || node.id),
        inputType: "google.protobuf.Empty",
        outputType: "google.protobuf.StringValue",
        options: [
            { key: "aelf.is_view", value: "true" }
        ]
    }));

    const sendMethods = nodes.filter(node => node.type === 'SendFunctionNode').map(node => ({
        name: String(node.data.text || node.id),
        inputType: "google.protobuf.StringValue",
        outputType: "google.protobuf.Empty"
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
          {
              name: "UpdatedMessage",
              fields: [
                  { name: "value", type: "string", id: 1 }
              ],
              options: {
                  "aelf.is_event": "true",
              }
          }
      ],
    
      services: [
          {
              name: "HelloWorld",
              options: [
                  { key: "aelf.csharp_state", value: `"AElf.Contracts.HelloWorld.HelloWorldState"` },
                  { key: "aelf.base", value: `"Protobuf/reference/acs12.proto"` }
              ],
              methods: [
                  ...sendMethods,
                  ...viewMethods
              ]
          }
      ],
    
      options: {
          "csharp_namespace": `"AElf.Contracts.HelloWorld"`
      }
    };


    return generateProtoFile(ast);
  }, [nodes])
  
  

  return <CodeMirror value={value} height={height || "200px"} extensions={[StreamLanguage.define(protobuf)]} />
}

