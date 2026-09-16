"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const appUrl = typeof window !== 'undefined' 
      ? (window as any)?.ENV?.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_APP_URL
      : process.env.NEXT_PUBLIC_APP_URL;
    
    const redirectUri = encodeURIComponent(`${appUrl}/auth/callback`);
    const cerberoUrl = (typeof window !== 'undefined' 
      ? (window as any)?.ENV?.NEXT_PUBLIC_CERBEROS_URL 
      : process.env.NEXT_PUBLIC_CERBEROS_URL) || 'http://10.1.163.75:3001';
    
    window.location.href = `${cerberoUrl}/auth/login?project=Themis&redirectUri=${redirectUri}`;
  }, []);

  return <p>Redirigiendo al login...</p>;
}
