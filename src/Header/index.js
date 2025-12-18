import React from "react";
import { Button, Tooltip } from "@innovaccer/design-system";
import HeaderFilters from "./HeaderFilters";
import { HeaderSearch } from "./HeaderSearch";
import { HeaderButton } from "./HeaderButton";
import { SavedFilterView } from "./SavedFilterView";
import classNames from "classnames";
import "../style.css";

export const Header = (props) => {
  const { showVerticalFilters } = props;
  const [savedFilterList, setSavedFilterList] = React.useState([]);
  const [openSidesheet, setOpenSidesheet] = React.useState(false);

  const filterBtnClass = classNames({
    "Filter-btn-slide--left": showVerticalFilters,
    "Filter-btn-slide--right": !showVerticalFilters,
  });

  return (
    <div>
      <div className="d-flex w-50 Header-wrapper">
        <HeaderSearch updateSearchTerm={props.updateSearchTerm} />
        <HeaderButton {...props} />
        {savedFilterList.length === 0 ? (
          <Tooltip tooltip="No saved filter views">
            <Button
              icon="list"
              onClick={() => setOpenSidesheet(true)}
              disabled={true}
              className={filterBtnClass}
            >
              Filter views
            </Button>
          </Tooltip>
        ) : (
          <Button
            icon="list"
            onClick={() => setOpenSidesheet(true)}
            className={filterBtnClass}
          >
            Filter views
          </Button>
        )}
      </div>
      <HeaderFilters
        {...props}
        savedFilterList={savedFilterList}
        updateSavedFilterList={setSavedFilterList}
      />
      {openSidesheet && (
        <SavedFilterView
          openSidesheet={openSidesheet}
          savedFilterList={savedFilterList}
          onClose={() => setOpenSidesheet(false)}
          updateSavedFilterList={setSavedFilterList}
          updateFilterList={props.updateFilterList}
        />
      )}
    </div>
  );
};
