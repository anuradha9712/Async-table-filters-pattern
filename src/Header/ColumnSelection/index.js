import React from "react";
import { DraggableDropdown } from "./DraggableDropdown";
import {
  Button,
  Checkbox,
  Label,
  PlaceholderParagraph,
  Placeholder,
} from "@innovaccer/design-system";

export const ColumnSelection = (props) => {
  const {
    loading,
    error,
    data,
    schema,
    showHead,
    withPagination,
    page,
    pageSize,
    withCheckbox,
    updateSchema,
    totalRecords = 0,
    onSelectAll,
    selectAll,
    allowSelectAll,
  } = props;

  const [selectAllRecords, setSelectAllRecords] = React.useState(false);

  React.useEffect(() => {
    if (selectAll && selectAll.checked) {
      if (onSelectAll) onSelectAll(true, selectAllRecords);
    }
  }, [selectAllRecords, onSelectAll, selectAll]);

  React.useEffect(() => {
    if (selectAll && !selectAll.checked) setSelectAllRecords(false);
  }, [selectAll]);

  const columnOptions = schema?.map((s) => ({
    label: s.displayName,
    value: s.name,
    selected: !s.hidden,
  }));

  const onDynamicColumnUpdate = (options) => {
    const newSchema = options?.map((option) => ({
      ...schema.find((colSchema) => colSchema.name === option.value),
      hidden: !option.selected,
    }));

    if (updateSchema) updateSchema(newSchema);
  };

  const getPluralSuffix = (count) => (count > 1 ? "s" : "");

  const selectedCount = data?.filter((d) => d._selected).length;
  const startIndex = (page - 1) * pageSize + 1;
  const endIndex = Math.min(page * pageSize, totalRecords);
  const label = error
    ? `Showing 0 items`
    : withCheckbox && selectedCount
    ? selectAllRecords
      ? `Selected all ${totalRecords} item${getPluralSuffix(totalRecords)}`
      : `Selected ${selectedCount} item${getPluralSuffix(
          totalRecords,
        )} on this page`
    : withPagination
    ? `Showing ${startIndex}-${endIndex} of ${totalRecords} item${getPluralSuffix(
        totalRecords,
      )}`
    : `Showing ${totalRecords} item${getPluralSuffix(totalRecords)}`;

  return (
    <div className="d-flex mt-4 justify-content-center align-items-center">
      <div className="flex-grow-1">
        {showHead && !loading && (
          <Checkbox
            {...selectAll}
            onChange={(event) => {
              if (onSelectAll) onSelectAll(event.target?.checked);
            }}
          />
        )}
        {loading ? (
          <Placeholder withImage={!showHead && withCheckbox}>
            <PlaceholderParagraph length={"small"} size={"s"} />
          </Placeholder>
        ) : (
          <div>
            <Label>{label}</Label>
            {withPagination && selectAll?.checked && allowSelectAll && (
              <div className="ml-4">
                {!selectAllRecords ? (
                  <Button size="tiny" onClick={() => setSelectAllRecords(true)}>
                    {`Select all ${totalRecords} items`}
                  </Button>
                ) : (
                  <Button
                    size="tiny"
                    onClick={() => setSelectAllRecords(false)}
                  >
                    Clear Selection
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      <div>
        <DraggableDropdown
          options={columnOptions}
          onChange={onDynamicColumnUpdate}
        />
      </div>
    </div>
  );
};
