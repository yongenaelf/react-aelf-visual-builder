import { createContext, PropsWithChildren, useContext, useState } from 'react';

export const DnDContext = createContext<[string | null, React.Dispatch<React.SetStateAction<string | null>>]>([null, (_) => {}]);

export const DnDProvider = ({ children }: PropsWithChildren) => {
  const [type, setType] = useState<string | null>(null);

  return (
    <DnDContext.Provider value={[type, setType]}>
      {children}
    </DnDContext.Provider>
  );
}

export const useDnD = () => {
  return useContext(DnDContext);
}