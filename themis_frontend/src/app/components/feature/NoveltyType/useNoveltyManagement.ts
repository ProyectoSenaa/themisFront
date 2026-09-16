import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchNoveltyTypes } from '@/redux/features/noveltieTypeSlice';
import { fetchRoles } from '@/redux/features/rolesSlice';
import { RootState } from '@/redux/store';

export const useNoveltyManagement = () => {
  const dispatch = useAppDispatch();
  const noveltyTypes = useAppSelector(state => state.noveltieType.data);
  const loading = useAppSelector(state => state.noveltieType.loading);
  const error = useAppSelector(state => state.noveltieType.error);
  
  const roles = useAppSelector(state => state.roles.allRoles);
  
  
  const valueLoading = useAppSelector((state: RootState) => state.loadingState);

  useEffect(() => {
    console.log("useEffect triggered - fetching data...");
    dispatch(fetchNoveltyTypes());
    const rolesPromise = dispatch(fetchRoles({page : 0, size: 100}));
    
    // Log the promise result
    rolesPromise.then((result) => {
      console.log("fetchRoles promise result:", result);
    }).catch((error) => {
      console.log("fetchRoles promise error:", error);
    });
    
  }, [dispatch]);

  return { 
    noveltyTypes, 
    loading, 
    error, 
    roles,
    valueLoading 
  };
};
