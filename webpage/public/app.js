// JavaScript for the homepage (index.html)
document.addEventListener('DOMContentLoaded', () => {
    fetch('/files')
        .then(response => response.json())
        .then(files => {
            const list = document.getElementById('pdf-list');
            files.forEach(file => {
                const listItem = document.createElement('li');
                listItem.textContent = file;
                listItem.addEventListener('click', () => {
                    window.location.href = `/edit?file=${file}`;
                });
                list.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching files:', error));
});

// JavaScript for the editing page (edit.html)
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
