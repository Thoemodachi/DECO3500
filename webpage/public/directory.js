document.addEventListener('DOMContentLoaded', () => {
    fetch('/files')
      .then(response => response.json())
      .then(files => {
        const directoryList = document.getElementById('directory-list');
  
        files.forEach(file => {
          const item = document.createElement('div');
          item.className = 'directory-item';
  
          if (file.isDirectory) {
            // Folder
            item.innerHTML = `
              <img src="/images/folder.png" alt="Folder">
              <p>${file.name}</p>
            `;
            item.addEventListener('click', () => {
              window.location.href = `/folder/${file.name}`;
            });
          } else {
            // File
            item.innerHTML = `
              <img src="/images/file.png" alt="File">
              <p>${file.name}</p>
            `;
            item.addEventListener('click', () => {
              window.location.href = `/pdf/${file.name}`;
            });
          }
  
          directoryList.appendChild(item);
        });
      })
      .catch(error => {
        console.error('Error fetching files:', error);
      });
  });
  