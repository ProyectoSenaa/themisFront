import IRole from "./IRole"


export default interface INoveltyType {
    id: number;
    nameNovelty: string;
    noveltyState: boolean;
    description: string;
    procedureDescription: string;
    roles: IRole[]
}