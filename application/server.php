<?php
// server.php
header("Content-Type: text/html; charset=UTF-8");
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>PDF Collaboration</title>
    <link rel="stylesheet" href="style.css">
    <script src="/socket.io/socket.io.js"></script>
    <script type="module" src="app.js"></script> <!-- Updated path to your app.js -->
</head>
<body>
    <div id="header">
        <h1>PDF Collaboration</h1>
    </div>
    <div id="viewer-container"></div>
    <div id="comment-box">
        <textarea id="comment-input" placeholder="Type your comment here..."></textarea>
        <button id="save-comment">Save</button>
        <button id="cancel-comment">Cancel</button>
    </div>

    <script>
        const socket = io(); // Initialize Socket.IO

        // Emit drawing data
        function sendDrawData(data) {
            socket.emit('draw', data);
        }

        // Listen for drawing data from other clients
        socket.on('draw', (data) => {
            // Logic to render the drawing from other clients
            drawLine(data);
        });

        // Add drawing event listeners similar to app.js
        // ...

        // Save comment logic here, possibly sending to a server-side PHP script
    </script>
</body>
</html>
