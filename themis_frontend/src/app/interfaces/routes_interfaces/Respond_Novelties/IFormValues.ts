export default interface IFormValues{
    id: number;
    noveltyType: string;
    apprenticeName: string;
    document: number;
    program: string;
    numberSheet: number;
    fundaments: string;
    pdfUrl?: string;
    documents: File[];
    // ficha/numero de ficha (opcional) - permite mostrar el botón de enviar a comité
    ficha?: string | number | null;
}