const onFilterChangeHandler = {
  name: (a, filters) => {
    for (const filter of filters) {
      switch (filter) {
        case "a-g":
          if (
            a.firstName[0].toLowerCase() >= "a" &&
            a.firstName[0].toLowerCase() <= "g"
          )
            return true;
          break;
        case "h-r":
          if (
            a.firstName[0].toLowerCase() >= "h" &&
            a.firstName[0].toLowerCase() <= "r"
          )
            return true;
          break;
        case "s-z":
          if (
            a.firstName[0].toLowerCase() >= "s" &&
            a.firstName[0].toLowerCase() <= "z"
          )
            return true;
          break;
        default:
          return true;
      }
    }
    return false;
  },
  gender: (a, filters) => {
    for (const filter of filters) {
      if (a.gender.toLowerCase() === filter) return true;
    }
    return false;
  },
  type: (a, filters) => {
    for (const filter of filters) {
      if (a.type === filter) return true;
    }
    return false;
  },
  status: (a, filters) => {
    for (const filter of filters) {
      if (a.status === filter) return true;
    }
    return false;
  },
  department: (a, filters) => {
    for (const filter of filters) {
      if (a.department === filter) return true;
    }
    return false;
  },
  priority: (a, filters) => {
    for (const filter of filters) {
      if (a.priority === filter) return true;
    }
    return false;
  },
  creation_date: (a, filters) => {
    if (a.creation_date === filters || filters === "") {
      return true;
    }
    return false;
  },
};

const translateData = (schema, data) => {
  let newData = data;

  if (schema.translate) {
    const translatedData = schema.translate(data);
    newData = {
      ...newData,
      [schema.name]:
        typeof translatedData === "object"
          ? {
              ...newData[schema.name],
              ...translatedData,
            }
          : translatedData,
    };
  }
  if (typeof newData[schema.name] !== "object")
    newData[schema.name] = { title: newData[schema.name] };

  return newData;
};

export const filterData = (data, filterList) => {
  let filteredData = data;
  if (filterList) {
    Object.keys(filterList).forEach((name) => {
      const filters = filterList[name];
      const onChange = onFilterChangeHandler[name];
      if (onChange) {
        filteredData = filteredData.filter((d) => onChange(d, filters));
      }
    });
  }

  return filteredData;
};

export const sortData = (schema, data, sortingList) => {
  const sortedData = [...data];
  sortingList.forEach((l) => {
    const sIndex = schema.findIndex((s) => s.name === l.name);
    if (sIndex !== -1) {
      const defaultComparator = (a, b) => {
        const aData = translateData(schema[sIndex], a);
        const bData = translateData(schema[sIndex], b);
        return aData[l.name].title.localeCompare(bData[l.name].title);
      };

      const { comparator = defaultComparator } = schema[sIndex];

      sortedData.sort(comparator);
      if (l.type === "desc") sortedData.reverse();
    }
  });

  return sortedData;
};

export const getFilterList = (filterList, unselectedChipList = []) => {
  const newList = { ...filterList };
  for (let i = 0; i < unselectedChipList.length; i++) {
    delete newList[unselectedChipList[i]];
  }
  return newList;
};

export const getSelectAll = (data) => {
  if (data.length) {
    const anyUnSelected = data.some((d) => !d._selected);
    const allUnSelected = data.every((d) => !d._selected);

    const indeterminate = data.length >= 0 && anyUnSelected && !allUnSelected;
    const checked = !indeterminate && !allUnSelected;

    return { indeterminate, checked };
  }
  return { indeterminate: false, checked: false };
};

export const updateBatchData = (data, rowIndexes, dataUpdate) => {
  const updatedData = [...data];
  for (const rowIndex of rowIndexes) {
    updatedData[rowIndex] = {
      ...updatedData[rowIndex],
      ...dataUpdate,
    };
  }

  return updatedData;
};

export const getTotalPages = (totalRecords, pageSize) =>
  Math.ceil(totalRecords / pageSize);
