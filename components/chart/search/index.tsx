export type SearchType = {
  value?: string;
  isValid: boolean;
  message?: string;
};

export default function Search({
  currentVersion,
  search,
  focusModule,
  setSearch
}: {
  currentVersion: any;
  search: SearchType;
  focusModule: (name: string) => void;
  setSearch: (search: SearchType) => void;
}) {
  return (
    <>
      <div
        className="floatingModulesSearchBoxCon"
        onClick={() =>
          this.setState({
            showSearch: false,
            search: { value: '', isValid: true, message: '' },
          })
        }
      ></div>
      {/* <Textbox
        containerClassName="floatingModulesSearchBox"
        autoCompleteList={
          currentVersion &&
          currentVersion.nodes &&
          Object.keys(currentVersion.nodes).map((k) => {
            let m = currentVersion.nodes[k];
            return (
              'Action ' +
              m.id +
              ' > ' +
              (m.name || ModuleInfo.getModuleName(m.type))
            );
          })
        }
        maxLength={50}
        name="search"
        onChange={(targetValue) => {
          this.setState({
            search: { value: targetValue, isValid: true, message: '' },
          });
        }}
        placeholder="Write node name"
        showFilledEffect={true}
        value={search.value}
        searchbox={true}
        onListItemClick={focusModule}
        fullAutocomplete={true}
        needSpecialCharacter={false}
        autoFocus
      /> */}
    </>
  );
}
