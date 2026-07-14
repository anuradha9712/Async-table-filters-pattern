import { DatePicker } from "@innovaccer/design-system";

export const staticFilterList = [
  {
    inlineLabel: "Name",
    optionKey: "name",
    optionList: [
      { label: "A-G", value: "a-g" },
      { label: "H-R", value: "h-r" },
      { label: "S-Z", value: "s-z" },
    ],
  },
  {
    inlineLabel: "Gender",
    optionKey: "gender",
    optionList: [
      { label: "Male", value: "male" },
      { label: "Female", value: "female" },
    ],
  },
  {
    inlineLabel: "Type",
    optionKey: "type",
    optionList: [
      { label: "Batch Execution", value: "Batch Execution" },
      { label: "Test Function", value: "Test Function" },
    ],
  },
  {
    inlineLabel: "Status",
    optionKey: "status",
    optionList: [
      { label: "Completed", value: "Completed" },
      { label: "Failed", value: "Failed" },
    ],
  },
  {
    inlineLabel: "Department",
    optionKey: "department",
    optionList: [
      { label: "Claims", value: "Claims" },
      { label: "Quality", value: "Quality" },
      { label: "Risk Analysis", value: "Risk Analysis" },
    ],
  },
  {
    inlineLabel: "Priority",
    optionKey: "priority",
    optionList: [
      { label: "Subacute", value: "Subacute" },
      { label: "Urgent", value: "Urgent" },
      { label: "Routine", value: "Routine" },
    ],
  },
];

export const dynamicFilterList = (loading) => {
  return [
    {
      element: DatePicker,
      label: "Creation date",
      value: "creation_date",
      props: {
        withInput: true,
        label: "Creation date",
        inputOptions: {
          placeholder: "mm/dd/yyyy",
          disabled: loading,
          minWidth: "unset",
          // DatePicker's Trigger only forwards inputOptions to the input, so the
          // accessible name for the date field must be set here (WCAG 2.4.6 /
          // 4.1.2 — the programmatic label must convey the control's purpose).
          "aria-label": "Creation date",
        },
      },
    },
  ];
};
