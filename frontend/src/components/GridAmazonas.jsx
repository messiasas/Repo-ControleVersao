// import "../styles/gridAmazonas.css";
import "../styles/global.css"
import "../styles/variables.css"
import VersionGridAmazonas from "../components/VersionGridAmazonas.jsx";


import { useRef } from "react";
export default function Grid({data, selectedRow,setSelectedRow }) {

    const gridRef = useRef();

    return (
        <div className="dadcontainer">

            <div className="table-container">
            <VersionGridAmazonas
                data={data}
                selectedRow={selectedRow}
                setSelectedRow={setSelectedRow}
                gridRef={gridRef}
            />
            </div>

        </div>
  );
}