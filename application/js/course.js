// Fetch course data from courses.json
fetch('./data/courses.json')
    .then(response => response.json())
    .then(data => displayCourses(data))
    .catch(error => console.error('Error:', error));

// Function: Create a course element
function createCourseElement(course) {
    const newCourse = document.createElement('div');
    newCourse.classList.add('card');
    newCourse.innerHTML = `
        <h2>${course.courseNumber}</h2>
        <h2>${course.courseName}</h2>
    `;

    newCourse.addEventListener('click', function() {
        displayFolders(course);
    });

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
function displayFolders(course) {
    const foldersContainer = document.getElementById('folders-container');
    const filesContainer = document.getElementById('files-container');
    foldersContainer.innerHTML = ''; // Clear any existing folders
    filesContainer.innerHTML = ''; // Clear any existing files

    // Check if the course has learnFolders
    if (course.learnFolders && course.learnFolders.length > 0) {
        course.learnFolders.forEach(folder => {
            const folderElement = document.createElement('div');
            folderElement.classList.add('card');
            folderElement.innerHTML = `<h2>${folder.learnFolderName}</h2>`;

            // Add click event to load files when the folder is clicked
            folderElement.addEventListener('click', function() {
                displayFiles(folder.learnFiles);
            });

            foldersContainer.appendChild(folderElement);
        });
    } else {
        foldersContainer.innerHTML = '<p>No folders available for this course.</p>';
    }
}

// Display files of a selected folder
function displayFiles(files) {
    const filesContainer = document.getElementById('files-container');
    filesContainer.innerHTML = ''; // Clear any existing files

    if (files && files.length > 0) {
        files.forEach(file => {
            const fileElement = document.createElement('div');
            fileElement.classList.add('card');
            fileElement.innerHTML = `<h2>${file.learnFileName}</h2>`;

            // Add click event to the fileElement div
            if (file.learnFileLink) {
                fileElement.addEventListener('click', function() {
                    window.open(file.learnFileLink, '_blank');
                });
                fileElement.style.cursor = 'pointer'; // Change cursor to pointer to indicate it's clickable
            } else {
                fileElement.innerHTML += `<p>No file link available</p>`;
                fileElement.style.cursor = 'default';
            }

            filesContainer.appendChild(fileElement);
        });
    } else {
        filesContainer.innerHTML = '<p>No files available in this folder.</p>';
    }
}
