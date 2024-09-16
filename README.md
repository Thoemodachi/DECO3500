Collaborative University Document Discussion Board

# Project Dependencies

## Backend Dependencies

1. **Express**: A fast, unopinionated, minimalist web framework for Node.js.

   - **Installation**:
     ```bash
     npm install express
     ```

2. **PDF.js**: A library for rendering PDFs in the browser.

   - **Installation**: Include via CDN in your HTML file, no `npm` installation required.
     ```html
     <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js"></script>
     ```

3. **Socket.io**: Enables real-time, bidirectional, and event-based communication.

   - **Installation**:
     ```bash
     npm install socket.io
     ```

## Frontend Dependencies

1. **CSS Stylesheets**: For styling the web pages.

   - **Installation**: No installation required; add CSS files to the `public` directory.

2. **JavaScript Libraries**: For handling PDF rendering and interactions.

   - **Installation**: Included via CDN or local scripts in your HTML files.

## Additional Notes

- **Folder Structure**:
  - `public/` directory should contain your `style.css`, `pdf-viewer.js`, and image files.
  - Place the back arrow image in `public/images/back-arrow.png`.

- **Example `package.json` Dependencies**:

  ```json
  {
    "name": "project",
    "version": "1.0.0",
    "description": "A project with PDF viewer and real-time collaboration",
    "main": "server.js",
    "scripts": {
      "start": "node server.js"
    },
    "dependencies": {
      "express": "^4.18.2",
      "socket.io": "^4.7.1"
    }
  }
