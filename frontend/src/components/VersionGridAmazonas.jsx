import "../styles/gridAmazonas.css";
import { AgGridReact } from 'ag-grid-react';

import {
  ModuleRegistry,
  AllCommunityModule
} from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

function VersionGridAmazonas({ data= {data}, selectedRow={selectedRow},  setSelectedRow={setSelectedRow}, gridRef={gridRef} }) {


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
      className="ag-theme-quartz ag-theme-quartz-amazonas"
      style={{ height: 600, width: '100%' }}>

      <AgGridReact

        ref={gridRef}
        rowData={data}

        localeText={{
          contains: "Contém",
          notContains: "Não contém",
          equals: "Igual",
          notEqual: "Diferente",
          startsWith: "Começa com",
          endsWith: "Termina com",
          blank: "Vazio",
          notBlank: "Preenchido",

          filterOoo: "Filtrar...",
          searchOoo: "Pesquisar...",

          noRowsToShow: "Nenhum registro encontrado",

          page: "Página",
          more: "Mais",
          to: "até",
          of: "de",
          next: "Próxima",
          last: "Última",
          first: "Primeira",
          previous: "Anterior"
        }}

        columnDefs={columns}
        rowSelection="single"
        pagination={true}
        animateRows={true}

        defaultColDef={{
            sortable: true,
            filter: true,
            resizable: true,
            flex: 1,
            minWidth: 160,
        }} 

        onRowClicked={(event) => {

        const alreadySelected = (
          selectedRow?.empresa === event.data.empresa
        );

        if(alreadySelected){

          event.node.setSelected(false);

          setSelectedRow(null);

          console.log("Seleção removida");

        }else{

          event.node.setSelected(true);

          setSelectedRow(event.data);

          console.log("Linha selecionada:");
          console.log(event.data);

        }

        }}>

      </AgGridReact>
      
    </div>
  );
}

export default VersionGridAmazonas;