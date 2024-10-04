import { useShallow } from "zustand/react/shallow";
import useStore from "../Store";
import { AppState } from "../Store/types";

const selector = (state: AppState) => ({
  projectName: state.projectName,
  setProjectName: state.setProjectName,
});

export const ProjectName = () => {
  const { projectName, setProjectName } = useStore(
    useShallow(selector),
  );

  return <label>
    Project Name:
    <input
      type="text"
      value={projectName}
      onChange={(e) => setProjectName(e.target.value)} />
  </label>
}