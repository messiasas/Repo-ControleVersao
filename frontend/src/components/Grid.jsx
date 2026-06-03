import "../styles/grid.css";
import "../styles/global.css"
import "../styles/variables.css"
import VersionGrid from "../components/VersionGrid.jsx";


import { useRef } from "react";
export default function Grid({data, selectedRow,setSelectedRow }) {

    const gridRef = useRef();

    return (
        <div className="dadcontainer">

            <div className="table-container">
            <VersionGrid
                data={data}
                selectedRow={selectedRow}
                setSelectedRow={setSelectedRow}
                gridRef={gridRef}
            />
            </div>

        </div>
  );
}