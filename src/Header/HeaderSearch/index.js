import React from "react";
import { Input } from "@innovaccer/design-system";

export function debounce(func, delay = 500) {
  let timerId;
  return function () {
    clearTimeout(timerId);
    timerId = setTimeout(() => func.apply(this, arguments), delay);
  };
}

export const HeaderSearch = ({ updateSearchTerm }) => {
  const onSearchHandler = debounce((target) => {
    updateSearchTerm(target?.value);
  });

  return (
    <Input
      name="TableHeader-search"
      className="mr-6"
      icon="search"
      placeholder="Search"
      onChange={({ target }) => onSearchHandler(target)}
    />
  );
};
