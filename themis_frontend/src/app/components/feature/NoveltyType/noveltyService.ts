import { fetchNoveltyTypes, addNoveltyType, updateNoveltyType } from '@/redux/features/noveltieTypeSlice';
import { useAppDispatch } from '@/redux/hooks';

export const useNoveltyService = () => {
  const dispatch = useAppDispatch();

  const fetchNovelties = () => dispatch(fetchNoveltyTypes());
  const addNovelty = (data: any) => dispatch(addNoveltyType(data));
  const updateNovelty = (payload: any) => dispatch(updateNoveltyType(payload));

  return { fetchNovelties, addNovelty, updateNovelty };
};
