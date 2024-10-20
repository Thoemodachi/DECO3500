import { getDocument, GlobalWorkerOptions } from './pdfjs/build/pdf.mjs';

GlobalWorkerOptions.workerSrc = './pdfjs/build/pdf.worker.mjs';

let viewerElement; // Declare viewerElement globally
const commentBox = document.getElementById('comment-box');
const commentInput = document.getElementById('comment-input');
const toggleCommentButton = document.getElementById('toggle-comment');
const buttonsContainer = document.getElementById('buttons');
const pageInfo = document.getElementById('page-info');
const commentDisplay = document.getElementById('comment-display');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');

let drawingMode = false;
let currentDrawing = [];
let pdfDoc = null;
let currentPage = 1;
const pagesData = {}; // Store all drawings and comments for each page
let commentIdCounter = 1; // Counter for unique comment IDs

// Load the PDF document
const url = 'media/files/assignment_1.pdf';
getDocument(url).promise.then(pdf => {
    pdfDoc = pdf;
    renderPage(currentPage);
});

async function renderPage(pageNumber) {
    if (!viewerElement) {
        viewerElement = document.getElementById('viewer-container'); // Initialize if not set
    }

    // Clear previous page content but keep viewerElement
    viewerElement.innerHTML = '';

    // Create and set up a new canvas
    const canvas = document.createElement('canvas');
    const page = await pdfDoc.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    // Append the new canvas to the viewer
    viewerElement.appendChild(canvas);

    // Get the drawing context
    const context = canvas.getContext('2d');

    // Render the PDF page onto the canvas
    await page.render({ canvasContext: context, viewport: viewport }).promise;

    // Retrieve and render drawings and markers for the current page
    if (pagesData[pageNumber]) {
        pagesData[pageNumber].drawings.forEach(drawing => {
            drawLine(drawing.points);
        });
        pagesData[pageNumber].markers.forEach(marker => {
            createCommentMarker(marker.id, marker.position, marker.color);
        });
    }

    // Add event listeners for drawing on the newly created canvas
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mousemove', draw);

    updatePageInfo();
}


function updatePageInfo() {
    pageInfo.textContent = `Page: ${currentPage}`;
}

function startDrawing(event) {
    if (drawingMode) {
        currentDrawing = [{ x: event.offsetX, y: event.offsetY }];
        const context = viewerElement.lastChild.getContext('2d');
        context.beginPath();
        context.moveTo(event.offsetX, event.offsetY);
    }
}

function stopDrawing(event) {
    if (drawingMode && currentDrawing.length > 0) {
        currentDrawing.push({ x: event.offsetX, y: event.offsetY });
        drawLine(currentDrawing);

        // Save the drawing for the current page
        const commentId = `#${commentIdCounter}`;
        saveDrawing(commentId, currentDrawing);

        currentDrawing = []; // Reset drawing state
    }
}

function draw(event) {
    if (drawingMode && currentDrawing.length > 0) {
        const context = viewerElement.lastChild.getContext('2d');
        context.lineTo(event.offsetX, event.offsetY);
        context.stroke();
    }
}

function drawLine(points) {
    if (points.length < 2) return;

    const context = viewerElement.lastChild.getContext('2d');
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    for (const point of points) {
        context.lineTo(point.x, point.y);
    }
    context.stroke();
}

function createCommentMarker(commentId, position, color = 'yellow') {
    const marker = document.createElement('div');
    marker.className = 'comment-marker';
    marker.style.left = `${(viewerElement.clientWidth / 2) - 6}px`; // Center horizontally
    marker.style.top = `${(viewerElement.clientHeight / 2) - 6}px`; // Center vertically
    marker.style.backgroundColor = color; // Set color

    marker.onclick = () => toggleCommentDisplay(commentId); // Toggle comment display on click

    if (!pagesData[currentPage]) {
        pagesData[currentPage] = { drawings: [], comments: [], markers: [] }; // Initialize if undefined
    }
    pagesData[currentPage].markers.push({ id: commentId, position: { y: viewerElement.clientHeight / 2 }, color });

    viewerElement.appendChild(marker); // Append marker to the viewer
}

let isCommentVisible = false; // Track the visibility of the comment

function toggleCommentDisplay(commentId) {
    const comment = pagesData[currentPage].comments.find(c => c.id === commentId);
    
    if (isCommentVisible && commentDisplay.innerText.includes(commentId)) {
        // If the comment is already visible and clicked again, hide it
        commentDisplay.style.display = 'none';
        isCommentVisible = false; // Update the visibility state
    } else {
        // Show the comment if it's not already visible
        if (comment) {
            commentDisplay.innerText = `${commentId}: ${comment.text}`; // Set comment text with ID
            commentDisplay.style.display = 'block'; // Show comment box
            isCommentVisible = true; // Update the visibility state
        }
    }
}

function saveDrawing(commentId, points) {
    if (!pagesData[currentPage]) {
        pagesData[currentPage] = { drawings: [], comments: [], markers: [] };
    }
    pagesData[currentPage].drawings.push({ commentId, points });
}

function displayAllMarkers() {
    const allMarkers = pagesData[currentPage].markers;
    console.log("All Markers on Page " + currentPage + ":");
    allMarkers.forEach(marker => {
        console.log(`ID: ${marker.id}, Position: ${marker.position.y}, Color: ${marker.color}`);
    });
}

function saveComment(commentId, text, position) {
    if (!pagesData[currentPage]) {
        pagesData[currentPage] = { drawings: [], comments: [], markers: [] };
    }
    pagesData[currentPage].comments.push({ id: commentId, text, position });
    const averageY = (position.y + 20) / 2; // Average Y for marker placement
    pagesData[currentPage].markers.push({ id: commentId, position: { y: averageY }, color: 'yellow' });
    createCommentMarker(commentId, { y: averageY }); // Create marker immediately after saving the comment
    displayAllMarkers(); // Print all markers after saving a new comment
}

toggleCommentButton.addEventListener('click', () => {
    drawingMode = !drawingMode;
    commentBox.style.display = drawingMode ? 'block' : 'none';
    buttonsContainer.style.display = drawingMode ? 'block' : 'none';
    toggleCommentButton.textContent = drawingMode ? 'Exit Comment Mode' : 'Add Comment';
});

// Update the event listener for saving comments
document.getElementById('save-comment').addEventListener('click', () => {
    const commentText = commentInput.value.trim();
    if (commentText) {
        const commentId = `#${commentIdCounter++}`; // Generate unique comment ID
        const commentPosition = { x: viewerElement.clientWidth - 30, y: 20 }; // Fixed x, dynamic y

        saveComment(commentId, commentText, commentPosition);
        commentInput.value = ''; // Clear the input
        commentBox.style.display = 'none'; // Hide comment box

        // Reset states after saving
        drawingMode = false;
        toggleCommentButton.textContent = 'Add Comment';
        buttonsContainer.style.display = 'none'; // Hide the button container
        isCommentVisible = false; // Reset visibility
        commentDisplay.style.display = 'none'; // Hide comment display
    }
});

document.getElementById('cancel-comment').addEventListener('click', () => {
    commentInput.value = ''; // Clear the input
    commentBox.style.display = 'none'; // Hide comment box
});

prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
    }
});

nextPageButton.addEventListener('click', () => {
    if (currentPage < pdfDoc.numPages) {
        currentPage++;
        renderPage(currentPage);
    }
});
