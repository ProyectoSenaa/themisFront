import IColumnProps from "./IColumnProps";



export default interface ITableProps {
    columns: IColumnProps[];
    data: Record<string, any>[];
}