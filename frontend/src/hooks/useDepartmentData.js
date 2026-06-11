import { useState, useEffect } from 'react';
import { getDepartmentData } from '../data/departments';

/**
 * Custom hook to abstract data fetching logic for department pages.
 * Ensures a clean separation between UI components and Data layer,
 * making it ready for future Headless CMS or REST API integrations.
 */
export const useDepartmentData = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        // We simulate a network call here
        const result = await getDepartmentData(id);
        
        if (isMounted) {
          if (result) {
            setData(result);
          } else {
            setError(new Error("Department not found"));
            setData(null);
          }
        }
      } catch (err) {
        if (isMounted) {
          setError(err);
          setData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return { data, loading, error };
};
