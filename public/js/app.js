// Navigation handling
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dashboard
    loadDashboard();
    loadUsers();
    loadPosts();

    // Navigation click handlers
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and pages
            navLinks.forEach(l => l.classList.remove('active'));
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Show corresponding page
            const pageName = this.getAttribute('data-page');
            const page = document.getElementById(pageName + '-page');
            if (page) {
                page.classList.add('active');
            }
            
            // Update page title
            const pageTitle = this.textContent.replace(/[^\u4e00-\u9fa5a-zA-Z\s]/g, '').trim();
            document.getElementById('page-title').textContent = pageTitle;
        });
    });
});

// Load Dashboard statistics and charts
async function loadDashboard() {
    try {
        const [usersResponse, postsResponse, statsResponse] = await Promise.all([
            fetch('/api/users'),
            fetch('/api/posts'),
            fetch('/api/statistics')
        ]);

        const users = await usersResponse.json();
        const posts = await postsResponse.json();
        const stats = await statsResponse.json();

        // Update stats cards
        document.getElementById('total-users').textContent = users.length;
        document.getElementById('total-posts').textContent = posts.length;
        document.getElementById('total-likes').textContent = stats.totalLikes;

        // Initialize charts
        initPostsChart(stats.byMonth);
        initUsersChart(stats.userActivity);
    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

// Initialize Posts Bar Chart
function initPostsChart(data) {
    const chartDom = document.getElementById('posts-chart');
    const myChart = echarts.init(chartDom);
    
    const option = {
        color: ['#3498db'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: Object.keys(data),
            axisLabel: {
                interval: 0,
                rotate: 0
            }
        },
        yAxis: {
            type: 'value',
            name: '帖子数量'
        },
        series: [{
            name: '帖子数',
            type: 'bar',
            data: Object.values(data),
            barWidth: '60%',
            itemStyle: {
                borderRadius: [5, 5, 0, 0]
            },
            label: {
                show: true,
                position: 'top'
            }
        }]
    };

    myChart.setOption(option);
    
    // Make chart responsive
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// Initialize Users Pie Chart
function initUsersChart(data) {
    const chartDom = document.getElementById('users-chart');
    const myChart = echarts.init(chartDom);
    
    const chartData = Object.keys(data).map(key => ({
        name: key === 'Active' ? '活跃用户' : '不活跃用户',
        value: data[key]
    }));

    const option = {
        color: ['#2ecc71', '#95a5a6'],
        tooltip: {
            trigger: 'item',
            formatter: '{a} <br/>{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center'
        },
        series: [{
            name: '用户状态',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: true,
                formatter: '{b}: {c}'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            data: chartData
        }]
    };

    myChart.setOption(option);
    
    // Make chart responsive
    window.addEventListener('resize', function() {
        myChart.resize();
    });
}

// Load Users
async function loadUsers() {
    try {
        const response = await fetch('/api/users');
        const users = await response.json();
        
        const tbody = document.getElementById('users-table-body');
        tbody.innerHTML = '';
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.username}</td>
                <td>${user.email}</td>
                <td>${user.registeredAt}</td>
                <td>
                    <button class="btn btn-delete" onclick="deleteUser(${user.id})">删除</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

// Delete User
async function deleteUser(userId) {
    if (!confirm('确定要删除这个用户吗？')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/users/${userId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('用户删除成功！');
            loadUsers();
            loadDashboard(); // Refresh dashboard stats
        } else {
            alert('删除失败：' + result.message);
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('删除用户时发生错误');
    }
}

// Load Posts
async function loadPosts() {
    try {
        const response = await fetch('/api/posts');
        const posts = await response.json();
        
        const tbody = document.getElementById('posts-table-body');
        tbody.innerHTML = '';
        
        posts.forEach(post => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${post.id}</td>
                <td>${post.title}</td>
                <td>${post.author}</td>
                <td>${post.createdAt}</td>
                <td>${post.likes}</td>
                <td>
                    <button class="btn btn-delete" onclick="deletePost(${post.id})">删除</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading posts:', error);
    }
}

// Delete Post
async function deletePost(postId) {
    if (!confirm('确定要删除这个帖子吗？')) {
        return;
    }
    
    try {
        const response = await fetch(`/api/posts/${postId}`, {
            method: 'DELETE'
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('帖子删除成功！');
            loadPosts();
            loadDashboard(); // Refresh dashboard stats
        } else {
            alert('删除失败：' + result.message);
        }
    } catch (error) {
        console.error('Error deleting post:', error);
        alert('删除帖子时发生错误');
    }
}
