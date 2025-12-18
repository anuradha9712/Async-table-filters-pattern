import * as React from "react";
import { Chip, LinkButton, Divider } from "@innovaccer/design-system";
import { SaveFilter } from "./SaveFilter";
import classNames from "classnames";

function usePrevious(value) {
  const ref = React.useRef({});
  React.useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export const HeaderFilters = ({
  filterList,
  updateFilterList,
  updateSelectedChipList,
  unselectedChipList,
  savedFilterList,
  updateSavedFilterList,
  setShowToast,
}) => {
  const [isOverflow, setIsOverflow] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  const [hideAnimation, setHideAnimation] = React.useState(false);
  const [hideChipIndex, setHideChipIndex] = React.useState(-1);
  const [isFilterAdded, setIsFilterAdded] = React.useState(false);
  const [isFilterRemoved, setIsFilterRemoved] = React.useState(false);

  const ref = React.useRef();
  const prevFilterList = usePrevious(filterList);

  React.useEffect(() => {
    if (ref.current) {
      setIsOverflow(ref.current.scrollWidth > ref.current.clientWidth);
    }
    if (Object.keys(filterList)?.length > Object.keys(prevFilterList)?.length) {
      setIsFilterAdded(true);
    }
  }, [filterList, prevFilterList]);

  const onChipClose = (filter) => {
    const newList = { ...filterList };
    delete newList[filter];

    const unselectedList = unselectedChipList.filter((item) => item !== filter);
    updateSelectedChipList(unselectedList);
    updateFilterList(newList);
  };

  const onChipClick = (filter) => {
    if (unselectedChipList.includes(filter)) {
      let newList = unselectedChipList.filter((item) => item !== filter);
      updateSelectedChipList(newList);
    } else {
      updateSelectedChipList([...unselectedChipList, filter]);
    }
  };

  const onAnimationEndHandler = (filter) => {
    if (hideAnimation) {
      onChipClose(filter);
      setHideAnimation(false);
    }
  };

  const onClearHandler = () => {
    updateFilterList({});
    setExpanded(false);
  };

  const wrapperClass = classNames({
    "Header-filters-row": !expanded,
    "d-flex flex-wrap flex-row": expanded,
  });

  const filterLength = Object.keys(filterList).length;

  const filterRowClass = classNames({
    "mt-4": filterLength > 0,
    "d-flex align-items-center": true,
    "Filter-row--expanded": expanded,
    "Filter-row--collapsed": !expanded,
    "Header-wrapper-slideDown": filterLength > 0,
    "Header-wrapper-slideUp": filterLength <= 0,
  });

  const groupActionClass = classNames({
    "d-flex align-items-center ": true,
    "Group-action-slide-right": isFilterAdded,
    "Group-action-slide-left": isFilterRemoved,
  });

  const buttonAnimationEndHandler = () => {
    setIsFilterAdded(false);
    setIsFilterRemoved(false);
  };

  return (
    <div className={filterRowClass}>
      <div className={wrapperClass} style={{ rowGap: "8px" }} ref={ref}>
        {Object.keys(filterList).map((filter, key) => {
          const selected = !unselectedChipList.includes(filter);
          const optionLength = filterList[filter].length;
          const filterType = typeof filterList[filter];

          const filterSeparator = filter?.replace("_", " ");

          const chipClass = classNames({
            "Selected-chip--hide": hideAnimation && hideChipIndex === key,
            "Selected-chip--show opacity-0": true,
            "mr-4": true,
          });

          if (optionLength === 0) {
            return null;
          }
          const label =
            optionLength > 2 && filterType !== "string"
              ? `${optionLength} selected`
              : filterList[filter].toString();
          return (
            <div
              className={chipClass}
              onAnimationEnd={() => onAnimationEndHandler(filter)}
            >
              <Chip
                key={key}
                onClick={() => onChipClick(filter)}
                onClose={() => {
                  setHideAnimation(true);
                  setHideChipIndex(key);
                }}
                label={label}
                type="selection"
                clearButton={true}
                selected={selected}
                labelPrefix={
                  filterSeparator.charAt(0).toUpperCase() +
                  filterSeparator.slice(1) +
                  ":"
                }
              />
            </div>
          );
        })}

        {Object.keys(filterList).length > 0 && expanded && (
          <div
            className={groupActionClass}
            onAnimationEnd={buttonAnimationEndHandler}
          >
            <LinkButton
              appearance="transparent"
              aria-label="Re-evaluate"
              onClick={() => setExpanded(false)}
              className={`mx-4 ${groupActionClass}`}
              subtle={true}
            >
              View less
            </LinkButton>

            <div className="border-left pl-4 d-flex align-items-center">
              <LinkButton
                appearance="transparent"
                aria-label="Re-evaluate"
                onClick={onClearHandler}
              >
                Clear filters
              </LinkButton>
              <SaveFilter
                filterList={filterList}
                savedFilterList={savedFilterList}
                updateSavedFilterList={updateSavedFilterList}
                setShowToast={setShowToast}
              />
            </div>
          </div>
        )}
      </div>

      {Object.keys(filterList).length > 0 && !expanded && (
        <div
          className={groupActionClass}
          onAnimationEnd={buttonAnimationEndHandler}
        >
          {isOverflow && (
            <>
              <Divider vertical={true} className="Chip-separator" />
              <Divider vertical={true} className="Chip-view-separator" />
              <LinkButton
                appearance="transparent"
                aria-label="View more"
                onClick={() => setExpanded(true)}
                className={`mx-4 ${groupActionClass}`}
                subtle={true}
              >
                {`View all ${Object.keys(filterList).length}`}
              </LinkButton>
            </>
          )}
          <div className="border-left pl-4 d-flex align-items-center">
            <LinkButton
              appearance="transparent"
              aria-label="Clear filters"
              onClick={onClearHandler}
              className={groupActionClass}
            >
              Clear filters
            </LinkButton>
            <SaveFilter
              filterList={filterList}
              savedFilterList={savedFilterList}
              updateSavedFilterList={updateSavedFilterList}
              setShowToast={setShowToast}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HeaderFilters;
