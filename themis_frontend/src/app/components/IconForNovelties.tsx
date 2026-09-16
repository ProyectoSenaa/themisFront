import { 
    Clock, 
    X, 
    AlertTriangle, 
    UserX, 
    UserCheck, 
    LogOut, 
    ArrowRightLeft,
    HelpCircle 
} from 'lucide-react';
import IIconForNoveltyProps from '../interfaces/components_interfaces/IconForNovelty/IIconForNoveltyProps';

const IconForNovelty = ({ nameNovelty, className }: IIconForNoveltyProps) => {
    const getIconForNovelty = (nameNovelty: string) => {
        switch (nameNovelty) {
            case "Aplazamiento":
                return Clock;
            case "Cancelación de Matrícula":
                return X;
            case "Cond. de Matrícula":
                return AlertTriangle;
            case "Cond. de Matricula":
                return AlertTriangle;
            case "Deserción":
                return UserX;
            case "Reingreso":
                return UserCheck;
            case "Retiro Voluntario":
                return LogOut;
            case "Traslado":
                return ArrowRightLeft;
            default:
                return HelpCircle;
        }
    };
    
    const IconComponent = getIconForNovelty(nameNovelty);

    return (
        <div title={`Icono de ${nameNovelty}`}>
            <IconComponent
                className={`${className ?? ''} w-[50px] h-[50px]`}
                aria-label={`Icono de ${nameNovelty}`}
            />
        </div>
    );
};

export default IconForNovelty;