'use client'

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useAppDispatch } from '@/redux/hooks';
import { fetchNovelties } from '@/redux/features/noveltySlice';
import { enrichNoveltiesWithStudent } from '../../../../service/enrichNovelties';

export const useNoveltiesResponse = () => {
    const dispatch = useAppDispatch();
    const students = useSelector((state: RootState) => state.student.students);
    const novelties = useSelector((state: RootState) => state.selectedNovelty.novelties);
    const loading = useSelector((state: RootState) => state.selectedNovelty.loading);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;

    useEffect(() => {
        dispatch(fetchNovelties({ page : 0, size : 10}));
    }, [dispatch]);

    const enrichedNovelties = enrichNoveltiesWithStudent(novelties, students);
    const enrichedWithType = enrichedNovelties.map(n => ({
        ...n,
        typeNovelty: n.noveltyType?.nameNovelty || n.typeNovelty || 'N/A',
    }));

    const totalPages = Math.ceil((enrichedWithType.length || 0) / itemsPerPage);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    return {
        loading,
        currentData: enrichedWithType,
        currentPage,
        totalPages,
        handlePageChange,
    };
};
