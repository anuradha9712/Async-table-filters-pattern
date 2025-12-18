import React from "react";
import "@innovaccer/design-system/css/dist/index.css";
import { Table } from "./Table";
import { originalData } from "./data";
import { getFilterList, filterData, sortData } from "./utility";

const App = () => {
  const schema = [
    {
      name: "name",
      displayName: "Name",
      resizable: true,
      separator: true,
      tooltip: true,
      translate: (a) => ({
        title: `${a.firstName} ${a.lastName}`,
        firstName: a.firstName,
        lastName: a.lastName,
      }),
      cellType: "AVATAR_WITH_TEXT",
      width: "15%",
    },
    {
      name: "email",
      displayName: "Email",
      resizable: true,
      sorting: false,
      cellType: "WITH_META_LIST",
      width: "20%",
    },
    {
      name: "gender",
      displayName: "Gender",
      resizable: true,
      comparator: (a, b) => a.gender.localeCompare(b.gender),
      cellType: "STATUS_HINT",
      width: "10%",
      translate: (a) => ({
        title: a.gender,
        statusAppearance: a.gender === "Female" ? "alert" : "success",
      }),
    },
    {
      name: "type",
      displayName: "Type",
      sorting: false,
      cellType: "DEFAULT",
      width: "15%",
    },
    {
      name: "status",
      displayName: "Status",
      sorting: false,
      resizable: true,
      comparator: (a, b) => a.status.localeCompare(b.status),
      cellType: "STATUS_HINT",
      width: "15%",
      translate: (a) => ({
        title: a.status,
        statusAppearance: a.status === "Failed" ? "alert" : "success",
      }),
    },
    {
      name: "department",
      displayName: "Department",
      sorting: false,
      cellType: "DEFAULT",
      width: "15%",
    },
    {
      name: "priority",
      displayName: "Priority",
      sorting: false,
      cellType: "DEFAULT",
      width: "10%",
    },
  ];

  const fetchData = (options) => {
    const {
      page,
      pageSize,
      sortingList,
      filterList,
      searchTerm,
      unselectedChipList,
    } = options;

    const onSearch = (d, searchTerm = "") => {
      return (
        d.firstName.toLowerCase().match(searchTerm.toLowerCase()) ||
        d.lastName.toLowerCase().match(searchTerm.toLowerCase())
      );
    };

    const data = originalData;
    const updatedFilterList = getFilterList(filterList, unselectedChipList);

    const filteredData = filterData(
      data,
      updatedFilterList,
      unselectedChipList
    );
    const searchedData = filteredData.filter((d) => onSearch(d, searchTerm));
    const sortedData = sortData(schema, searchedData, sortingList);

    if (page && pageSize) {
      return new Promise((resolve) => {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        const slicedData = sortedData.slice(start, end);
        resolve({
          searchTerm,
          schema,
          count: sortedData.length,
          data: slicedData,
        });
      });
    }

    return new Promise((resolve) => {
      resolve({
        searchTerm,
        schema,
        count: sortedData.length,
        data: sortedData,
      });
    });
  };

  const loaderSchema = schema.filter((s) => {
    const { name, displayName, width, separator, cellType, cellRenderer } = s;
    return {
      name,
      displayName,
      width,
      separator,
      cellType,
      cellRenderer,
    };
  });

  return (
    <div>
      <Table loaderSchema={loaderSchema} fetchData={fetchData} />
    </div>
  );
};

export default App;
