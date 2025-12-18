import React from "react";
import { Button, Dropdown } from "@innovaccer/design-system";

export const HeaderButton = ({
  loading,
  filterList,
  onFilterChange,
  toggleVerticalFilter,
  showVerticalFilters,
  pinnedFilterList,
}) => {
  const headerClass = showVerticalFilters
    ? "Header-filters--hide"
    : "Header-filters--show";

  const [loader, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 100);
  }, [pinnedFilterList]);

  return (
    <div className={headerClass} id="header-quick-filters">
      <div className="d-flex align-items-center">
        {pinnedFilterList.map((filterItem, key) => {
          const { inlineLabel, optionKey, optionList } = filterItem;
          return (
            <React.Fragment key={key}>
              <Dropdown
                disabled={loading}
                className={key !== 0 ? "ml-4" : ""}
                loading={loader}
                withCheckbox={true}
                showApplyButton={true}
                inlineLabel={inlineLabel}
                key={filterList[optionKey]}
                onChange={(selected) => onFilterChange(optionKey, selected)}
                options={optionList.map((optionItem) => {
                  optionItem.selected = filterList[optionKey]?.includes(
                    optionItem.value,
                  );
                  return optionItem;
                })}
              />
            </React.Fragment>
          );
        })}
        <Button icon="add" className="mx-4" onClick={toggleVerticalFilter}>
          More Filters
        </Button>
      </div>
    </div>
  );
};
