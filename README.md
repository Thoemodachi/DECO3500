# General Functionality
Refer to the Wiki [Website Showcase](https://github.com/Thoemodachi/DECO3500/wiki/Multi%E2%80%90User-Experience-(Simulation)) for the general functionality of COED3500. Please set up XAMPP or your own alternative tool to access the website, refer below for set up help.
![Collaboration Page](https://github.com/Thoemodachi/DECO3500/raw/main/collaboration_page.png)

# Installing Necessary Tools (XAMPP)
## Setting Up XAMPP and Configuring Apache for Your PHP Project

### 1. **Download and Install XAMPP**
   - Visit the [XAMPP website](https://www.apachefriends.org/index.html).
   - Download the version of XAMPP compatible with your system (Windows, macOS, or Linux).
   - Install XAMPP following the on-screen instructions.

### 2. **Start XAMPP**
   - Open the XAMPP Control Panel.
   - Start the Apache service by clicking the "Start" button next to it.

### 3. **Configure Apache to Point to `DECO3500/application`**
   - Locate the `httpd.conf` file:
     - Go to your XAMPP installation folder. The path is usually `C:/xampp/apache/conf/httpd.conf` (on Windows) or `/Applications/XAMPP/xamppfiles/etc/httpd.conf` (on macOS).
   - Open `httpd.conf` in a text editor.
   - Search for the line:
     ```
     DocumentRoot "C:/xampp/htdocs"
     ```
     You’ll also find a corresponding `<Directory>` tag. For example:
     ```apache
     <Directory "C:/xampp/htdocs">
         Options Indexes FollowSymLinks Includes ExecCGI
         AllowOverride All
         Require all granted
     </Directory>
     ```
   - Change both the `DocumentRoot` and `<Directory>` to your GitHub repo's `application` folder path. For example:
     ```apache
     DocumentRoot "C:/path/to/your/repo/DECO3500/application"
     <Directory "C:/path/to/your/repo/DECO3500/application">
         Options Indexes FollowSymLinks Includes ExecCGI
         AllowOverride All
         Require all granted
     </Directory>
     ```
   - Save the `httpd.conf` file and close the editor.

### 4. **Restart Apache**
   - Go back to the XAMPP Control Panel.
   - Click "Stop" next to Apache and then click "Start" again to restart Apache.

### 5. **Test Your Setup**
   - Open a web browser and type in `http://localhost`.
   - It should load the PHP files from your `DECO3500/application` directory.

### 6. **Troubleshooting**
   - If the web page does not load, check the XAMPP Control Panel for any error messages.
   - Verify that the paths in `httpd.conf` are correct.
   - Ensure that Apache is running without conflicts (e.g., make sure no other service is using port 80).

### 7. **Running The Website**
   - Type 'http://localhost/Login.html' to begin testing the product
