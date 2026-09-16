import React from 'react';
import IButtonProps from '../interfaces/components_interfaces/Button/IButtonProps';



const Button: React.FC<IButtonProps> = ({ label, onClick, className }) => {
    return (
        <button onClick={onClick} className={`py-2 px-4 ${className}`}>
            {label}
        </button>
    );
};

export default Button;
