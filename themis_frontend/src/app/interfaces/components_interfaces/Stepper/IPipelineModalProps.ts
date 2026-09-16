export default interface IPipelineModalProps {
    open: boolean;
    onClose: () => void;
    currentState: string;
}