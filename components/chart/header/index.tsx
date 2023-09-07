export default function Header({
  showModulesSearch,
}: {
  showModulesSearch: (state: boolean) => void;
}) {
  return (
    <div className="designerHeader">
      <div className="botNameCon">Rendering chart name</div>
      <div className="search-btn">
        <button type="button" onClick={() => showModulesSearch(true)}>
          <i className="flow-search"></i>{' '}
          <span className="translate">Search Node</span>
        </button>
      </div>
    </div>
  );
}
