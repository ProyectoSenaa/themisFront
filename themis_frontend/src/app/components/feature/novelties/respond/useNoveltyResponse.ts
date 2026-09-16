'use client'

import { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_NOVELTY_BY_ID } from '@/app/graphqlServices/noveltyGraphql';
import IFormValues from '@/app/interfaces/routes_interfaces/Respond_Novelties/IFormValues';

export const useNoveltyResponse = (idParam?: string) => {
    const [formValues, setFormValues] = useState<IFormValues>({
        id: 0,
        noveltyType: "",
        apprenticeName: "",
        document: 0,
        program: "",
        numberSheet: 0,
        fundaments: "",
        pdfUrl: "",
        documents: [] ,
    });
    const [error, setError] = useState<string | null>(null);

    // If idParam is present, use Apollo useQuery to fetch the novelty by id (client-side)
    const idNumber = idParam ? Number(idParam) : undefined;
    const { data, loading, error: queryError } = useQuery(GET_NOVELTY_BY_ID, {
        variables: idNumber ? { id: idNumber } : undefined,
        skip: !idNumber,
        fetchPolicy: 'network-only'
    });

    useEffect(() => {
        if (queryError) {
            setError(String(queryError));
        }

        if (data && data.noveltyById) {
                const n = data.noveltyById;
                // Debug: log the novelty object to inspect noveltyFiles and related fields
                // eslint-disable-next-line no-console
                console.log('useNoveltyResponse: noveltyById payload:', n);
            const student = n.student || {};
            const person = student.person || {};
            const programName = (student.studentStudySheets && student.studentStudySheets[0] && student.studentStudySheets[0].studySheet && student.studentStudySheets[0].studySheet.trainingProject && student.studentStudySheets[0].studySheet.trainingProject.program && (student.studentStudySheets[0].studySheet.trainingProject.program.name)) || '';

                // Normalize noveltyFiles to support different server shapes
                const rawFiles: any = n.noveltyFiles;
                let pdfUrlVal: string | undefined = undefined;
                let documentsVal: any[] = [];

                if (Array.isArray(rawFiles)) {
                    documentsVal = rawFiles.slice();
                    if (rawFiles.length > 0) {
                        const first = rawFiles[0];
      
                        if (first && typeof first === 'object') {
                            pdfUrlVal = first.base64 || first.file || first.data || first.url || undefined;
                        } else if (typeof first === 'string') {
                            pdfUrlVal = first;
                        }
                    }
                } else if (rawFiles && typeof rawFiles === 'string') {

                    documentsVal = [rawFiles];
                    pdfUrlVal = rawFiles;
                } else if (rawFiles && typeof rawFiles === 'object') {

                    documentsVal = [rawFiles];
                    pdfUrlVal = rawFiles.base64 || rawFiles.file || rawFiles.data || rawFiles.url || undefined;
                }

                if (pdfUrlVal && typeof pdfUrlVal === 'string') {
                    const cleaned = pdfUrlVal.replace(/\s+/g, '');
                    const base64UrlRegex = /^[A-Za-z0-9\-_]+=*$/;
                    const base64Regex = /^[A-Za-z0-9+/=]+$/;

                    if (base64UrlRegex.test(cleaned) && !base64Regex.test(cleaned)) {
     
                        let b = cleaned.replace(/-/g, '+').replace(/_/g, '/');
          
                        while (b.length % 4 !== 0) b += '=';
                        pdfUrlVal = `data:application/pdf;base64,${b}`;
                    } else if (base64Regex.test(cleaned)) {

                        let b = cleaned;
                        while (b.length % 4 !== 0) b += '=';
                        pdfUrlVal = `data:application/pdf;base64,${b}`;
                    }
                }

                if (!pdfUrlVal) pdfUrlVal = '';

                const fichaCandidate = n.numero_Ficha || n.ficha || n.studySheet || (student.studentStudySheets && student.studentStudySheets[0] && student.studentStudySheets[0].studySheet && student.studentStudySheets[0].studySheet.number) || undefined;

                setFormValues({
                    id: n.id,
                    noveltyType: n.noveltyType?.nameNovelty || '',
                    apprenticeName: `${person.name || ''} ${person.lastname || ''}`.trim(),
                    document: person.document ? Number(person.document) : 0,
                    program: programName,
                    numberSheet: student.studentStudySheets && student.studentStudySheets[0] ? (student.studentStudySheets[0].studySheet?.numberSheet || 0) : 0,
                    fundaments: n.observation || '',
                    pdfUrl: pdfUrlVal,
                    documents: documentsVal,
                    ficha: fichaCandidate,
                });

                console.log('useNoveltyResponse: normalized pdfUrl/documentos:', pdfUrlVal, documentsVal);
        }
    }, [data, queryError]);

    useEffect(() => {
        const loadFallback = async () => {
            if (idParam && (!window || !('apolloClient' in window))) {
                try {
                    const NoveltyService = (await import('../../../../service/NoveltyService')).default;
                    const noveltyResponse = await NoveltyService.getNoveltyById(Number(idParam));
                    const noveltyData = noveltyResponse.data.data;
                    // also attempt to include ficha from possible server fields
                    const nd: any = noveltyData as any;
                    const fichaCandidate = nd.numero_Ficha || nd.ficha || nd.studySheet || (nd.fk_id_apprentice && nd.fk_id_apprentice.fk_id_study_sheet && nd.fk_id_apprentice.fk_id_study_sheet.numberSheet) || undefined;

                    setFormValues({
                        id: noveltyData.id,
                        noveltyType: noveltyData.fk_id_novelty_type?.nameNovelty || '',
                        apprenticeName: `${noveltyData.fk_id_apprentice?.fk_id_person?.name || ''} ${noveltyData.fk_id_apprentice?.fk_id_person?.lastname || ''}`.trim(),
                        document: (noveltyData.fk_id_apprentice?.fk_id_person && 'document' in noveltyData.fk_id_apprentice.fk_id_person ? Number((noveltyData.fk_id_apprentice.fk_id_person as any).document) : 0),
                        program: noveltyData.fk_id_apprentice?.fk_id_study_sheet?.fk_id_program?.programName || '',
                        numberSheet: noveltyData.fk_id_apprentice?.fk_id_study_sheet?.numberSheet || 0,
                        fundaments: noveltyData.observation || '',
                        pdfUrl: "",
                        documents: [],
                        ficha: fichaCandidate,
                    });
                } catch (err) {
                    // ignore - handled by query error if present
                }
            }
        };

        loadFallback();
    }, [idParam]);

    return { formValues, loading: !!loading, error };
};
