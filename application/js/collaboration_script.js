// Get URL parameter
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(window.location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Get breadcrumb path from URL parameter
const breadcrumbPath = getUrlParameter('breadcrumb');
console.log(breadcrumbPath);

// Display breadcrumb path
if (breadcrumbPath) {
    const breadcrumbElement = document.getElementById('breadcrumb');
    breadcrumbElement.innerText = `Path: ${breadcrumbPath}`;
}

/*
// Data storage for questions and replies
let questionsData = [];
let questionCount = 0; // Tracks the number of questions added
let currentFilter = 'all'; // To track selected category filter
let isEditing = false; // Tracks if we are editing an existing question
let editingQuestionId = null; // Stores the ID of the question being edited

// DOM element references
const addQuestionBtn = document.getElementById('add-question-btn');
const questionButtonsDiv = document.getElementById('question-buttons');
const addEditPopup = document.getElementById('add-edit-question-popup');
const closePopupBtn = document.getElementById('close-popup-btn');
const submitQuestionBtn = document.getElementById('submit-question-btn');
const messageInput = document.getElementById('message');
const fileUploadInput = document.getElementById('file-upload');
const questionsList = document.getElementById('questions-list');
const replyPopup = document.getElementById('reply-popup');
const replyMessageInput = document.getElementById('reply-message');
const replyFileUploadInput = document.getElementById('reply-file-upload');
const submitReplyBtn = document.getElementById('submit-reply-btn');
const collapseBtn = document.getElementById('collapse-btn');
//const sidebar = document.getElementById('sidebar');
const interactionArea = document.getElementById('interaction-area');

let selectedCategoryBubble = '';

// Function to open Add/Edit Question popup
function openAddEditPopup(isEdit = false, questionId = null) {
    addEditPopup.style.display = 'block';
    isEditing = isEdit;
    editingQuestionId = questionId;

    if (isEdit) {
        const question = questionsData.find(q => q.id === questionId);
        if (question) {
            document.getElementById('popup-title').textContent = 'Edit Question';
            messageInput.value = question.message; // Pre-fill message
            selectedCategoryBubble = question.category;
            highlightCategoryBubble(selectedCategoryBubble);
        }
    } else {
        document.getElementById('popup-title').textContent = 'New Question';
        messageInput.value = ''; // Clear message for new question
        selectedCategoryBubble = '';
        highlightCategoryBubble(selectedCategoryBubble);
    }
    fileUploadInput.value = ''; // Clear file input
}

// Function to highlight selected category bubble
function highlightCategoryBubble(selectedCategoryBubble) {
    const categoryBubbles = document.querySelectorAll('.category-bubble');
    categoryBubbles.forEach(bubble => {
        bubble.classList.remove('selected');
        if (bubble.getAttribute('data-category') === selectedCategoryBubble) {
            bubble.classList.add('selected');
        }
    });
}


// Function to filter questions based on selected category
function filterQuestionsByCategory(category) {
    currentFilter = category;
    renderQuestions();  // Re-render questions with filter applied
}

// Event listener for category bubble selection in interaction area
document.querySelectorAll('.bubble').forEach(bubble => {
    bubble.addEventListener('click', () => {
        const category = bubble.getAttribute('data-category');
        filterQuestionsByCategory(category);
    });
});


// Event listener for category bubble selection in Add Question popup
document.querySelectorAll('.category-bubble').forEach(bubble => {
    bubble.addEventListener('click', () => {
        selectedCategoryBubble = bubble.getAttribute('data-category');
        highlightCategoryBubble(selectedCategoryBubble);
    });
});


// Show Add Question popup
addQuestionBtn.addEventListener('click', () => {
    openAddEditPopup();
});


// Close popup when close button is clicked
closePopupBtn.addEventListener('click', () => addEditPopup.style.display = 'none');

// Submit new or edited question
submitQuestionBtn.addEventListener('click', () => {
    const message = messageInput.value.trim();
    const file = fileUploadInput.files[0];

    if (!message || !selectedCategoryBubble) {
        alert('Please enter a message and select a category.');
        return;
    }

    if (isEditing) {
        // Update existing question
        const questionIndex = questionsData.findIndex(q => q.id === editingQuestionId);
        if (questionIndex !== -1) {
            questionsData[questionIndex].message = message;
            questionsData[questionIndex].category = selectedCategoryBubble;
            questionsData[questionIndex].file = file ? file.name : questionsData[questionIndex].file;
        }
    } else {
        // Add new question
        const newQuestion = {
            id: ++questionCount,
            message,
            category: selectedCategoryBubble,
            file: file ? file.name : null,
            user: 'User1',
            avatar: 'https://via.placeholder.com/50',
            replies: []
        };
        questionsData.push(newQuestion);
        addQuestionDetailButton(newQuestion);  // Add new button for the question
    }

    // Render questions and update question button list
    renderQuestions();

    // Close the popup
    addEditPopup.style.display = 'none';
});

// Add button to view question details in the main container
function addQuestionDetailButton(question) {
    const button = document.createElement('button');
    button.className = 'question-btn';
    button.textContent = `question${question.id}`;
    button.onclick = () => viewQuestionDetails(question.id);
    questionButtonsDiv.appendChild(button);
}

// View question details by clicking the button in the main container
function viewQuestionDetails(questionId) {
    const question = questionsData.find(q => q.id === questionId);
    if (question) {
        // Clear questionsList and show only the selected question's details
        questionsList.innerHTML = '';

        const questionElement = document.createElement('div');
        questionElement.className = 'card';

        let categoryClass = '';
        if (question.category === 'urgent') categoryClass = 'block-red';
        if (question.category === 'regular') categoryClass = 'block-green';
        if (question.category === 'followup') categoryClass = 'block-blue';

        questionElement.innerHTML = `
            <div class="card-header">
                <div class="user-info">
                    <img src="${question.avatar}" alt="Avatar" class="avatar" width="30" height="30">
                    <strong>${question.user}</strong>
                </div>
                <div class="category-bubble">
                    <div class="category-block ${categoryClass}"></div>${question.category}
                </div>
                <div class="actions">
                    <button class="subscribe-btn" onclick="subscribeToQuestion(${question.id})">Subscribe</button>
                    <button class="edit-btn" onclick="openAddEditPopup(true, ${question.id})">Edit</button>
                </div>
            </div>
            <textarea class="content-textarea" readonly>${question.message}</textarea>
            ${question.file ? `<a href="#" class="file-link">${question.file}</a>` : ''}
            <button class="reply-btn" onclick="openReplyPopup(${question.id})">Reply</button>
            <div class="reply-section" id="reply-section-${question.id}"></div>`;

        questionsList.appendChild(questionElement);

        renderReplies(questionId);  // Show replies related to this question
    }
}

// Render questions in the interaction area
function renderQuestions() {
    questionsList.innerHTML = '';  // Clear the list

    questionsData
        .filter(question => currentFilter === 'all' || question.category === currentFilter)
        .forEach(question => {
            // Create question card
            const questionElement = document.createElement('div');
            questionElement.className = 'card';

            let categoryClass = '';
            if (question.category === 'urgent') categoryClass = 'block-red';
            if (question.category === 'regular') categoryClass = 'block-green';
            if (question.category === 'followup') categoryClass = 'block-blue';

            questionElement.innerHTML = `
                <div class="card-header">
                    <div class="user-info">
                        <img src="${question.avatar}" alt="Avatar" class="avatar" width="30" height="30">
                        <strong>${question.user}</strong>
                    </div>
                    <div class="category-bubble">
                        <div class="category-block ${categoryClass}"></div>${question.category}
                    </div>
                    <div class="actions">
                        <button class="subscribe-btn" onclick="subscribeToQuestion(${question.id})">Subscribe</button>
                        <button class="edit-btn" onclick="openAddEditPopup(true, ${question.id})">Edit</button>
                    </div>
                </div>
                <textarea class="content-textarea" readonly>${question.message}</textarea>
                ${question.file ? `<a href="#" class="file-link">${question.file}</a>` : ''}
                <button class="reply-btn" onclick="openReplyPopup(${question.id})">Reply</button>
                <div class="reply-section" id="reply-section-${question.id}"></div>`;

            questionsList.appendChild(questionElement);
        });
}


// Open Reply Popup
function openReplyPopup(questionId) {
    replyPopup.style.display = 'block';
    replyMessageInput.value = '';  // Clear reply message
    replyFileUploadInput.value = '';  // Clear file input

    submitReplyBtn.onclick = () => submitReply(questionId);
}

// Close reply popup
document.getElementById('close-reply-popup').addEventListener('click', () => replyPopup.style.display = 'none');

// Submit a reply to a question
function submitReply(questionId) {
    const replyMessage = replyMessageInput.value.trim();
    const replyFile = replyFileUploadInput.files[0];

    if (!replyMessage) {
        alert('Please enter a reply message.');
        return;
    }

    // Find the question to add the reply to
    const question = questionsData.find(q => q.id === questionId);
    if (question) {
        const newReply = {
            id: question.replies.length + 1,
            user: 'User1',
            message: replyMessage,
            file: replyFile ? replyFile.name : null
        };
        question.replies.push(newReply);
    }

    // Render replies
    renderReplies(questionId);
    replyPopup.style.display = 'none';
}

// Render replies for a question
function renderReplies(questionId) {
    const question = questionsData.find(q => q.id === questionId);
    const replySection = document.getElementById(`reply-section-${questionId}`);
    replySection.innerHTML = ''; // Clear replies

    question.replies.forEach(reply => {
        const replyElement = document.createElement('div');
        replyElement.className = 'reply-card';
        replyElement.innerHTML = `
            <div>
                <img src="https://via.placeholder.com/30" alt="Avatar" class="avatar" width="30" height="30">
                <strong>${reply.user}:</strong> 
                <textarea class="content-textarea" readonly>${reply.message}</textarea>
                ${reply.file ? `<a href="#" class="file-link">${reply.file}</a>` : ''}
            </div>
            <button class="like-btn" onclick="toggleLike(this)">&#x2661;</button>
            <button class="edit-btn" onclick="editReply(${questionId}, ${reply.id})">Edit</button>`;
        replySection.appendChild(replyElement);
    });
}

// Edit reply for a question
function editReply(questionId, replyId) {
    const question = questionsData.find(q => q.id === questionId);
    const reply = question.replies.find(r => r.id === replyId);
    if (reply) {
        replyMessageInput.value = reply.message;  // Prefill with existing reply
        replyFileUploadInput.value = '';  // Clear file input for editing

        replyPopup.style.display = 'block';

        submitReplyBtn.onclick = () => {
            reply.message = replyMessageInput.value.trim();
            reply.file = replyFileUploadInput.files[0] ? replyFileUploadInput.files[0].name : reply.file;

            renderReplies(questionId);  // Rerender replies after edit
            replyPopup.style.display = 'none';
        };
    }
}

// Subscribe to a question
function subscribeToQuestion(questionId) {
    const question = questionsData.find(q => q.id === questionId);
    if (question) {
        alert(`You have subscribed to Question ${questionId}. You will receive updates on new replies.`);
    }
}

// Toggle like button for replies
function toggleLike(heartIcon) {
    heartIcon.classList.toggle('liked');
    heartIcon.innerHTML = heartIcon.classList.contains('liked') ? '&#x2665;' : '&#x2661;';
}

// Collapse/Expand the sidebar and interaction area
collapseBtn.addEventListener('click', () => {
    
    interactionArea.classList.toggle('collapsed');  
    collapseBtn.classList.toggle('collapsed');  
    collapseBtn.innerHTML = interactionArea.classList.contains('collapsed') ? '&#x25B6;' : '&#x25C0;';
});
*/
