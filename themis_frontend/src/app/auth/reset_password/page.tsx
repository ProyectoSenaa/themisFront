'use client';
import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FaLock, FaTimes, FaCheck, FaInfoCircle } from "react-icons/fa";
// import AuthService from '../../service/AuthService';

const REGX_contrasena = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.*[\-\_\@\¿\?\*\!\¡])[a-zA-Z0-9\-\_\@\¿\?\*\!\¡]{8,15}$/;

export default function ResetPasswordPage() {
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [valiContrasena, setValiContrasena] = useState(false);
    const [valiConfirmarContrasena, setValiConfirmarContrasena] = useState(false);
    const [contrasenaFocus, setContrasenaFocus] = useState(false);
    const [confirmarContrasenaFocus, setConfirmarContrasenaFocus] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [enviado, setEnviado] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setValiContrasena(REGX_contrasena.test(contrasena));
        setValiConfirmarContrasena(contrasena === confirmarContrasena && REGX_contrasena.test(confirmarContrasena));
    }, [contrasena, confirmarContrasena]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        if (valiContrasena && valiConfirmarContrasena) {
            setLoading(true);
            setError('');
            
            try {
                // Simulación de la petición al backend
                // TODO: Implementar la lógica real de restablecimiento de contraseña
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Simulación de respuesta exitosa
                setEnviado(true);
                setTimeout(() => {
                    router.push('/auth/login');
                }, 600);
                
                // Código real que se implementará más adelante
                /*
                const response = await AuthService.resetPassword(contrasena);
                
                if (response.data.success) {
                    setEnviado(true);
                    setTimeout(() => {
                        router.push('/auth/login');
                    }, 600);
                } else {
                    setError(response.data.message || 'Error al restablecer la contraseña');
                }
                */
            } catch (error: any) {
                setError(error.message || 'Error al restablecer la contraseña');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            {/* Welcome Text */}
            <div className="welcome-message">
                <p>Ingresa tu nueva contraseña y confírmala para completar el proceso.</p>
            </div>

            {/* Form */}
            <form className="login-form" onSubmit={handleSubmit}>
                {/* Password Input */}
                <div className="input-container">
                    <div className="input-field">
                        <div className="input-icon">
                            <FaLock className="icon" />
                        </div>
                        <input
                            className="text-field"
                            type="password"
                            placeholder="Nueva Contraseña"
                            value={contrasena}
                            onChange={(e) => setContrasena(e.target.value)}
                            aria-invalid={valiContrasena ? "false" : "true"}
                            aria-describedby="contrasenaidnote"
                            onFocus={() => setContrasenaFocus(true)}
                            onBlur={() => setContrasenaFocus(false)}
                        />
                        {contrasena && (
                            <div className="validation-icon">
                                {valiContrasena ? (
                                    <FaCheck className="valid-icon" />
                                ) : (
                                    <FaTimes className="invalid-icon" />
                                )}
                            </div>
                        )}
                    </div>

                    {!valiContrasena && contrasenaFocus && contrasena && (
                        <div className="error-message">
                            <div className="error-content">
                                <FaInfoCircle className="error-icon" />
                                <div>
                                    <p>¡Este campo es obligatorio!</p>
                                    <p>¡No pueden haber espacios en este campo!</p>
                                    <p>La contraseña debe tener entre 8 y 15 caracteres</p>
                                    <p>Debe tener letras, números y al menos uno de los siguientes caracteres - _ @ ¿ ? * ! ¡</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Confirm Password Input */}
                <div className="input-container">
                    <div className="input-field">
                        <div className="input-icon">
                            <FaLock className="icon" />
                        </div>
                        <input
                            className="text-field"
                            type="password"
                            placeholder="Confirmar Nueva Contraseña"
                            value={confirmarContrasena}
                            onChange={(e) => setConfirmarContrasena(e.target.value)}
                            aria-invalid={valiConfirmarContrasena ? "false" : "true"}
                            aria-describedby="confirmarcontrasenaidnote"
                            onFocus={() => setConfirmarContrasenaFocus(true)}
                            onBlur={() => setConfirmarContrasenaFocus(false)}
                        />
                        {confirmarContrasena && (
                            <div className="validation-icon">
                                {valiConfirmarContrasena ? (
                                    <FaCheck className="valid-icon" />
                                ) : (
                                    <FaTimes className="invalid-icon" />
                                )}
                            </div>
                        )}
                    </div>

                    {!valiConfirmarContrasena && confirmarContrasenaFocus && confirmarContrasena && (
                        <div className="error-message">
                            <div className="error-content">
                                <FaInfoCircle className="error-icon" />
                                <div>
                                    <p>¡Este campo es obligatorio!</p>
                                    <p>¡No pueden haber espacios en este campo!</p>
                                    <p>Las contraseñas deben coincidir</p>
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
                    {loading ? 'Cargando...' : 'Restablecer Contraseña'}
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
                                    ¡Contraseña restablecida exitosamente! Redireccionando al inicio de sesión...
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}