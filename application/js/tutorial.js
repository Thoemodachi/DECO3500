let tutorialPage = 1;

// Tutorial content
const tutorialData = [
  { 
    title: "Welcome to COED-3500!", 
    content: "Here you can easily manage your courses, access learning materials, and engage in discussions with other users. Let’s take a quick tour of the key features!" 
  },
  { 
    title: "Manage Your Courses", 
    content: "You can see all your enrolled courses here. Click on a course to access its resources and assessments. Use the weekly folders to navigate through the materials of each course." 
  },
  { 
    title: "Comment and Engage", 
    content: "You can add comments or questions on any content. Simply click the 'Add Comment' button, select the comment category, and submit your message. You can also filter comments based on their urgency level." 
  },
  { 
    title: "Submit Questions and Files", 
    content: "When asking a question, you can also upload files to provide more context. Don’t forget to respond to your peers’ comments by clicking the 'Reply' button." 
  }
];

// Show tutorial page
function showTutorialPage(page) {
  document.getElementById("popup-tutorial-title").innerText = tutorialData[page - 1].title;
  document.getElementById("popup-tutorial-content").innerText = tutorialData[page - 1].content;

  const nextButton = document.getElementById("popup-tutorial-next");
  if (page === tutorialData.length) {
    nextButton.innerText = "Complete";
  } else {
    nextButton.innerText = "Next";
  }
}

// Handle click on next page
document.getElementById("popup-tutorial-next").addEventListener("click", function () {
  if (tutorialPage < tutorialData.length) {
    tutorialPage++;
    showTutorialPage(tutorialPage);
  } else {
    closeTutorial();
  }
});

// Handle click on skip tutorial
document.getElementById("popup-tutorial-skip").addEventListener("click", function () {
  closeTutorial();
});

// Close tutorial and record to localStorage
function closeTutorial() {
  document.getElementById("popup-tutorial-overlay").style.display = "none";
  localStorage.setItem("tutorialSeen", "true");
}

// Check if tutorial needs to be shown on page load
window.onload = function () {
  if (!localStorage.getItem("tutorialSeen")) {
    document.getElementById("popup-tutorial-overlay").style.display = "flex";
    showTutorialPage(tutorialPage);
  }
};
