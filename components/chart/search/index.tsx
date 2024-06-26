import ModuleInfo from '../moduleBlocks/ModuleInfo';
import { ChartType } from '../types';
import Textbox from './textbox';

export type SearchType = {
  value?: string;
  isValid: boolean;
  message?: string;
};

export default function Search({
  currentVersion,
  search,
  focusModule,
  setSearch,
  setShowSearch,
}: {
  currentVersion: ChartType;
  search: SearchType;
  focusModule: (name: string) => void;
  setSearch: (search: SearchType) => void;
  setShowSearch: (value: boolean) => void;
}) {
  return (
    <>
      <div
        className="floatingModulesSearchBoxCon"
        onClick={() => {
          setShowSearch(false);
          setSearch({ value: '', isValid: true, message: '' });
        }}
      ></div>
      <Textbox
        containerClassName="floatingModulesSearchBox"
        type="text"
        autoCompleteList={
          currentVersion &&
          currentVersion.nodes &&
          Object.keys(currentVersion.nodes).map((k) => {
            const m = currentVersion.nodes[k];
            return { "id": m.id, "name": m.title}
          })
        }
        maxLength={50}
        name="search"
        onChange={(targetValue) => {
          setSearch({ value: targetValue, isValid: true, message: '' });
        }}
        placeholder="Write node name"
        value={search.value}
        onListItemClick={focusModule}
      />
    </>
  );
}
