// Current breadcrumb
let breadcrumbPath = null;
breadcrumb = document.getElementById('breadcrumb');

function updateBreadcrumb() {
    breadcrumb.innerHTML = `
        Path:${breadcrumbPath}
    `;
}

// The center point of the campus and its radius
const campusCenter = { lat: -27.4995096, lon: 153.0152085 };  // Campus center point 
const campusRadius = 1; // Campus radius (unit: kilometers, assumed to be 1 km here)

// Fetch course and classroom data
Promise.all([
    fetch('./data/courses.json').then(response => response.json()),
    fetch('./data/classrooms.json').then(response => response.json())
])
.then(([coursesData, classroomsData]) => {
    // Get user's current location
    navigator.geolocation.getCurrentPosition(position => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        // Map courses to their distances from the user's current location
        coursesData.courses.forEach(course => {
            const classroom = classroomsData.find(c => c.courseNumber === course.courseNumber);
            if (classroom) {
                course.distance = calculateDistance(userLat, userLon, classroom.latitude, classroom.longitude);
                course.classroomLat = classroom.latitude;  // Classroom latitude
                course.classroomLon = classroom.longitude; // Classroom longitude
            } else {
                course.distance = Infinity; // If no location is found, set a very large value
            }
        });

        // Sort courses by distance from the user
        coursesData.courses.sort((a, b) => a.distance - b.distance);

        // Calculate the user's distance to the campus center
        const distanceToCampus = calculateDistance(userLat, userLon, campusCenter.lat, campusCenter.lon);

        // Check if the user is inside the campus
        if (distanceToCampus <= campusRadius) {
             // User is on campus, show a message
             alert('You are in Campus, the course will be sorted by distance.'); 

            // Display the sorted courses
            displayCourses(coursesData);

        } else {
            // User is not on campus, show a message
            alert('You are not in Campus, the course wont be sorted by distance.');

            // Display courses without showing the distance
            displayCoursesNoDis(coursesData);            
        }
        
        // Display the user's location
        displayUserLocation(userLat, userLon);
    });
})
.catch(console.log("Error loading course data"));

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
        <p>Distance:${course.distance.toFixed(2)} km</p>
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

// Function: Create a course element
function createCourseElementNoDis(course) {
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

// showing courses in the displayCoursesNoDis
function displayCourses(data) {
    const container = document.getElementById('displayCoursesNoDis');
    container.innerHTML = ''; // clean any existing courses
    data.courses.forEach(course => {
        const courseElement = createCourseElement(course);
        container.appendChild(courseElement);
    });
}

// dont display distance
function displayCoursesNoDis(data) {
    const container = document.getElementById('courses-container');
    container.innerHTML = ''; // clean any existing courses
    data.courses.forEach(course => {
        const courseElement = createCourseElementNoDis(course);
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
            currentBreadcrumb = breadcrumbPath;

            // Add click event to load files when the folder is clicked
            folderElement.addEventListener('click', function() {
                breadcrumbPath = currentBreadcrumb + '/' + folder.learnFolderName;  // Update breadcrumb with folder name
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
            currentBreadcrumb = breadcrumbPath;

            // Add click event to load files when the folder is clicked
            folderElement.addEventListener('click', function() {
                breadcrumbPath = currentBreadcrumb + '/' + folder.assessmentFolderName;  // Update breadcrumb with folder name
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

// use Haversine formula to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // earth radius in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // distance in km
}

// display user location
function displayUserLocation(lat, lon) {
    const userLocationElement = document.getElementById('user-location');
    userLocationElement.innerHTML = `your location： ${lat}, ${lon}`;
}
