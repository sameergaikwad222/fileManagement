# File Management System with Express Node.js

This project is a simple file management system built using Express.js and Node.js. It allows users to upload, list, and delete files on the server.

## Features

- **Upload Files**: Users can upload files to the server.
- **List Files**: Users can view a list of all uploaded files.
- **Delete Files**: Users can delete files from the server.

## Technologies Used

- **Express.js**: A web application framework for Node.js used to build the server-side application.
- **Node.js**: A JavaScript runtime used for building scalable network applications.
- **Multer**: Middleware for handling `multipart/form-data`, primarily used for uploading files.
- **JWT** Middleware for Token based Authorizations.
- **Rate-Limiter** Middleware for rate limiting to avoid DDoS attacks
- **Mongoose** ODM for interacting with Mongo DB
- **In-Built Crypto Module** for efficient password hashings with salts

## Setup Instructions

1. Clone the repository: `git clone <repository-url>`
2. Navigate to the project directory: `cd file-management-system`
3. Install dependencies: `npm install`
4. Setup Config File with Mongo DB URL (Setup MongoDB atlas URL or Local mongodb with Docker)
5. Start the server: `npm start`
6. Open your web browser and go to `http://localhost:3000` to access the application.

## Usage

1. **Upload Files**:
   - Click on the "Upload" button to select files from your local system.
   - Once selected, click on the "Upload" button to upload the files to the server.
2. **List Files**:

   - The homepage displays a list of all files uploaded to the server.
   - Each file entry includes options to download or delete the file.

3. **Delete Files**:
   - To delete a file, click on the "Delete" button next to the respective file entry.
   - Confirm the deletion when prompted.

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork the repository on GitHub.
2. Clone the forked repository to your local machine.
3. Create a new branch to work on: `git checkout -b feature/my-feature`.
4. Commit your changes: `git commit -am 'Add new feature'`.
5. Push to the branch: `git push origin feature/my-feature`.
6. Submit a pull request detailing your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
