// Current breadcrumb
let breadcrumbPath = null;
breadcrumb = document.getElementById('breadcrumb');

function updateBreadcrumb() {
    breadcrumb.innerHTML = `
        Path:${breadcrumbPath}
    `;
}

// Fetch course data from courses.json
fetch('./data/courses.json')
    .then(response => response.json())
    .then(data => displayCourses(data))
    .catch(error => console.error('Error:', error));

// Selected course
let currentSelectedCourse = null;

// Default folder type
let folderType = "learnFolders";

// Function: Create a course element
function createCourseElement(course) {
    const newCourse = document.createElement('div');
    newCourse.classList.add('card');
    newCourse.innerHTML = `
        <h2>${course.courseNumber}</h2>
        <h2>${course.courseName}</h2>
    `;

    // Lazy load folders when course element comes into view
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Display folders once the course element is visible
                newCourse.addEventListener('click', function () {
                    currentSelectedCourse = course;
                    displayFolders(course, folderType);
                });
                observer.unobserve(newCourse);  // Stop observing once loaded
            }
        });
    });

    observer.observe(newCourse);  // Start observing the course element

    return newCourse;
}

// Display courses in the courses-container
function displayCourses(data) {
    const container = document.getElementById('courses-container');
    data.courses.forEach(courses => {
        const courseElement = createCourseElement(courses);
        container.appendChild(courseElement);
    });
}

// Display folders of a selected course
function displayFolders(course, folderType) {
    const foldersContainer = document.getElementById('folders-container');
    const filesContainer = document.getElementById('files-container');
    foldersContainer.innerHTML = ''; // Clear any existing folders
    filesContainer.innerHTML = ''; // Clear any existing files

    breadcrumbPath = course.courseName;
    updateBreadcrumb();

    if (folderType === "learnFolders" && 
        course.learnFolders && 
        course.learnFolders.length > 0) {
        
        course.learnFolders.forEach(folder => {
            const folderElement = document.createElement('div');
            folderElement.classList.add('card');
            folderElement.innerHTML = `<h2>${folder.learnFolderName}</h2>`;

            // Add click event to load files when the folder is clicked
            folderElement.addEventListener('click', function() {
                breadcrumbPath += '/' + folder.learnFolderName;  // Update breadcrumb with folder name
                updateBreadcrumb();
                displayLearnFiles(folder.learnFiles);
            });

            foldersContainer.appendChild(folderElement);
        });
    } else if (folderType === "assessementFolders" && 
        course.assessementFolders && 
        course.assessementFolders.length > 0) {
        
        course.assessementFolders.forEach(folder => {
            const folderElement = document.createElement('div');
            folderElement.classList.add('card');
            folderElement.innerHTML = `<h2>${folder.assessmentFolderName}</h2>`;

            // Add click event to load files when the folder is clicked
            folderElement.addEventListener('click', function() {
                breadcrumbPath += '/' + folder.assessmentFolderName;  // Update breadcrumb with folder name
                updateBreadcrumb();
                displayAssessmentFiles(folder.assessmentFiles);
            });

            foldersContainer.appendChild(folderElement);
        });
    } else {
        foldersContainer.innerHTML = '<p>No folders available for this course.</p>';
    }
}

// Display learning resource files of a selected folder
function displayLearnFiles(files) {
    const filesContainer = document.getElementById('files-container');
    filesContainer.innerHTML = ''; // Clear any existing files

    if (files && files.length > 0) {
        files.forEach(file => {
            const fileElement = document.createElement('div');
            fileElement.classList.add('card');
            fileElement.innerHTML = `<h2>${file.learnFileName}</h2>`;

            // Add click event to the fileElement div
            if (file.learnFilePath) {
                fileElement.addEventListener('click', function() {
                    breadcrumbPath += '/' + file.learnFileName;  // Update breadcrumb with file name
                    updateBreadcrumb();  // Refresh breadcrumb display

                    // Redirect to collaboration.html with file name as URL parameter
                    const fileNameEncoded = encodeURIComponent(file.learnFileName);
                    const filePathEncoded = encodeURIComponent(file.learnFilePath);
                    const breadcrumbEncoded = encodeURIComponent(breadcrumbPath);
                    window.location.href = `collaboration.html?fileName=${fileNameEncoded}&filePath=${filePathEncoded}&breadcrumb=${breadcrumbEncoded}`;
                });
                fileElement.style.cursor = 'pointer'; // Change cursor to pointer to indicate it's clickable
            } else {
                fileElement.innerHTML += `<p>No file available</p>`;
                fileElement.style.cursor = 'default';
            }

            filesContainer.appendChild(fileElement);
        });
    } else {
        filesContainer.innerHTML = '<p>No files available in this folder.</p>';
    }
}

// Display assessment files of a selected folder
function displayAssessmentFiles(files) {
    const filesContainer = document.getElementById('files-container');
    filesContainer.innerHTML = ''; // Clear any existing files

    if (files && files.length > 0) {
        files.forEach(file => {
            const fileElement = document.createElement('div');
            fileElement.classList.add('card');
            fileElement.innerHTML = `<h2>${file.assessmentFileName}</h2>`;

            // Add click event to the fileElement div
            if (file.assessmentFilePath) {
                fileElement.addEventListener('click', function() {
                    breadcrumbPath += '/' + file.assessmentFileName;  // Update breadcrumb with file name
                    updateBreadcrumb();  // Refresh breadcrumb display

                    // Redirect to collaboration.html with file name as URL parameter
                    const fileNameEncoded = encodeURIComponent(file.assessmentFileName);
                    const filePathEncoded = encodeURIComponent(file.assessmentFilePath);
                    const breadcrumbEncoded = encodeURIComponent(breadcrumbPath);
                    window.location.href = `collaboration.html?fileName=${fileNameEncoded}&filePath=${filePathEncoded}&breadcrumb=${breadcrumbEncoded}`;
                });
                fileElement.style.cursor = 'pointer'; // Change cursor to pointer to indicate it's clickable
            } else {
                fileElement.innerHTML += `<p>No file available</p>`;
                fileElement.style.cursor = 'default';
            }

            filesContainer.appendChild(fileElement);
        });
    } else {
        filesContainer.innerHTML = '<p>No files available in this folder.</p>';
    }
}

document.getElementById('learning-btn').addEventListener('click', function() {
    folderType = "learnFolders";
    if (currentSelectedCourse) {
        displayFolders(currentSelectedCourse, folderType);
    }
});

document.getElementById('assessment-btn').addEventListener('click', function() {
    folderType = "assessementFolders";
    if (currentSelectedCourse) {
        displayFolders(currentSelectedCourse, folderType);
    }
});