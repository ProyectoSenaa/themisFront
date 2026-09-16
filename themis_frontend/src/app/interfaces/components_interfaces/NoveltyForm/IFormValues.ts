export default interface IFormValues {
    noveltyType: { id: number } | null;
    apprendiceName: string;
    documentNumber: string;
    program: string;
    numberSheet: string;
    fundaments: string;
    pdfUrl?: string;
    documents: File[];
}