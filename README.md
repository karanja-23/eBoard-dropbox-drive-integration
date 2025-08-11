# e-Board: Dropbox & Google Drive File Synchronization

Integrate Dropbox and Google Drive with your e-Board system to enable effortless file synchronization and management.

## Functionalities
- **Cloud Integration:** Browse and manage files from database and Dropbox/Google Drive together.
- **Download from Cloud:** Retrieve and store cloud files in your local database.
- **Upload to Cloud:** Add files from your local database to Dropbox or Google Drive.

## Setup

1. **Clone the repository:**
   ```bash
   git clone git@github.com:karanja-23/eBoard-dropbox-drive-integration.git
   ```

2. **Back-end setup:**
   ```bash
   cd Server
   pipenv install
   pipenv shell
   python app.py
   ```

3. **Front-end setup:**
    ```bash
    cd Client
    npm install
    ng serve
    ```

## Dropbox Integration

**Official Documentation:**  
[Dropbox HTTP API Documentation](https://www.dropbox.com/developers/documentation/http/documentation)

### Steps to Configure Dropbox Integration

1. **Sign up for a Dropbox Developer Account**  
   Go to the [Dropbox App Console](https://www.dropbox.com/developers/apps/) and log in or create a Dropbox account if you don’t have one.

2. **Create a New Dropbox App**
   - Click **"Create App"**.
   - Choose an API (**Scoped access** is recommended).
   - Select the type of access your app needs:
     - **App folder** – Access to a single folder created specifically for your app.
     - **Full Dropbox** – Access to all files and folders in a user's Dropbox.
   - Name your app (must be unique across Dropbox).

3. **Configure App Permissions**
   - In your app’ permissions module, set the required permissions (scopes) such as `files.content.read`, `files.content.write`, etc.
   - In your apps' settings, add your app’s redirect URIs if you are using OAuth for authentication.

4. **Add App Credentials to Your Project**
   - Copy your **App Key** and **App Secret** from the Dropbox app settings.
   - Configure keys to your project: see:
    ```bash
    /Client/app/environment.ts
    ```
5. **Choose and Integrate Your Dropbox SDK Method**
   - You can use the Dropbox SDK in two main ways:
     - **NPM Package (Recommended for Frontend/Node.js Apps):**  
       _This project uses the NPM package for the frontend._  
       Install with:
       ```bash
       cd Client
       npm install dropbox
       ```
     - **Script Tag (For Plain HTML/JS Apps):**  
       If you want to quickly add Dropbox to a static site, you can include the SDK via CDN:
       ```html
       <script src="https://unpkg.com/dropbox/dist/Dropbox-sdk.min.js"></script>
       ```
       This will expose a global `Dropbox` object for use in your scripts.

   **Note:**  
   - The **NPM package** method is best for production apps using frameworks like Angular, React, or Node.js.
   - The **script tag** method is best for static sites or quick prototypes without a build process.
**Tip:**  
For more details on authentication and API usage, refer to the [Dropbox Developer Guide](https://www.dropbox.com/developers/reference).