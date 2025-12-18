import React from "react";
import { List, Card, Text, Sidesheet } from "@innovaccer/design-system";
import "../../style.css";
import { getDisplayDate } from "./utils";
import { ContextMenu } from "./ContextMenu";

export const SavedFilterView = ({
  openSidesheet,
  onClose,
  savedFilterList,
  updateSavedFilterList,
  updateFilterList,
}) => {
  const headerOptions = {
    heading: "Saved filter views",
  };

  const options = {
    open: openSidesheet,
    onClose,
    headerOptions,
    backdropClose: false,
  };

  const applyFilterHandler = (filterItem) => {
    updateFilterList(filterItem.filterList, true);
    onClose();
  };

  const customCellRenderer = (props) => {
    const { modified_date, created_date } = props.data;
    const { displayDate } = getDisplayDate(modified_date);
    return (
      <div className="d-flex align-items-center justify-content-end flex-grow-1">
        <Text appearance="subtle" className="mr-5">
          {modified_date === created_date ? "created" : "modified"}{" "}
          {displayDate}
        </Text>
        <ContextMenu
          filterItem={props?.data}
          savedFilterList={savedFilterList}
          updateSavedFilterList={updateSavedFilterList}
        />
      </div>
    );
  };

  const schema = [
    {
      name: "filterName",
      displayName: "filterName",
      width: "70%",
      cellType: "WITH_META_LIST",
      sorting: false,
      translate: (data) => ({
        title: data.filterName,
        metaList: [`${data.filterDesc}`],
      }),
    },
    {
      name: "filterDesc",
      displayName: "filterDesc",
      cellType: "DEFAULT",
      width: "30%",
      sorting: false,
      align: "right",
      cellRenderer: customCellRenderer,
    },
  ];

  return (
    <div>
      <Sidesheet {...options}>
        <Card shadow="none" className="mt-5">
          <List
            className="Filter-list"
            key={savedFilterList}
            pageSize={5}
            type="resource"
            schema={schema}
            showMenu={false}
            withHeader={true}
            separator={false}
            withPagination={true}
            data={savedFilterList}
            loading={!options.open}
            onRowClick={applyFilterHandler}
            headerOptions={{
              withSearch: true,
              dynamicColumn: false,
            }}
            onSearch={(currData, searchTerm) => {
              return currData.filter((d) =>
                d.filterName.toLowerCase().match(searchTerm.toLowerCase())
              );
            }}
          />
        </Card>
      </Sidesheet>
    </div>
  );
};
