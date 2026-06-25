import "../styles/grid.css";
import { AgGridReact } from 'ag-grid-react';
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

function AppNomeCell({ data }) {
  const apps = data?.aplicacoes;

  if (!apps || apps.length === 0) return <span>—</span>;

  if (apps.length === 1) return <span>{apps[0].nome || "—"}</span>;

  function handleVer() {
    localStorage.setItem("selectedVersion", JSON.stringify(data));
    window.open("/version-view", "_blank");
  }

  return (
    <button className="ver-apps-btn" onClick={handleVer}>
      Ver ({apps.length})
    </button>
  );
}

const columns = [
  { field: "empresa",    rowGroup: true, headerName: "Empresa", filter: true, minWidth: 200 },
  { field: "equipamento", filter: true, minWidth: 200 },
  { field: "modelo",     rowGroup: true, headerName: "Modelo", filter: true, minWidth: 180 },
  
  { field: "versao_so",  headerName: "Versão SO",    filter: true, minWidth: 400 },
  { field: "firmware",                                filter: true,minWidth: 400 },
  { field: "puk_crc",    headerName: "PUK/CRC",      filter: true, minWidth: 300 },
  {
    field: "aplicacoes",
    headerName: "Aplicação",
    cellRenderer: AppNomeCell,
    valueGetter: (p) => (p.data?.aplicacoes || []).map((a) => a.nome).filter(Boolean).join(", "),
    minWidth: 300,
  },
  {
    field: "aplicacoes_versao",
    headerName: "Versão APP",
    filter: true,
    valueGetter: (p) => (p.data?.aplicacoes || []).map((a) => a.versao).filter(Boolean).join(", "),
  },
  { field: "versao_bt",  headerName: "Versão BT",    filter: true, minWidth: 300 },
  { field: "versao_wifi", headerName: "Wi-Fi",       filter: true, minWidth: 300 },
  { field: "versao_gprs", headerName: "GPRS",        filter: true , minWidth: 300},
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
  {
    field: "createdAt",
    headerName: "Data",
    filter: "agDateColumnFilter",
    valueFormatter: (p) => {
      if (!p.value) return "—";
      const d = new Date(p.value);
      return d.toLocaleDateString("pt-BR");
    },
  },
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
