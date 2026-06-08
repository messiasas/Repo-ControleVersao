import TransireTable from "./pages/TransireTable.jsx"
import VersionView from "./pages/VersionView.jsx"
import Login from "./pages/Login";
import Admin from "./pages/admin.jsx"

import { BrowserRouter, Routes, Route } from "react-router-dom";

function App(){
    return(
      <BrowserRouter>
        <Routes>

        <Route path="/" element={<TransireTable/>} />
        <Route path="/version-view" element={<VersionView />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />


        </Routes> 
      </BrowserRouter>
      )
}

export default App;