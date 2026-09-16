import INoveltyType from "../routes_interfaces/Novelty_State/INoveltyType";
import IPerson from "../routes_interfaces/Novelty_State/IPerson";
import IApprentice from "../routes_interfaces/Novelty_State/IApprentice";

export default interface IComite
{
    id: number
    fk_id_novelty_type: INoveltyType
    fk_id_person: IPerson
    fk_id_apprentice: IApprentice
    novelty_date: Date
    novelty_files: string
    observation: string
    status: string
    
}
