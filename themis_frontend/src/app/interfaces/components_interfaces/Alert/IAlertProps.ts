export default interface IAlertProps {
    message: string;
    type: "success" | "error" | "info" | "warning" | "";
    duration?: number;
}