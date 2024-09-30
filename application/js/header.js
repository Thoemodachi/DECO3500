// 動態載入 header.html
fetch('header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('main-header').innerHTML = data;
    })
    .catch(error => console.error('Error loading header:', error));