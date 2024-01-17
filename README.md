# Denmark Backend

Welcome to the backend of Denmark, This README will guide you through the setup and architecture of the backend system.

## Tech Stack

- **Node.js:** JavaScript runtime for server-side development.
- **Express:** Web framework for Node.js to build robust APIs.
- **MongoDB:** NoSQL database for storing data in a flexible, JSON-like format.
- **MVC Architecture:** Model-View-Controller architectural pattern for better code organization.

## Project Structure

The backend follows the MVC architecture for a clean and modular structure:

- **`/models`:** Contains MongoDB models for data schema.
- **`/controllers`:** Controllers handle the business logic and interact with models.
- **`/views`:** <No views.>.
- **`/routes`:** Express routes define the API endpoints and connect to controllers.






# team.controllers

### 1. Create a new team
- **Endpoint:** `POST /team/create/new`
- **Middleware:** `jsonParser`
- **Controller:** `teamController.createNewTeam`

This endpoint is used to create a new team. The request should include the necessary data in JSON format, and the `jsonParser` middleware is likely used to parse the incoming JSON. The `teamController.createNewTeam` function handles the logic of creating a new team.

### 2. Get current team by ID
- **Endpoint:** `GET /team/:id`
- **Middleware:** `jsonParser`
- **Controller:** `teamController.currentTeamById`

This endpoint retrieves information about a team based on its unique identifier (`:id`). The `jsonParser` middleware is used, and the `teamController.currentTeamById` function handles the logic of fetching the team data.

### 3. Create a new task
- **Endpoint:** `POST /team/newtask`
- **Middleware:** `jsonParser`
- **Controller:** `teamController.createNewTask`

This endpoint is responsible for creating a new task within a team. Similar to creating a team, the request should include task details in JSON format, and the `teamController.createNewTask` function manages the creation of the task.

### 4. Add a comment to a task
- **Endpoint:** `PATCH /team/:teamid/task/:taskid/addcomment`
- **Middleware:** `jsonParser`
- **Controller:** `teamController.addNewComment`

This endpoint allows users to add comments to a specific task identified by `:teamid` and `:taskid`. The `jsonParser` middleware is used, and the `teamController.addNewComment` function handles the addition of comments.

### 5. Manage team invitations
- **Endpoint:** `POST /team/invite/user`
- **Middleware:** `jsonParser`
- **Controller:** `teamController.manageInvite`

This endpoint is likely used to manage team invitations. Users can send and respond to team invitations using this endpoint. The `jsonParser` middleware is applied, and the `teamController.manageInvite` function handles the invitation management logic.

### 6. Add a new user to a team
- **Endpoint:** `POST /team/add/user`
- **Middleware:** `jsonParser`
- **Controller:** `teamController.addNewUserToTeam`

This endpoint allows the addition of a new user to an existing team. The `jsonParser` middleware is used, and the `teamController.addNewUserToTeam` function handles the user addition process.

### 7. Handle team configuration
- **Endpoint:** `POST /team/config`
- **Middleware:** `jsonParser`
- **Controller:** `teamController.handleTeamConfig`

This endpoint is used to handle configuration settings for a team. It allows updating and configuring various aspects of the team. The `jsonParser` middleware is applied, and the `teamController.handleTeamConfig` function manages the team configuration logic.

### 8. Delete a user from a team
- **Endpoint:** `POST /team/deleteUser`
- **Middleware:** `jsonParser`
- **Controller:** `teamController.deleteUserFromTeam`

This endpoint is responsible for removing a user from a team. The `jsonParser` middleware is used, and the `teamController.deleteUserFromTeam` function handles the user removal process.

These endpoints collectively provide a comprehensive set of functionalities for managing teams, tasks, users, and team configurations through a web API.



# user.controllers

### 1. Create a new user
- **Endpoint:** `POST /user/create/new`
- **Middleware:** `jsonParser`
- **Controller:** `userController.createUser`

This endpoint is used to create a new user. The request should include the necessary user data in JSON format, and the `jsonParser` middleware is employed to parse the incoming JSON. The `userController.createUser` function manages the logic of user creation.

### 2. Get current user
- **Endpoint:** `GET /user/get/current`
- **Middleware:** `jsonParser`
- **Controller:** `userController.currentUser`

This endpoint retrieves information about the current user. The `jsonParser` middleware is applied, and the `userController.currentUser` function handles the logic of fetching the details of the currently authenticated user.

### 3. User login
- **Endpoint:** `POST /user/login`
- **Middleware:** `jsonParser`
- **Controller:** `userController.loginUser`

This endpoint is responsible for user authentication and login. The request should include user credentials in JSON format, and the `jsonParser` middleware is used. The `userController.loginUser` function manages the user login logic.

