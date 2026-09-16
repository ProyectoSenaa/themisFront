'use client';
import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FaKey, FaTimes, FaCheck, FaInfoCircle } from "react-icons/fa";
// import AuthService from '../../service/AuthService';

const REGX_code = /^[0-9]{6}$/;

export default function CodeVerificationPage() {
    const [code, setCode] = useState('');
    const [valiCode, setValiCode] = useState(false);
    const [codeFocus, setCodeFocus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [enviado, setEnviado] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setValiCode(REGX_code.test(code));
    }, [code]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (valiCode) {
            setLoading(true);
            setError('');
            
            try {
                // Simulación de la petición al backend
                // TODO: Implementar la lógica real de verificación de código
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Simulación de respuesta exitosa
                setEnviado(true);
                setTimeout(() => {
                    router.push('/auth/reset_password');
                }, 600);
                
                // Código real que se implementará más adelante
                /*
                const response = await AuthService.verifyCode(code);
                
                if (response.data.success) {
                    setEnviado(true);
                    setTimeout(() => {
                        router.push('/auth/reset_password');
                    }, 600);
                } else {
                    setError(response.data.message || 'Error al verificar el código');
                }
                */
            } catch (error: any) {
                setError(error.message || 'Error al verificar el código');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            {/* Welcome Text */}
            <div className="welcome-message">
                <p>Ingresa el código de verificación que te enviamos a tu correo electrónico.</p>
            </div>

            {/* Form */}
            <form className="login-form" onSubmit={handleSubmit}>
                {/* Code Input */}
                <div className="input-container">
                    <div className="input-field">
                        <div className="input-icon">
                            <FaKey className="icon" />
                        </div>
                        <input
                            className="text-field"
                            placeholder="Código de verificación"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            aria-invalid={valiCode ? "false" : "true"}
                            aria-describedby="codeidnote"
                            onFocus={() => setCodeFocus(true)}
                            onBlur={() => setCodeFocus(false)}
                        />
                        {code && (
                            <div className="validation-icon">
                                {valiCode ? (
                                    <FaCheck className="valid-icon" />
                                ) : (
                                    <FaTimes className="invalid-icon" />
                                )}
                            </div>
                        )}
                    </div>

                    {!valiCode && codeFocus && code && (
                        <div className="error-message">
                            <div className="error-content">
                                <FaInfoCircle className="error-icon" />
                                <div>
                                    <p>¡Este campo es obligatorio!</p>
                                    <p>¡Solo se aceptan caracteres números!</p>
                                    <p>El código debe tener exactamente 6 dígitos.</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <div className="error-alert">
                        <FaInfoCircle className="error-icon" />
                        <span>{error}</span>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className="login-button"
                    disabled={loading}
                >
                    {loading ? 'Cargando...' : 'Verificar Código'}
                </button>

                {/* Back to Login */}
                <button
                    type="button"
                    className="forgot-password"
                    onClick={() => router.push('/auth/login')}
                >
                    Volver al inicio de sesión
                </button>
            </form>

            {/* Verification Message Notification */}
            {enviado && (
                <div className="notification-container">
                    <div className="success-notification">
                        <div className="notification-content">
                            <div className="notification-icon-container">
                                <svg className="notification-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="notification-message">
                                <p>
                                    ¡Código verificado exitosamente! Redireccionando a restablecer contraseña...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}