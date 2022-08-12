import { Reddit } from "@mui/icons-material";
import { Admin, ListGuesser, Resource } from "react-admin";
import { authProvider } from "./auth";

const App = () => {
  return <Admin authProvider={authProvider}>hello</Admin>;
};

export default App;
