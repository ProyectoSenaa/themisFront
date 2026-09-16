import{
    Html,
    Head,
    Preview,
    Body,
    Container,
    Section,
    Img,
    Button
} from '@react-email/components';
import * as React from "react"; 
import { useState } from 'react';
import { useRouter } from 'next/navigation';


interface Props{
    fullname: string;
    date: string;
    systemUrl: string;
    noveltyType: string;
}

export default function EmailTemplate({
    fullname,
    noveltyType,
    date,
    systemUrl,
}: Props) {
    return(
        <Html>
            <Head />
            <>Registro de novedad exitosa</>
            <Body style={{backgroundColor: "#f4f4f4", fontFamily: "Arial, sans-serif"}}>
                    <Container style={{ maxWidth: "600px", margin: "0 auto", backgroundColor: "#ffffff", padding: "20px", borderRadius: "8px" }}>
                        <section>
                        <div className='w-full font-inter'>

                        <div className="bg-gradient-to-r from-darkGreen to-emerald-700 rounded-xl p-6 text-white mb-6 shadow-xl hover:shadow-emerald-200/30 transition-all duration-300">
                               <h2 className='text-2xl font-bold mb-3'>Registro existoso de novedad</h2> 
                                <p className='text-white/90 text-lg leading-relaxed'>Hola {fullname}, tu novedad ha sido registrada exitosamente en el sistema.</p>
                                <p>
                                    <strong>Tipo de novedad:</strong> {noveltyType} 
                                    <strong>Fecha:</strong>{date}
                                </p>
                                <a href={systemUrl} className='mt-5 bg-emerald-800 text-white px-5 py-3 rounded-md no-underline'>
                                    Ir al sistema
                                </a>+
                        </div>
                        </div>
                        </section>
                    </Container>
            </Body>
        </Html>
    )
}