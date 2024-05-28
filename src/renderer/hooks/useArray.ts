import { useState } from 'react';

export const useArray = <T>(defaultValue: T[]) => {
  const [value, setValue] = useState<T[]>(defaultValue);

  const push = (item: T) => {
    setValue([...value, item]);
  };

  const remove = (index: number) => {
    const arr = [...value];
    arr.splice(index, 1);
    setValue(arr);
  };

  const removeById = (id: number) => {
    const index = value.findIndex((item) => (item.id || item) === id);
    if (index > -1) remove(index);
  };

  const update = (index: number, item: T) => {
    setValue([...value.slice(0, index), item, ...value.slice(index + 1)]);
  };

  const updateById = (id: number, item: T) => {
    const index = value.findIndex((item) => (item.id || item) === id);
    if (index > -1) {
      setValue([...value.slice(0, index), item, ...value.slice(index + 1)]);
    }
  };

  return [
    value,
    {
      setValue,
      push,
      update,
      updateById,
      remove,
      removeById,
    },
  ];
};
