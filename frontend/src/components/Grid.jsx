import "../styles/grid.css";
import VersionGrid from "./VersionGrid.jsx";
import { useRef } from "react";

export default function Grid({ data, selectedRow, setSelectedRow, theme = "transire" }) {
  const gridRef = useRef();

  return (
    <div className="dadcontainer">
      <div className="table-container">
        <VersionGrid
          data={data}
          selectedRow={selectedRow}
          setSelectedRow={setSelectedRow}
          gridRef={gridRef}
          theme={theme}
        />
      </div>
    </div>
  );
}
