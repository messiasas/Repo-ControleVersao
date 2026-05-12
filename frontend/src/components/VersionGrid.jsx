import "../styles/grid.css";
import { AgGridReact } from 'ag-grid-react';
import { useEffect, useRef } from "react";

import {
  ModuleRegistry,
  AllCommunityModule
} from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

function VersionGrid({ data }) {

  const columns = [
    { field: "empresa", filter: true },
    { field: "equipamento", filter: true },
    { field: "modelo", filter: true },

    { field: "versao_so", headerName: "Versão SO", filter: true },
    { field: "firmware", filter: true },
    { field: "puk_crc", headerName: "PUK/CRC", filter: true },

    { field: "aplicacao", headerName: "Aplicação", filter: true },
    { field: "versao_app", headerName: "Versão app", filter: true },
    { field: "versao_bt", headerName: "Versão BT", filter: true },

    { field: "versao_wifi", headerName: "Wi-Fi", filter: true },
    { field: "versao_gprs", headerName: "GPRS", filter: true },
    { field: "possui_logo", headerName: "Possui logo", filter: true },

    { field: "chaves", headerName: "Chaves", filter: true },
    { field: "qtd_chaves", headerName: "Qtd Chaves", filter: true },
    { field: "configurador", headerName: "Configurador", filter: true },

    { field: "fonte", headerName: "Fonte", filter: true },
    { field: "tipo_chaves", headerName: "Tipo chave", filter: true },

  ];

  return (
    <div
      className="ag-theme-quartz"
      style={{ height: 600, width: '100%' }}>
        <AgGridReact
        rowData={data}
        columnDefs={columns}

        rowSelection="multiple"

        pagination={true}

        animateRows={true}

        defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            minWidth: 160,
        }}
        />
    </div>
  );
}

export default VersionGrid;