import React from "react";
import {
  Modal,
  Input,
  Label,
  Button,
  Textarea,
} from "@innovaccer/design-system";

export const EditModal = ({
  filterItem,
  onClose,
  showEditModal,
  savedFilterList,
  updateSavedFilterList,
}) => {
  const [filterName, setFilterName] = React.useState(filterItem?.filterName);
  const [filterDesc, setFilterDesc] = React.useState(filterItem?.filterDesc);

  const onFilterUpdate = () => {
    const updatedList = savedFilterList.map((filter) => {
      if (filterItem.filterId === filter.filterId) {
        filter.filterName = filterName;
        filter.filterDesc = filterDesc;
        filter.modified_date = new Date();
      }

      return filter;
    });

    updateSavedFilterList(updatedList);
    onClose();
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
      }}
    >
      <Modal
        onClose={onClose}
        open={showEditModal}
        backdropClose={false}
        headerOptions={{
          heading: "Filter view details",
        }}
        footer={
          <>
            <Button appearance="basic" onClick={onClose}>
              Cancel
            </Button>
            <Button
              appearance="primary"
              className="ml-4"
              onClick={onFilterUpdate}
            >
              Update
            </Button>
          </>
        }
      >
        <Label withInput={true}>Name</Label>
        <Input
          placeholder="Enter name"
          className="mb-6"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />

        <Label withInput={true} optional={true}>
          Description
        </Label>
        <Textarea
          placeholder="Enter a description..."
          className="mb-4"
          value={filterDesc}
          onChange={(e) => setFilterDesc(e.target.value)}
        />
      </Modal>
    </div>
  );
};
