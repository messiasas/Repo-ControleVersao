import TransireTable from "./pages/TransireTable.jsx"

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App(){
    return(
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<TransireTable/>} />

        </Routes> 
      </BrowserRouter>
      )
}

export default App;