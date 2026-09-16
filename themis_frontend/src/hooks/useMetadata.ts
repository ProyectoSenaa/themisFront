import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setTitle, resetMetadata } from '@/redux/features/metadataSlice';

export function useMetadata(title?: string) {
  const dispatch = useDispatch();

  useEffect(() => {
    // If a title is provided, set it
    if (title) {
      dispatch(setTitle(title));
    }

    // When the component unmounts, reset metadata to defaults
    return () => {
      dispatch(resetMetadata());
    };
  }, [dispatch, title]);
}