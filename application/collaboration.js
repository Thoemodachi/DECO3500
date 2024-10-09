import { getDocument, GlobalWorkerOptions } from './pdfjs/build/pdf.mjs';

GlobalWorkerOptions.workerSrc = './pdfjs/build/pdf.worker.mjs';
// Global variable to track if we are in "adding comment" mode
window.isAddingComment = false;
window.currentCommentId = null; // To store the current comment ID when creating a new comment
let viewerElement; // Declare viewerElement globally
window.alreadyPlacedMarker = false;
const commentBox = document.getElementById('comment-box');
const commentInput = document.getElementById('comment-input');
const toggleCommentButton = document.getElementById('toggle-comment');
const buttonsContainer = document.getElementById('buttons');
const pageInfo = document.getElementById('page-info');
const commentDisplay = document.getElementById('comment-display');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');

let pdfDoc = null;
window.currentPage = 1;
window.pagesData = {}; // Store all drawings and comments for each page

// Load the PDF document
const url = 'media/files/assignment_1.pdf';

getDocument(url).promise.then(pdf => {
    pdfDoc = pdf;
    // Initialize pagesData for each page
    for (let i = 1; i <= pdfDoc.numPages; i++) {
        pagesData[i] = { questionsData: [], markers: [] }; // Initialize for each page
    }
    renderPage(currentPage);
});


async function renderPage(pageNumber) {
    if (!viewerElement) {
        viewerElement = document.getElementById('viewer-container'); // Initialize if not set
    }
    // Clear the viewer element before rendering the new page
    viewerElement.innerHTML = '';

    // Existing code to render the PDF page
    const page = await pdfDoc.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    viewerElement.appendChild(canvas);

    const renderContext = {
        canvasContext: context,
        viewport: viewport,
    };
    await page.render(renderContext).promise;

    // Check if there are markers to display for the current page
    if (pagesData[currentPage] && pagesData[currentPage].markers) {
        console.log("This is when adding pages: " + pagesData[currentPage].markers.length);
        pagesData[currentPage].markers.forEach(marker => {
            const circleMarker = document.createElement('div');
            circleMarker.className = 'circle-marker';
            circleMarker.style.position = 'absolute';
            circleMarker.style.width = '20px';
            circleMarker.style.height = '20px';
            circleMarker.style.borderRadius = '50%';
            circleMarker.style.backgroundColor = 'rgba(255, 0, 0, 0.3)'; // Red color with 30% opacity
            circleMarker.style.left = `${marker.position.x}px`; // Use stored x position
            circleMarker.style.top = `${marker.position.y}px`; // Use stored y position
            circleMarker.style.cursor = 'pointer';
            viewerElement.appendChild(circleMarker);

            // Add click event to the marker
            circleMarker.addEventListener('click', () => {
                console.log(marker.commentId);
                displayComment(marker.commentId);
            });
        });
    }
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

// Function to close the add/edit popup (you can define this as needed)
function closeAddEditPopup() {
    addEditPopup.style.display = 'none'; // Close the popup
}



// Event listener for the toggle comment button
toggleCommentButton.addEventListener('click', () => {
    if (!isAddingComment) {
        isAddingComment = true; // Enable adding comment mode
        toggleCommentButton.textContent = "Cancel"; // Change button text to "Cancel"
    } else {
        // Cancel adding comment
        isAddingComment = false;
        toggleCommentButton.textContent = "Add Comment"; // Reset button text
        closeAddEditPopup(); // Close the popup if it's open
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const viewerElement = document.getElementById('viewer-container');
    const messageInput = document.getElementById('message'); // Assuming this is the input field
    const submitButton = document.getElementById('submit-question-btn'); // The button to submit the comment
    
    viewerElement.addEventListener('click', (event) => {
        if (isAddingComment) {
            isAddingComment = true;
            const rect = viewerElement.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const circleMarker = document.createElement('div');
            if (!alreadyPlacedMarker) {
                alreadyPlacedMarker = true;
                circleMarker.className = 'circle-marker';
                circleMarker.style.position = 'absolute';
                circleMarker.style.width = '20px';
                circleMarker.style.height = '20px';
                circleMarker.style.borderRadius = '50%';
                circleMarker.style.backgroundColor = 'rgba(255, 0, 0, 0.3)'; // Red color with 30% opacity
                circleMarker.style.left = `${x - 10}px`;
                circleMarker.style.top = `${y - 10}px`;
                circleMarker.style.cursor = 'pointer';
                viewerElement.appendChild(circleMarker);
                // Toggle the visibility of the popup based on its current display style
                addEditPopup.style.display = addEditPopup.style.display === 'block' ? 'none' : 'block';
                openAddEditPopup(); // Open the popup, regardless of its current state
                
                // Add click event to the circle marker
                circleMarker.addEventListener('click', () => {
                    if (currentCommentId) {
                        displayComment(currentCommentId);
                    }
                });

                openAddEditPopup();

                submitButton.onclick = () => {
                    // check here next
                    const message = messageInput.value.trim();

                    const markerData = {
                        commentId: currentCommentId, // Store the comment ID
                        position: { x: x - 10, y: y - 10 } // Store the position (adjust for centering)
                    };
                    pagesData[currentPage].markers.push(markerData); // Push the marker data to the array

                    // isAddingComment = false;
                    
                    messageInput.value = ''; // Clear the input
                    
                };
            }
            
        }
    });
});

document.getElementById('cancel-btn').addEventListener('click', () => {
    commentInput.value = ''; // Clear the input
    commentBox.style.display = 'none'; // Hide comment box
});
// Function to update the page information text
function updatePageInfo() {
    const pageInfoElement = document.getElementById('page-info');
    if (pageInfoElement) {
        pageInfoElement.textContent = "Page: " + currentPage; // Update the text
    }
}

prevPageButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        console.log(pagesData[currentPage].questionsData);
        console.log(pagesData[currentPage].markers);
        renderPage(currentPage);
        updatePageInfo();
    }
});

nextPageButton.addEventListener('click', () => {
    if (currentPage > pdfDoc.numPages) {
        openReplyPopup(0);
    }
    if (currentPage < pdfDoc.numPages) {
        currentPage++;
        console.log(pagesData[currentPage].questionsData);
        console.log(pagesData[currentPage].markers);
        renderPage(currentPage);
        updatePageInfo();
    }
});