import { PDFDocument, PDFPage } from 'https://cdn.skypack.dev/pdf-lib';
import { isMobile } from 'https://cdn.jsdelivr.net/gh/jscroot/useragent@0.0.1/croot.js';

//const pdfIframe = document.getElementById('pdf');

export async function displayConcatenatedPDFs(pdfA, pdfB) {

  const flagUrl = 'https://repo.ulbi.ac.id/sk/2324-1/' + pdfA + '.pdf';
  const constitutionUrl = 'https://repo.ulbi.ac.id/buktiajar/2324-1/' + pdfB + '.pdf';

  try {
    const flagPdfBytes = await fetch(flagUrl).then(response => response.arrayBuffer());
    const constitutionPdfBytes = await fetch(constitutionUrl).then(response => response.arrayBuffer());

    const flagPdfDoc = await PDFDocument.load(flagPdfBytes);
    const constitutionPdfDoc = await PDFDocument.load(constitutionPdfBytes);

    const pagesToAppend = await flagPdfDoc.copyPages(constitutionPdfDoc, constitutionPdfDoc.getPageIndices());

    for (const page of pagesToAppend) {
      await flagPdfDoc.addPage(page);
    }

    const concatenatedPdfBytes = await flagPdfDoc.save();

    const pdfUrl = URL.createObjectURL(new Blob([concatenatedPdfBytes], { type: 'application/pdf' }));
    //pdfIframe.src = pdfUrl;
    // Tampilkan PDF dengan elemen <embed>
    const embedElement = document.createElement('embed');
    embedElement.setAttribute('src', pdfUrl);
    embedElement.setAttribute('width', '100%');
    embedElement.setAttribute('height', '600px');
    document.body.appendChild(embedElement);
  } catch (error) {
    // Handle error if PDF loading fails
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'URL Tidak Valid. Silahkan periksa kembali URL yang akan dikunjungi.',
    });
    console.error('Error memroses PDFs:', error);
  }
}