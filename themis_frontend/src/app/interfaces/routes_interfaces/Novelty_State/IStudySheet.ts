import IProgram from "./IProgram";
import IJourney from "./IJourney";


export default interface IStudySheet {
    id: number;
    numberSheet: number;
    fk_id_program: IProgram;
    fk_id_journey: IJourney;
}