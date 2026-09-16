export default interface IUserFormData{
    document: string;
    password: string;
    typeDocument: string;
    fk_id_person: {id: number}
    fk_id_role:  {id: number; name: string}[];
}