# task-master
A collaborative task tracking system

# API Summary
The following is a summary of API endpoints in this application:

User Account and Authentication

POST /users/register: Creates a new user account.
POST /users/login: Logs in a user and returns an authorization token.
GET /users/profile: Retrieves the logged-in user’s profile.
PUT /users/profile: Updates the logged-in user’s profile.
POST /users/logout: Logs out the user, invalidating the token.

Task Management

POST /tasks: Creates a new task with a title, description, and due date.
GET /tasks: Retrieves all tasks assigned to the current user.
PUT /tasks/:id/complete: Marks a specific task as completed.
PUT /tasks/:taskId/:assignedUserId: Assigns a specific task to another user.
GET /tasks?status=completed: Filters tasks based on the task status (e.g., "completed").
GET /tasks?search=Test: Searches tasks by title or description.

Task Collaboration

POST /tasks/:id/comment: Adds a comment to a specific task.
POST /tasks/:id/attachment: Adds an attachment to a specific task.

Team and Project Management

POST /teams/create: Creates a new team and invites initial members.
POST /teams/invite: Invites additional members to an existing team.
