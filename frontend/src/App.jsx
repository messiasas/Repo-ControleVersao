import TransireTable from "./pages/TransireTable.jsx"
import VersionView from "./pages/VersionView.jsx"

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App(){
    return(
      <BrowserRouter>
        <Routes>

        <Route path="/" element={<TransireTable/>} />
        <Route path="/" element={<TransireTable />} />
        <Route path="/version-view" element={<VersionView />} />

        </Routes> 
      </BrowserRouter>
      )
}

export default App;