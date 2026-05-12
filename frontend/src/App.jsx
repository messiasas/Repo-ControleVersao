import PaxTable from "./pages/PaxTable.jsx"
import Home from "./pages/Home.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App(){
    return(
      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={<Home />} />

          <Route path="/equipamentos" element={<PaxTable />} />
          {/* <Route path="/chaves" element={<PaxTable />} />  */}
        </Routes>
      </BrowserRouter>
      )
}

export default App;