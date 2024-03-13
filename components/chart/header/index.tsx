export default function Header({
  showModulesSearch,
  chartName,
}: {
  showModulesSearch: (state: boolean) => void;
  chartName: string;
}) {
  return (
    <div className="header">
      <div className="chartName">{chartName}</div>
      <div className="search-btn">
        <button type="button" onClick={() => showModulesSearch(true)}>
          <i className="flaticon-magnifying-glass"></i>{' '}
          <span className="translate">Search Nodes</span>
        </button>
      </div>
    </div>
  );
}
