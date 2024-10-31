# Social Media API

BlogForge RESTful API for a blog built with Node.js, Express, and MongoDB. This API supports user authentication, post management, commenting, following system, and more.

## 🚀 Features

- 🔐 User authentication (JWT-based)
- 📝 Post creation and management
- 💬 Commenting system
- 👥 Follow/Unfollow functionality
- 🔍 Search capabilities for posts and users
- 📊 Rate limiting
- 🛡️ Security features (XSS protection, NoSQL injection prevention)

## 📋 Prerequisites

- Node.js (v14.0.0 or higher)
- MongoDB (v4.0.0 or higher)
- npm or yarn

## 🛠️ Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd BlogForge
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/social-media
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

4. Seed the database (optional):

```bash
npm run seed
```

5. Start the server:

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## 🔑 Authentication API

### Register User

```http
POST /api/auth/register
```

```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login

```http
POST /api/auth/login
```

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

## 📝 Posts API

### Get All Posts

```http
GET /api/posts
```

### Create Post

```http
POST /api/posts
Authorization: Bearer {token}
```

```json
{
  "title": "My First Post",
  "content": "This is the content of my post",
  "tags": ["tech", "coding"],
  "visibility": "public"
}
```

### Get Single Post

```http
GET /api/posts/:id
```

### Update Post

```http
PUT /api/posts/:id
Authorization: Bearer {token}
```

```json
{
  "title": "Updated Title",
  "content": "Updated content"
}
```

### Delete Post

```http
DELETE /api/posts/:id
Authorization: Bearer {token}
```

### Like/Unlike Post

```http
POST /api/posts/:id/like
Authorization: Bearer {token}
```

### Search Posts

```http
GET /api/posts/search?q=keyword&tags=tech,coding&author=johndoe&sort=recent
```

## 💬 Comments API

### Add Comment

```http
POST /api/comments
Authorization: Bearer {token}
```

```json
{
  "content": "This is a comment",
  "postId": "post_id_here"
}
```

### Get Post Comments

```http
GET /api/comments/posts/:id/comments
```

## 👥 Users API

### Get All Users

```http
GET /api/users
```

### Get User Profile

```http
GET /api/users/:id
```

### Update Profile

```http
PATCH /api/users/profile
Authorization: Bearer {token}
```

```json
{
  "bio": "Software Developer",
  "location": "New York",
  "website": "https://example.com",
  "interests": ["coding", "technology"]
}
```

### Search Users

```http
GET /api/users/search?q=john&interests=tech&location=NewYork
```

### Follow User

```http
POST /api/users/:id/follow
Authorization: Bearer {token}
```

### Unfollow User

```http
POST /api/users/:id/unfollow
Authorization: Bearer {token}
```

### Get Followers

```http
GET /api/users/:id/followers
```

### Get Following

```http
GET /api/users/:id/following
```

### Insomnia REST

```
Import the file :

Insomnia_rest_setting.json
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing using bcrypt
- Rate limiting for API endpoints
- XSS protection
- NoSQL injection prevention
- Security headers using Helmet

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm run test:coverage
```

## 📝 API Response Format

### Success Response

```json
{
  "status": "success",
  "data": {
    // Response data here
  }
}
```

### Error Response

```json
{
  "status": "error",
  "message": "Error message here"
}
```

## ⚙️ Environment Variables

| Variable       | Description               | Default     |
| -------------- | ------------------------- | ----------- |
| NODE_ENV       | Environment mode          | development |
| PORT           | Server port               | 3000        |
| MONGODB_URI    | MongoDB connection string | -           |
| JWT_SECRET     | JWT secret key            | -           |
| JWT_EXPIRES_IN | JWT expiration time       | 7d          |
| LOG_LEVEL      | Winston logger level      | info        |

## 📦 Project Structure

```
.
├── controllers/
│   ├── authController.js
│   ├── commentController.js
│   ├── followController.js
│   ├── postController.js
│   └── userController.js
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   ├── rateLimit.js
│   └── security.js
├── models/
│   ├── Comment.js
│   ├── Post.js
│   └── User.js
├── routes/
│   ├── auth.js
│   ├── comments.js
│   ├── posts.js
│   └── users.js
├── utils/
│   ├── auth.js
│   └── logger.js
└── server.js
```

## 📜 License

[MIT License](LICENSE)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
