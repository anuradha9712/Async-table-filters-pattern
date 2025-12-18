import React from "react";
import {
  Icon,
  Label,
  Button,
  Dropdown,
  Subheading,
  Tooltip,
  Divider,
} from "@innovaccer/design-system";
import { staticFilterList, dynamicFilterList } from "./data";
import classNames from "classnames";
import "../style.css";

export const RightPanel = ({
  showVerticalFilters,
  onCloseHandler,
  filterList,
  loading,
  updateFilterList,
  setPinnedFilterList,
}) => {
  const [selectedFilterList, setSelectedFilterList] = React.useState([]);
  const [selectedOption, setSelectedOption] = React.useState({});
  const [pinnedFilters, setPinnedFilters] = React.useState([]);
  const [separator, setSeparator] = React.useState(false);
  const [creationDate, setCreationDate] = React.useState("");
  const [loader, setLoader] = React.useState(false);
  const ref = React.useRef();

  const getDisplayFilterList = React.useCallback(() => {
    let list = [];
    staticFilterList.forEach((filterItem) => {
      if (!pinnedFilters.includes(filterItem.optionKey)) {
        list.push(filterItem);
      }
    });

    return list;
  }, [pinnedFilters]);

  const getPinFilterList = React.useCallback(() => {
    let list = [];

    pinnedFilters?.forEach((pinItem) => {
      list.push(
        staticFilterList?.find(
          (filterItem) => filterItem.optionKey === pinItem,
        ),
      );
    });

    return list;
  }, [pinnedFilters]);

  const [displayFilterList, setDisplayFilterList] = React.useState(() =>
    getDisplayFilterList(),
  );
  const [pinnedFilterList, setPinFilterList] = React.useState(() =>
    getPinFilterList(),
  );

  React.useEffect(() => {
    setDisplayFilterList(getDisplayFilterList());
    setPinFilterList(getPinFilterList());
    setLoader(false);
  }, [pinnedFilters, getDisplayFilterList, getPinFilterList]);

  React.useEffect(() => {
    const list = [...pinnedFilterList, ...displayFilterList].slice(0, 3);
    setPinnedFilterList(list);
  }, [pinnedFilterList, displayFilterList, setPinnedFilterList]);

  React.useEffect(() => {
    setSelectedOption(filterList);
  }, [filterList]);

  React.useEffect(() => {
    if (ref.current) {
      // If filter options causes overflow stick the Apply buttons to bottom and show separator
      setSeparator(ref.current.scrollHeight > ref.current.clientHeight);
    }
  }, [selectedFilterList]);

  const onNewFilterAddition = (selected) => {
    const list = [];
    dynamicFilterList(loading).forEach((filterItem) => {
      if (selected.includes(filterItem.label)) {
        list.push(filterItem);
      }
    });
    setSelectedFilterList(list);
  };

  const removeDynamicFilter = (label, value) => {
    const newList = selectedFilterList.filter((filterOption) => {
      return filterOption.label !== label;
    });

    const updatedList = { ...filterList };
    delete updatedList[value];
    updateFilterList(updatedList);

    setSelectedFilterList(newList);
  };

  const pinnedFilterHandler = (optionKey) => {
    let pinnedList = [...pinnedFilters];
    if (pinnedFilters.includes(optionKey)) {
      pinnedList = pinnedList.filter((pinnedItem) => pinnedItem !== optionKey);
    } else {
      pinnedList.unshift(optionKey);
    }
    setPinnedFilters(pinnedList);
    setLoader(true);
  };

  const onFilterChangeHandler = (name, selected) => {
    const newSelectedOption = {
      ...selectedOption,
      [name]: selected,
    };
    setSelectedOption(newSelectedOption);
  };

  const onResetHandler = () => {
    setSelectedOption({});
    updateFilterList({});
  };

  const pinFilterClass = classNames({
    "Pin-filter-slide--up": true,
    "py-4": true,
  });

  return (
    <div
      ref={ref}
      className={`Table-filters Table-filters--vertical bg-secondary-lightest ${
        !showVerticalFilters
          ? " d-none Table-filters--close"
          : "Table-filters--open"
      }`}
    >
      <div className={`px-5 ${separator ? "Table-filters--scroll" : ""}`}>
        <div className="d-flex align-items-center justify-content-between pt-5 mb-6">
          <Subheading>Filters</Subheading>
          <Button
            icon="close"
            className="cursor-pointer"
            onClick={onCloseHandler}
          />
        </div>

        {pinnedFilterList.map((listItem, key) => {
          const { inlineLabel, optionKey, optionList } = listItem;
          return (
            <div className={pinFilterClass} key={listItem}>
              <div className="d-flex align-items-center mb-3">
                <Label>{inlineLabel}</Label>
                <Tooltip tooltip="Unpin" position="bottom-start">
                  <Icon
                    size={12}
                    name="push_pin"
                    appearance="accent1"
                    className="ml-3 cursor-pointer"
                    onClick={() => pinnedFilterHandler(optionKey)}
                  />
                </Tooltip>
              </div>
              <Dropdown
                disabled={loading}
                withCheckbox={true}
                showApplyButton={true}
                applyButtonLabel="Select"
                key={selectedOption[optionKey]}
                onChange={(selected) =>
                  onFilterChangeHandler(optionKey, selected)
                }
                options={optionList.map((optionItem) => {
                  optionItem.selected = selectedOption[optionKey]?.includes(
                    optionItem.value,
                  );
                  return optionItem;
                })}
              />
            </div>
          );
        })}

        {displayFilterList.map((listItem, key) => {
          const { inlineLabel, optionKey, optionList } = listItem;
          return (
            <div className="py-4" key={key}>
              <div className="d-flex align-items-center mb-3 FilterLabel">
                <Label>{inlineLabel}</Label>
                <Tooltip tooltip="Pin" position="bottom-start">
                  <Icon
                    size={12}
                    name="push_pin"
                    appearance="subtle"
                    className="ml-3 cursor-pointer FilterLabel-pinnedIcon"
                    onClick={() => pinnedFilterHandler(optionKey)}
                  />
                </Tooltip>
              </div>
              <Dropdown
                disabled={loading}
                withCheckbox={true}
                loading={loader}
                showApplyButton={true}
                applyButtonLabel="Select"
                key={selectedOption[optionKey]}
                onChange={(selected) =>
                  onFilterChangeHandler(optionKey, selected)
                }
                options={optionList.map((optionItem) => {
                  optionItem.selected = selectedOption[optionKey]?.includes(
                    optionItem.value,
                  );
                  return optionItem;
                })}
              />
            </div>
          );
        })}

        {selectedFilterList.length > 0 && (
          <div className="py-4">
            {selectedFilterList.map((filterOption, key) => {
              const { label, props, element, value } = filterOption;
              const Element = element;
              return (
                <div key={key}>
                  <div className="d-flex justify-content-between align-items-center">
                    <Label className="mb-3">{label}</Label>
                    <Button
                      icon="delete"
                      appearance="transparent"
                      size="tiny"
                      onClick={() => removeDynamicFilter(label, value)}
                    />
                  </div>
                  {Element && (
                    <Element
                      {...props}
                      date={
                        selectedOption[value]?.includes(creationDate)
                          ? creationDate
                          : ""
                      }
                      size="small"
                      onDateChange={(date, dateStr) => {
                        setCreationDate(dateStr);
                        onFilterChangeHandler(value, dateStr);
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {separator && <Divider />}

      <div className="px-5">
        <Dropdown
          className="mt-6"
          options={[{ label: "Creation date", value: "Creation date" }]}
          withSearch={true}
          placeholder="Select"
          withCheckbox={true}
          showApplyButton={true}
          applyButtonLabel="Add"
          onChange={onNewFilterAddition}
          customTrigger={() => (
            <Button
              className="w-100"
              appearance="transparent"
              icon="expand_more"
              iconAlign="right"
            >
              Add new filter
            </Button>
          )}
        />

        <div className="d-flex justify-content-between pt-4">
          <Button
            className="w-100 mr-5"
            onClick={onResetHandler}
            appearance="transparent"
            disabled={Object.keys(selectedOption).length === 0}
          >
            Reset values
          </Button>
          <Button
            className="w-100"
            onClick={() => updateFilterList(selectedOption)}
            disabled={selectedOption === filterList}
          >
            Apply filters
          </Button>
        </div>
      </div>
    </div>
  );
};
