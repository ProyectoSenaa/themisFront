import IPerson from "./IPerson"

export default interface IUser{
    id: number;
    document: number;
    fk_id_person: IPerson
}