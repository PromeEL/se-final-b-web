const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Sample data storage (in-memory for this simple implementation)
let users = [
    { id: 1, username: 'user1', email: 'user1@example.com', registeredAt: '2024-01-15' },
    { id: 2, username: 'user2', email: 'user2@example.com', registeredAt: '2024-02-20' },
    { id: 3, username: 'user3', email: 'user3@example.com', registeredAt: '2024-03-10' },
    { id: 4, username: 'user4', email: 'user4@example.com', registeredAt: '2024-04-05' },
    { id: 5, username: 'user5', email: 'user5@example.com', registeredAt: '2024-05-12' }
];

let posts = [
    { id: 1, title: 'First Post', author: 'user1', content: 'This is the first post content', createdAt: '2024-01-20', likes: 15 },
    { id: 2, title: 'Second Post', author: 'user2', content: 'Another interesting post', createdAt: '2024-02-25', likes: 23 },
    { id: 3, title: 'Third Post', author: 'user1', content: 'More content here', createdAt: '2024-03-15', likes: 8 },
    { id: 4, title: 'Fourth Post', author: 'user3', content: 'Great content', createdAt: '2024-04-10', likes: 42 },
    { id: 5, title: 'Fifth Post', author: 'user2', content: 'Latest updates', createdAt: '2024-05-18', likes: 31 }
];

// API Routes

// Get all users
app.get('/api/users', (req, res) => {
    res.json(users);
});

// Delete user
app.delete('/api/users/:id', (req, res) => {
    const userId = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === userId);
    
    if (index !== -1) {
        users.splice(index, 1);
        res.json({ success: true, message: 'User deleted successfully' });
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
});

// Get all posts
app.get('/api/posts', (req, res) => {
    res.json(posts);
});

// Delete post
app.delete('/api/posts/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    const index = posts.findIndex(p => p.id === postId);
    
    if (index !== -1) {
        posts.splice(index, 1);
        res.json({ success: true, message: 'Post deleted successfully' });
    } else {
        res.status(404).json({ success: false, message: 'Post not found' });
    }
});

// Get statistics for charts
app.get('/api/statistics', (req, res) => {
    // Calculate statistics
    const postsByMonth = {
        'January': 1,
        'February': 1,
        'March': 1,
        'April': 1,
        'May': 1
    };
    
    const userActivity = {
        'Active': users.length,
        'Inactive': Math.floor(users.length * 0.3)
    };
    
    const postStats = {
        total: posts.length,
        byMonth: postsByMonth,
        userActivity: userActivity,
        totalLikes: posts.reduce((sum, post) => sum + post.likes, 0)
    };
    
    res.json(postStats);
});

// Serve HTML pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Admin server running on http://localhost:${PORT}`);
});
