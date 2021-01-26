import { Sidebar } from "components/nav";
import { BrowserRouter as Router } from "react-router-dom";
import Player from "./components/player";
import Routes from "routes";

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar className={"sidebar--static"} />
        <Routes />
      </div>
      <Player />
    </Router>
  );
}

export default App;
