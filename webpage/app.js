const fileUpload = document.getElementById('file-upload');
const canvasContainer = document.getElementById('canvas-container');
const pdfCanvas = document.getElementById('pdf-render');
const drawCanvas = document.getElementById('draw-layer');
const ctx = drawCanvas.getContext('2d');
let pdfDoc = null;
let pageNum = 1;
let scale = 1.5;
let drawing = false;

// Set up drawing on the overlay canvas
const startDrawing = (e) => {
  drawing = true;
  draw(e);
};

const endDrawing = () => {
  drawing = false;
  ctx.beginPath();
};

const draw = (e) => {
  if (!drawing) return;

  const rect = drawCanvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.strokeStyle = 'red';

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
};

drawCanvas.addEventListener('mousedown', startDrawing);
drawCanvas.addEventListener('mouseup', endDrawing);
drawCanvas.addEventListener('mousemove', draw);

// Render the PDF on the bottom canvas
const renderPage = (num) => {
  pdfDoc.getPage(num).then((page) => {
    const viewport = page.getViewport({ scale });
    pdfCanvas.height = viewport.height;
    pdfCanvas.width = viewport.width;
    drawCanvas.height = viewport.height;
    drawCanvas.width = viewport.width;

    const ctx = pdfCanvas.getContext('2d');
    const renderContext = {
      canvasContext: ctx,
      viewport: viewport,
    };

    page.render(renderContext);
  });
};

// Handle file upload and render PDF
fileUpload.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file.type !== 'application/pdf') {
    alert('Please upload a valid PDF file.');
    return;
  }

  const fileReader = new FileReader();
  fileReader.onload = (e) => {
    const typedArray = new Uint8Array(e.target.result);
    pdfjsLib.getDocument(typedArray).promise.then((pdf) => {
      pdfDoc = pdf;
      renderPage(pageNum);
    });
  };

  fileReader.readAsArrayBuffer(file);
});
