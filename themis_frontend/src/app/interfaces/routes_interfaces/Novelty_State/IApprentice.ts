import IPerson from "./IPerson";
import IStudySheet from "./IStudySheet";


export default interface IApprentice {
    id: number;
    fk_id_person: IPerson;
    fk_id_journey: IStudySheet;
}