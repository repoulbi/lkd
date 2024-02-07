import { PDFDocument, PDFPage } from 'https://cdn.skypack.dev/pdf-lib';
import { isMobile } from 'https://cdn.jsdelivr.net/gh/jscroot/useragent@0.0.1/croot.js';
import {redirect} from 'https://cdn.jsdelivr.net/gh/jscroot/url@0.0.9/croot.js';

const loaderSection = document.getElementById('loaderSection');


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
    if (isMobile()){
      console.log("masuk ke mode mobile");
      const downloadLink = document.createElement('a');
      downloadLink.href =pdfUrl;
      downloadLink.download = 'LKD_ULBI.pdf';
      downloadLink.textContent = 'Unduh Berkas';
      document.body.replaceChild(downloadLink,loaderSection);
      downloadLink.click();
      //downloadLink.remove();
    }else{
      const embedElement = document.createElement('embed');
      embedElement.setAttribute('src', pdfUrl);
      embedElement.setAttribute('width', '100%');
      embedElement.setAttribute('height', '100%');
      document.body.replaceChild(embedElement,loaderSection);
    }
    
  } catch (error) {
    // Handle error if PDF loading fails
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'URL Tidak Valid. Silahkan periksa kembali URL yang akan dikunjungi.',
    });
    const HomeLink = document.createElement('a');
    HomeLink.href ="../";
    HomeLink.textContent = 'Kembali ke Laman Depan';
    document.body.replaceChild(HomeLink,loaderSection);
    console.error('Error memroses PDFs:', error);
  }
}