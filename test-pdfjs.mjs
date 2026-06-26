import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@6.0.227/build/pdf.worker.min.mjs`;

async function test() {
  console.log("Fetching invalid PDF (HTML)...");
  const arrayBuffer = new TextEncoder().encode("<html><body>Not a PDF</body></html>").buffer;
  
  console.log("Calling getDocument...");
  try {
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    console.log("Success:", pdf.numPages);
  } catch (e) {
    console.log("Error:", e.message);
  }
}

test();
