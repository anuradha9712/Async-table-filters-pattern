import React from "react";
import {
  LinkButton,
  Modal,
  Label,
  Button,
  Input,
  Tooltip,
  Textarea,
} from "@innovaccer/design-system";

export const SaveFilter = ({
  filterList,
  savedFilterList,
  updateSavedFilterList,
  setShowToast,
}) => {
  const [showModal, setShowModal] = React.useState(false);
  const [filterName, setFilterName] = React.useState("");
  const [filterDesc, setFilterDesc] = React.useState("");
  const [isFilterSaved, setIsFilterSaved] = React.useState(false);

  React.useEffect(() => {
    setIsFilterSaved(false);
  }, [filterList]);

  const onClose = () => {
    setShowModal(!showModal);
    setFilterName("");
    setFilterDesc("");
  };

  const onFilterSave = () => {
    const curr_date = new Date();
    const list = {
      filterName,
      filterDesc,
      filterList,
      created_date: curr_date,
      modified_date: curr_date,
      filterId: Math.random().toString(36).substring(2, 6),
    };
    updateSavedFilterList([...savedFilterList, list]);
    onClose();
    setIsFilterSaved(true);
    setShowToast(true);
  };

  return (
    <div className="ml-6">
      {isFilterSaved ? (
        <Tooltip tooltip="Already saved filter view">
          <LinkButton disabled={true}>Save as filter view</LinkButton>
        </Tooltip>
      ) : (
        <LinkButton onClick={() => setShowModal(!showModal)}>
          Save as filter view
        </LinkButton>
      )}
      <Modal
        onClose={onClose}
        open={showModal}
        backdropClose={true}
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
              onClick={onFilterSave}
            >
              Save
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
