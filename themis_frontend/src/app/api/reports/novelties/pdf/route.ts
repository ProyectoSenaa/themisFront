import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  if (!startDate || !endDate) {
    return new NextResponse('Missing startDate or endDate', { status: 400 });
  }

  // URL del backend Java
  const backendUrl = `http://localhost:8080/themis/reports/novelties/pdf?startDate=${startDate}&endDate=${endDate}`;

  // Petición al backend Java
  const backendRes = await fetch(backendUrl, {
    method: 'GET',
  });

  if (!backendRes.ok) {
    return new NextResponse('Error al generar el PDF en el backend', { status: 500 });
  }

  const pdfBuffer = await backendRes.arrayBuffer();

  return new NextResponse(pdfBuffer, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="reporte_novedades.pdf"',
    },
  });
}
