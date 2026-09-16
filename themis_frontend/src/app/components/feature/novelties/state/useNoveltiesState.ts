'use client'

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_NOVELTY } from '@/app/graphqlServices/noveltyGraphql';
import INovelty from '@/app/interfaces/routes_interfaces/Novelty_State/INovelty';

export const useNoveltiesState = () => {
    const [novelties, setNovelties] = useState<INovelty[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const { data, loading, error, refetch } = useQuery(GET_NOVELTY, {
        variables: { page: currentPage, size: itemsPerPage },
        notifyOnNetworkStatusChange: true,
        // Force a network fetch on mount so the view reflects latest DB state
        fetchPolicy: 'no-cache',
    });

    useEffect(() => {
        if (data && data.allNovelties && data.allNovelties.data) {
            const noveltyData = data.allNovelties.data.map((item: any) => ({
                ...item,
                novelty_date: item.date ? new Date(item.date) : new Date(),
                fk_id_novelty_type: item.noveltyType,
                fk_id_person: item.student?.person || item.teacher?.person || item.administrative?.person || null
            }));
            setNovelties(noveltyData);
        }
    }, [data]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        refetch({ page: page, size: itemsPerPage });
    };
    return {
        novelties,
        loading,
        error,
        currentPage,
        totalPages: data?.allNovelties.totalPages,
        totalItems: data?.allNovelties.totalItems,
        handlePageChange,
    };
};
