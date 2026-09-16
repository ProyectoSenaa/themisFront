"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useNoveltyResponse } from "@/app/components/feature/novelties/respond/useNoveltyResponse";
import FormRespondNovelty from "@/app/components/RespondFormNovelty";
import Sidenav from "@/app/components/Sidenav";
import NavBar from "@/app/components/NavBar";

const RespondNoveltyPage = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id ? String(params.id) : undefined;
  const { formValues, loading, error } = useNoveltyResponse(id);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  // Handler para redirigir después de responder
  const handleResponded = () => {
    router.push("/routes/novelties_response");
  };

  // Handler to send a novelty to committee: updates backend then navigates to novel_state
  const handleSendToCommittee = async (noveltyId?: string, numeroFicha?: string) => {
    if (!noveltyId) return;
    try {
      const NoveltyService = (await import('@/app/service/NoveltyService')).default;
  // Update status using noveltyStatus object. Use id 2 for 'En Comité' (adjust if backend uses different ids)
  await NoveltyService.updateStateNovelty(Number(noveltyId), { data: { noveltyStatus: { id: 2 }, ficha: numeroFicha } });
  // After successful update, navigate to the novel state view so the change is visible
  router.push('/routes/novel_state');
    } catch (err) {
      // If update fails, navigate back to the response list as fallback
      console.error('Error enviando novedad a comité', err);
  router.push('/routes/novelties_response');
    }
  };

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="flex min-h-screen">
      <Sidenav isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className="flex-1 flex flex-col">
        <NavBar toggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        <main className="flex-1 flex flex-col items-center justify-center p-6">
          <h1 className="text-3xl font-bold mb-6">Responder Novedad</h1>
          <FormRespondNovelty formValues={formValues} onResponded={handleResponded} onSendToCommittee={handleSendToCommittee} />
        </main>
      </div>
    </div>
  );
};

export default RespondNoveltyPage;
