import { Outlet } from "react-router-dom";

import Header from "./ui/layout/Header/Header";
import Main from "./ui/layout/Main/Main";

function App() {
  return (
    <div className="app">
      <Header />
      <Main>
        <Outlet />
      </Main>
    </div>
  );
}

export default App;
