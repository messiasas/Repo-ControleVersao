import PaxTable from "./pages/PaxTable.jsx"

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App(){
    return(
      <BrowserRouter>
        <Routes>
          
          {/* <PaxTable /> */}

          <Route path="/" element={<PaxTable />} />

          {/* <Route path="/equipamentos" element={<PaxTable />} />
          {/* <Route path="/chaves" element={<PaxTable />} />  */}
        </Routes> 
      </BrowserRouter>
      )
}

export default App;