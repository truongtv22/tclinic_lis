import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getConnections } from './actions';
import { selectConnections } from './slice';

export const useConnectionState = () => {
  const dispatch = useDispatch();

  const connections = useSelector(selectConnections);

  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (!connections || !connections.length) {
      dispatch(getConnections());
    }
  }, []);

  useEffect(() => {
    if (selected) {
      const found = connections.find((item) => item.id === selected.id);
      if (found) {
        setSelected(found);
      } else {
        setSelected(connections[0]);
      }
    } else {
      setSelected(connections[0]);
    }
  }, [connections]);

  return { connections, selected, setSelected };
};
