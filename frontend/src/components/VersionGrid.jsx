import "../styles/grid.css";
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

const columns = [
  { field: "empresa",    rowGroup: true, hide: true },
  { field: "modelo",     rowGroup: true, hide: true },
  { field: "equipamento", filter: true },
  { field: "versao_so",  headerName: "Versão SO",    filter: true },
  { field: "firmware",                                filter: true },
  { field: "puk_crc",    headerName: "PUK/CRC",      filter: true },
  { field: "aplicacao",  headerName: "Aplicação",    filter: true },
  { field: "versao_app", headerName: "Versão app",   filter: true },
  { field: "versao_bt",  headerName: "Versão BT",    filter: true },
  { field: "versao_wifi", headerName: "Wi-Fi",       filter: true },
  { field: "versao_gprs", headerName: "GPRS",        filter: true },
  {
    field: "possui_logo",
    headerName: "Possui logo",
    filter: true,
    valueFormatter: (p) => {
      const v = String(p.value ?? "").toUpperCase();
      return (v === "SIM" || v === "1" || v === "TRUE") ? "SIM" : "NÃO";
    },
  },
  { field: "chaves",       headerName: "Chaves",      filter: true },
  { field: "qtd_chaves",   headerName: "Qtd Chaves",  filter: true },
  { field: "configurador", headerName: "Configurador", filter: true },
  { field: "fonte",        headerName: "Fonte",        filter: true },
  { field: "tipo_chaves",  headerName: "Tipo chave",  filter: true },
];

const autoGroupColumnDef = {
  headerName: "Empresa / Modelo",
  minWidth: 260,
  cellRendererParams: { suppressCount: false },
};

const localeText = {
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
  previous: "Anterior",
  group: "Grupo",
  rowGroupColumnsEmptyMessage: "Arraste colunas aqui para agrupar",
};

function VersionGrid({ data, selectedRow, setSelectedRow, gridRef, theme = "transire" }) {
  const themeClass = theme === "amazonas"
    ? "ag-theme-quartz ag-theme-quartz-amazonas"
    : "ag-theme-quartz";

  return (
    <div className={themeClass} style={{ height: 600, width: '100%' }}>
      <AgGridReact
        ref={gridRef}
        rowData={data}
        localeText={localeText}
        columnDefs={columns}
        autoGroupColumnDef={autoGroupColumnDef}
        groupDisplayType="singleColumn"
        groupDefaultExpanded={0}
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
          if (event.node.group) return;
          const alreadySelected = selectedRow?.id === event.data.id;
          if (alreadySelected) {
            event.node.setSelected(false);
            setSelectedRow(null);
          } else {
            event.node.setSelected(true);
            setSelectedRow(event.data);
          }
        }}
      />
    </div>
  );
}

export default VersionGrid;
