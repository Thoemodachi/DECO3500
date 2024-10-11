// Current breadcrumb
let breadcrumbPath = null;
breadcrumb = document.getElementById('breadcrumb');

function updateBreadcrumb() {
    breadcrumb.innerHTML = `
        Path:${breadcrumbPath}
    `;
}

// The center point of the campus and the radius (assume the latitude and longitude here are the range of the campus)
const campusCenter = { lat: -27.4995096, lon: 153.0152085 }; // The center point of the campus
const campusRadius = 1; // The radius of the campus (unit: km, assume to be 1 km here)

// Get course and classroom data
Promise.all([
    fetch('./data/courses.json').then(response => response.json()),
    fetch('./data/classrooms.json').then(response => response.json())
])
.then(([coursesData, classroomsData]) => {
    // Get the user's current location
    navigator.geolocation.getCurrentPosition(position => {
        const userLat = position.coords.latitude;
        const userLon = position.coords.longitude;

        // 將課程與使用者當前位置的距離對應起來
        coursesData.courses.forEach(course => {
            const classroom = classroomsData.find(c => c.courseNumber === course.courseNumber);
            if (classroom) {
                course.distance = calculateDistance(userLat, userLon, classroom.latitude, classroom.longitude);
                course.classroomLat = classroom.latitude;  // 教室的緯度
                course.classroomLon = classroom.longitude; // 教室的經度
            } else {
                course.distance = Infinity; // 如果沒有找到位置，設為一個很大的數值
            }
        });

        // 按照與使用者距離排序課程
        coursesData.courses.sort((a, b) => a.distance - b.distance);

        // 計算使用者到校園的距離
        const distanceToCampus = calculateDistance(userLat, userLon, campusCenter.lat, campusCenter.lon);

        // 檢查使用者是否在校園內
        if (distanceToCampus <= campusRadius) {
             // 使用者在校園內，顯示提示訊息
             alert('You are in Campus, the course will be sorted by distance.'); 

            // 顯示排序後的課程
            displayCourses(coursesData);

        } else {
            // 使用者不在校園內，顯示提示訊息
            alert('You are not in Campus, the course wont be sorted by distance.');

            // 不顯示距離的課程
            displayCoursesNoDis(coursesData);            
        }

        
        // 顯示使用者位置
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
        <h2 id="course-number">${course.courseNumber}</h2>
        <h2 id="course-name">${course.courseName}</h2>
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
                    // Clear background color for all courses cards
                    clearAllCoursesBackgrounds();

                    // Set the background color of the clicked course
                    newCourse.style.backgroundColor = 'var(--mintgreen)';
                    newCourse.style.borderColor = 'black';
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

// Function: Clear background color for all courses cards
function clearAllCoursesBackgrounds() {
    let courseCards = document.querySelectorAll('#courses-container .card');
    if (courseCards.length > 0) {
        courseCards.forEach(courseCard => {
            courseCard.style.backgroundColor = 'white';
            courseCard.style.borderColor = 'white';
        });
    }
}

// 在 courses-container 中顯示排序後的課程
function displayCourses(data) {
    const container = document.getElementById('courses-container');
    container.innerHTML = ''; // 清空現有內容
    data.courses.forEach(course => {
        const courseElement = createCourseElement(course);
        container.appendChild(courseElement);
    });
}

// 在 courses-container 中不顯示課程的距離
function displayCoursesNoDis(data) {
    const container = document.getElementById('courses-container');
    container.innerHTML = ''; // 清空現有內容
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
            folderElement.style.borderColor = 'black';
            folderElement.innerHTML = `<h2>${folder.learnFolderName}</h2>`;

            // Add click event to load files when the folder is clicked
            folderElement.addEventListener('click', function() {
                // Update breadcrumb with folder name
                breadcrumbPath += '/' + folder.learnFolderName;
                updateBreadcrumb();

                // Clear background color for all folders cards
                clearAllFoldersBackgrounds();

                // Set the background color of the clicked folder
                folderElement.style.backgroundColor = 'var(--mintgreen)';
                folderElement.style.borderColor = 'black';

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
                // Update breadcrumb with folder name
                breadcrumbPath += '/' + folder.assessmentFolderName;
                updateBreadcrumb();

                // Clear background color for all folders cards
                clearAllFoldersBackgrounds();

                // Set the background color of the clicked folder
                folderElement.style.backgroundColor = 'var(--mintgreen)';
                folderElement.style.borderColor = 'black';

                displayAssessmentFiles(folder.assessmentFiles);
            });

            foldersContainer.appendChild(folderElement);
        });
    } else {
        foldersContainer.innerHTML = '<p>No folders available for this course.</p>';
    }
}

// Function: Clear background color for all folders cards
function clearAllFoldersBackgrounds() {
    let folderCards = document.querySelectorAll('#folders-container .card');
    if (folderCards.length > 0) {
        folderCards.forEach(folderCard => {
            folderCard.style.backgroundColor = 'white';
            folderCard.style.borderColor = 'darkgray';
        });
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
            fileElement.innerHTML = 
            `
            <h2>${file.learnFileName}</h2>
            `;
            fileElement.style.display = 'flex';
            fileElement.style.flexDirection = 'row';

            // Add click event to the fileElement div
            if (file.learnFilePath) {
                fileElement.addEventListener('click', function() {
                    breadcrumbPath += '/' + file.learnFileName;  // Update breadcrumb with file name
                    updateBreadcrumb();  // Refresh breadcrumb display

                    // Clear background color for all files cards
                    clearAllFilesBackgrounds();

                    // Set the background color of the clicked file
                    fileElement.style.backgroundColor = 'var(--mintgreen)';
                    fileElement.style.borderColor = 'black';

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
            fileElement.innerHTML = 
            `
            <i class="fa-regular fa-folder"></i>
            <h2>${file.assessmentFileName}</h2>
            `;

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

// Function: Clear background color for all files cards
function clearAllFilesBackgrounds() {
    let fileCards = document.querySelectorAll('#files-container .card');
    if (fileCards.length > 0) {
        fileCards.forEach(fileCard => {
            fileCard.style.backgroundColor = 'white';
            fileCard.style.borderColor = 'darkgray';
        });
    }
}

const learningBtn = document.getElementById('learning-btn');
const assessmentBtn = document.getElementById('assessment-btn');

learningBtn.style.backgroundColor = 'var(--lgtgreen)';

learningBtn.addEventListener('click', function() {
    folderType = "learnFolders";
    if (currentSelectedCourse) {
        displayFolders(currentSelectedCourse, folderType);
    }
    learningBtn.style.backgroundColor = 'var(--lgtgreen)';
    assessmentBtn.style.backgroundColor = 'var(--logogreen)';
});

assessmentBtn.addEventListener('click', function() {
    folderType = "assessementFolders";
    if (currentSelectedCourse) {
        displayFolders(currentSelectedCourse, folderType);
    }
    assessmentBtn.style.backgroundColor = 'var(--lgtgreen)';
    learningBtn.style.backgroundColor = 'var(--logogreen)';
});

// Helper function: Calculate distance using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // 地球半徑，單位為公里
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // 距離，單位為公里
}

// Show the user's latitude and longitude on the page
function displayUserLocation(lat, lon) {
    //const userLocationElement = document.getElementById('user-location');
    //userLocationElement.innerHTML = `your location： ${lat}, ${lon}`;
    console.log(`Your current location： ${lat}, ${lon}`);
}