### 4. User logout
- **Endpoint:** `POST /user/logout`
- **Middleware:** `jsonParser`
- **Controller:** `userController.logOut`

This endpoint handles user logout. The `jsonParser` middleware is applied, and the `userController.logOut` function manages the user logout logic.

### 5. Edit user profile
- **Endpoint:** `PATCH /user/profile/edit`
- **Middleware:** `jsonParser`
- **Controller:** `userController.manageProfile`

This endpoint allows users to edit their profiles. The `jsonParser` middleware is used, and the `userController.manageProfile` function manages the logic of updating user profile information.

### 6. Get user by ID
- **Endpoint:** `GET /user/:userid`
- **Middleware:** `jsonParser`
- **Controller:** `userController.getUser`

This endpoint retrieves information about a user based on their unique identifier (`:userid`). The `jsonParser` middleware is applied, and the `userController.getUser` function handles the logic of fetching user data by ID.

### 7. Default route
- **Endpoint:** `/`
- **Middleware:** `jsonParser`
- **Controller:** Anonymous asynchronous function

This endpoint, represented by the root path `/`, serves a simple response with a status of 200 and a JSON object containing the data "ok". It is a placeholder or default route.

These endpoints collectively provide functionalities for user creation, authentication, profile management, and retrieval of user information through a web API.



# task.controllers 


### 1. Get task by ID
- **Endpoint:** `GET /tasks/:id`
- **Middleware:** `jsonParser`
- **Controller:** `taskControllers.getTaskById`

This endpoint retrieves information about a task based on its unique identifier (`:id`). The `jsonParser` middleware is applied, and the `taskControllers.getTaskById` function handles the logic of fetching task data by ID.

### 2. Add a comment to a task
- **Endpoint:** `PATCH /tasks/addcomment/:taskid`
- **Middleware:** `jsonParser`
- **Controller:** `taskControllers.addNewcomment`

This endpoint allows users to add comments to a specific task identified by `:taskid`. The `jsonParser` middleware is used, and the `taskControllers.addNewcomment` function handles the addition of comments to the specified task.

### 3. Manage a task (generic)
- **Endpoint:** `PATCH /tasks/:x/comment`
- **Middleware:** `jsonParser`
- **Controller:** `taskControllers.manageTask`

This endpoint is designed for generic task management. The `jsonParser` middleware is applied, and the `taskControllers.manageTask` function handles various task-related operations. The specific operation is determined by the value of `:x`.

### 4. Edit a task
- **Endpoint:** `PATCH /tasks/edit/`
- **Middleware:** `jsonParser`
- **Controller:** `taskControllers.editTask`

This endpoint is used to edit the details of a task. The `jsonParser` middleware is applied, and the `taskControllers.editTask` function manages the logic of updating task information.

These endpoints collectively provide functionalities for retrieving tasks by ID, adding comments to tasks, managing tasks generically, and editing task details through a web API.

# Project Contribution Guidelines


If you're interested in contributing to this project, please follow these steps:

- 1. Open an issue on this repository.
- 2. Add your contribution details to the issue, adhering to the provided guidelines.

## How to Contribute

 **Fork the Repository:**
   - Fork the repository to your GitHub account.

 **Clone the Repository:**
   - Clone the forked repository to your local machine.
     ```bash
     git clone https://github.com/de-Padua/denmark-backend
     ```

 **Create a Branch:**
   - Create a new branch for your contribution.
     ```bash
     git checkout -b feature/your-feature
     ```

 **Make Changes:**
   - Implement your changes, following the project's coding standards.

 **Commit Changes:**
   - Commit your changes with a clear and concise commit message.
     ```bash
     git commit -m "Add your meaningful commit message here"
     ```

 **Push Changes:**
   - Push your changes to your forked repository.
     ```bash
     git push origin feature/your-feature
     ```

 **Open a Pull Request:**
   - Open a pull request from your forked repository to the main project repository.
   - Provide a detailed description of your changes.

## Code Standards

- Follow the coding style and standards used in the project.
- Write clear, concise, and meaningful commit messages.
- Keep code clean, readable, and well-documented.

## Issue Tracker

- Use the issue tracker to report bugs or suggest new features.
- Search for existing issues before creating a new one.
- Provide detailed information when opening an issue.

## Community Guidelines

- Be respectful and considerate of others' opinions.
- Help and support fellow contributors.
- Avoid offensive language and behavior.

By following these guidelines, you contribute to a positive and collaborative development environment. Thank you for your contribution!

## Licença

[MIT](https://choosealicense.com/licenses/mit/)


## Autores

- [@de-Padua](https://www.github.com/de-Padua)
