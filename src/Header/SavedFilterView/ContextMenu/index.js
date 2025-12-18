import React from "react";
import { EditModal } from "../EditModal";
import { Dropdown } from "@innovaccer/design-system";

export const ContextMenu = ({
  filterItem,
  updateSavedFilterList,
  savedFilterList,
}) => {
  const [showEditModal, setShowEditModal] = React.useState(false);

  const onEditHandler = () => {
    setShowEditModal(true);
  };

  const onClose = () => {
    setShowEditModal(!showEditModal);
  };

  const onDeleteHandler = () => {
    const updatedList = savedFilterList.filter((filter) => {
      return filterItem.filterId !== filter.filterId;
    });

    updateSavedFilterList(updatedList);
  };

  const onChangeHandler = (selectedOption) => {
    if (selectedOption === "edit") {
      onEditHandler();
    } else if (selectedOption === "delete") {
      onDeleteHandler();
    }
  };

  return (
    <>
      <Dropdown
        menu={true}
        className="w-25"
        optionType="WITH_ICON"
        onChange={onChangeHandler}
        align="left"
        options={[
          {
            icon: "edit",
            label: "Edit details",
            value: "edit",
          },
          { icon: "delete", label: "Delete", value: "delete" },
        ]}
      />

      <EditModal
        filterItem={filterItem}
        onClose={onClose}
        showEditModal={showEditModal}
        savedFilterList={savedFilterList}
        updateSavedFilterList={updateSavedFilterList}
      />
    </>
  );
};
