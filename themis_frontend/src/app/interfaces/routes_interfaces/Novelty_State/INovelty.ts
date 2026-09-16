import INoveltyType from "./INoveltyType";
import IPerson from "./IPerson";
import IApprentice from "./IApprentice";


export default interface INovelty {
    id: number;
    fk_id_novelty_type: INoveltyType;
    fk_id_person: IPerson;
    fk_id_apprentice: IApprentice;
    novelty_date: Date;
    novelty_files: string;
    observation: string,
    status: string;
    document: number
}