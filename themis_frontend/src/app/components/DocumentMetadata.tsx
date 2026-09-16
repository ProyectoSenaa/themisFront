"use client";
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

export default function DocumentMetadata() {
  const pageTitle = useSelector((state: RootState) => state.metadata.title);

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  return null;
}