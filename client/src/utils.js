import { useEffect, useState } from 'react';
import { url } from './url';

export const useData = ({ resource }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    fetchWithCredentials(url + resource, {
      method: 'GET',
      credentials: 'include',
    })
      .then(r => r.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(e => {
        setError(e);
        setLoading(false);
      });
  }, [resource]);
  return [data, loading, error];
}

export const fetchWithCredentials = (...args) => fetch(args[0], {
  ...args[1],
  credentials: 'include'
}).then(r => {
  if (r.ok) return r;
  else {
    throw new Error(r.status);
  }
}).then(r => r.json())