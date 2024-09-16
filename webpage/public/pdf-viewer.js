const url = new URLSearchParams(window.location.search).get('file'); // Get the PDF file name from the URL

if (url) {
  const container = document.getElementById('pdf-container');
  
  // Load PDF.js and render the PDF
  pdfjsLib.getDocument(`/pdf/${url}`).promise.then(pdf => {
    const numPages = pdf.numPages;
    console.log('Number of pages:', numPages);

    // Function to render a single page
    const renderPage = (pageNum) => {
      return pdf.getPage(pageNum).then(page => {
        const viewport = page.getViewport({ scale: 1 });
        const canvas = document.createElement('canvas');
        canvas.className = 'pdf-page';
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        const renderContext = {
          canvasContext: canvas.getContext('2d'),
          viewport: viewport
        };
        
        return page.render(renderContext).promise.then(() => {
          container.appendChild(canvas);
        });
      });
    };

    // Render all pages
    const renderAllPages = () => {
      let pagePromises = [];
      for (let i = 1; i <= numPages; i++) {
        pagePromises.push(renderPage(i));
      }
      return Promise.all(pagePromises);
    };

    renderAllPages().catch(error => {
      console.error('Error rendering pages:', error);
    });

  }).catch(error => {
    console.error('Error loading PDF:', error);
  });
}
