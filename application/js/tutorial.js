let tutorialPage = 1;

// Tutorial content
const tutorialData = [
  { title: "Welcome to Our Platform!", content: "This is the first page of the tutorial. Here we will introduce you to the basic features." },
  { title: "Feature 1", content: "On this page, we will explain the first important feature." },
  { title: "Feature 2", content: "This is another important feature you should know about." },
  { title: "You're all set!", content: "Congratulations! You've completed the tutorial. Enjoy using our platform!" }
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
