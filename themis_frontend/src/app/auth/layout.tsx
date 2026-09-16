'use client';
import React from 'react';
import Image from "next/image";
import "../styles/globals.css";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="page-container">
            {/* Left Side - Image Section */}
            <div className="image-section">
                <Image
                    src="/img/ImgHomePage.png"
                    alt="Imagen de fondo"
                    layout="fill"
                    objectFit="cover"
                    className="bg-image"
                />
                <Image
                    src="/img/LogoSenaBlanco.png"
                    alt="Logo SENA"
                    width={120}
                    height={120}
                    className="logo-sena"
                />
                <div className="welcome-text">
                    ¡Únete a la comunidad educativa del SENA y potencia tu futuro! Regístrate ahora para acceder a una amplia gama de programas de formación y oportunidades de crecimiento profesional.
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="form-section">
                <div className="form-container">
                    {/* Header */}
                    <div className="header">
                        <Image
                            src="/img/logoThemis.svg"
                            alt="Logo Themis"
                            width={53}
                            height={37}
                            className="logo-themis"
                        />
                        <div>
                            <h1 className="title">Themis</h1>
                            <p className="subtitle">Transformando el futuro con las nuevas habilidades del SENA.</p>
                        </div>
                    </div>

                    {/* Content */}
                    {children}
                </div>
            </div>
        </div>
    );
} 