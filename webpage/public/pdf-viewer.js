// Get the file name from the URL parameters
const urlParams = new URLSearchParams(window.location.search);
const fileName = urlParams.get('file'); // Get the PDF file name from the URL

if (fileName) {
  const container = document.getElementById('pdf-container');
  const fileNameWithoutExt = fileName.split('.').slice(0, -1).join('.'); // Remove file extension

  // Set the file name heading
  document.getElementById('file-name').textContent = fileNameWithoutExt;

  // Load PDF.js and render the PDF
  pdfjsLib.getDocument(`/pdf/${fileName}`).promise.then(pdf => {
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


document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const fileName = urlParams.get('file');
    if (fileName) {
        const pdfViewer = document.getElementById('pdf-viewer');
        pdfViewer.src = `/pdf/${fileName}`;

        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        let drawing = false;

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

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.strokeStyle = 'black';

            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        };

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mouseup', endDrawing);
        canvas.addEventListener('mousemove', draw);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const fileName = urlParams.get('file');
    if (fileName) {
        const pdfViewer = document.getElementById('pdf-viewer');
        pdfViewer.src = `/pdf/${fileName}`;

        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        let drawing = false;
        let addingStickyNote = false;

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

            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            ctx.lineWidth = 5;
            ctx.lineCap = 'round';
            ctx.strokeStyle = 'black';

            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
        };

        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mouseup', endDrawing);
        canvas.addEventListener('mousemove', draw);

        // Handle sticky note creation
        const stickyNoteBtn = document.getElementById('sticky-note-btn');
        const cursorModeBtn = document.getElementById('cursor-mode-btn');

        stickyNoteBtn.addEventListener('click', () => {
            addingStickyNote = true;
            cursorModeBtn.style.display = 'block'; // Show cursor mode button
            stickyNoteBtn.style.display = 'none'; // Hide sticky note button
        });

        cursorModeBtn.addEventListener('click', () => {
            addingStickyNote = false;
            cursorModeBtn.style.display = 'none'; // Hide cursor mode button
            stickyNoteBtn.style.display = 'block'; // Show sticky note button
        });

        document.addEventListener('click', (e) => {
            if (addingStickyNote) {
                const stickyNote = document.createElement('div');
                stickyNote.className = 'sticky-note';
                stickyNote.style.left = `${e.pageX}px`;
                stickyNote.style.top = `${e.pageY}px`;
                stickyNote.contentEditable = true;
                document.body.appendChild(stickyNote);
            }
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const stickyNoteBtn = document.getElementById('sticky-note-btn');
    const cursorModeBtn = document.getElementById('cursor-mode-btn');
    const pdfContainer = document.getElementById('pdf-container'); // The container where the PDF is displayed

    let isAddingStickyNote = false;

    stickyNoteBtn.addEventListener('click', () => {
        isAddingStickyNote = true;
        cursorModeBtn.style.display = 'block'; // Show the cursor mode button
    });

    cursorModeBtn.addEventListener('click', () => {
        isAddingStickyNote = false;
        cursorModeBtn.style.display = 'none'; // Hide the cursor mode button
    });

    pdfContainer.addEventListener('click', (e) => {
        if (isAddingStickyNote) {
            // Get the position where the user clicked
            const rect = pdfContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Create a sticky note element
            const stickyNote = document.createElement('div');
            stickyNote.className = 'sticky-note';
            stickyNote.style.left = `${x}px`;
            stickyNote.style.top = `${y}px`;
            stickyNote.contentEditable = 'true'; // Make the sticky note content editable
            stickyNote.addEventListener('blur', () => {
                // Save sticky note content or perform any action when note loses focus
                console.log('Sticky note content:', stickyNote.innerText);
            });

            // Append the sticky note to the PDF container
            pdfContainer.appendChild(stickyNote);
        }
    });
});
