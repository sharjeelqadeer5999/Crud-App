const apiURL = 'https://66f9201c2a683ce9731100ca.mockapi.io/avi/posts'

function fetchPosts() {
    fetch(apiURL)
        .then(response => response.json())
        .then(data => displayData(data))
        .catch(error => console.log('error', error))
}
fetchPosts();

function displayData(posts) {
    const postsParentDiv = document.getElementById('posts');
    postsParentDiv.innerHTML = '';
    posts.forEach(post => {
        // console.log(post)
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');

        postDiv.innerHTML = `
                        <div class="post-header">
                            <img src="${post.avatar}" alt="Avatar">
                            <div>
                                <h3>${post.name}</h3>
                                <small>${post.createdAt}</small>
                            </div>
                        </div>
                        <h3>${post.title}</h3>
                        <p>${post.body}</p>
                        <div class="actions">
                            <button class="edit-btn" onclick="updatePost(${post.id})">Edit</button>
                            <button class="delete-btn" onclick="deletePost(${post.id})">Delete</button>
                        </div>
                        `

        postsParentDiv.appendChild(postDiv)
    });
}

// =======Create Post=============

document.getElementById('createPostForm').addEventListener('submit', function (e) {
    e.preventDefault()

    const name = document.getElementById('name').value
    const title = document.getElementById('title').value
    const avatar = document.getElementById('avatar').value
    const body = document.getElementById('body').value

    const newPost = {
        name: name,
        title: title,
        avatar: avatar,
        body: body,
        createdAt: new Date().toISOString()
    }

    console.log(newPost)

    fetch(apiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newPost)
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.log(error))

})

//   ==========================Delete======================================

function deletePost(id) {
    fetch(`${apiURL}/${id}`, {
        method: "DELETE",
    })
    .then((response) => {
        if (response.ok) {
            return response.json();
            console.log("response", response);            
        }
    })
    .then((data) => {
        console.log(data);
        alert(`${data.name} successfully deleted`);
        fetchPosts();        
    })
    .catch((error) => console.log("error", error));
}

// ===================== updatePost ====================================

function updatePost(id) {
    fetch(`${apiURL}/${id}`)
        .then((response) => {
            if (!response.ok) {
                throw new Error('Failed to fetch the post');
            }
            return response.json();
        })
        .then((post) => {
            console.log("Fetched post:", post);
            document.getElementById("create-post").style.display = "none";        
            document.getElementById("update-post").style.display = "block";        
            document.getElementById("updatePostForm").name.value = post.name;        
            document.getElementById("updatePostForm").title.value = post.title;        
            document.getElementById("updatePostForm").avatar.value = post.avatar;        
            document.getElementById("updatePostForm").body.value = post.body;        
        })
        .catch((error) => console.error("Error fetching post:", error));

    // ===================== update API call button ====================

    document.getElementById("updatePostForm").addEventListener("submit", function (e) {
        e.preventDefault();
        console.log("Submitting form to update post");

        const name = this.name.value;        
        const title = this.title.value;        
        const avatar = this.avatar.value;        
        const body = this.body.value;

        const updatedData = {
            name,
            title,
            avatar,
            body,
            createdAt: new Date().toISOString(),
        };

        fetch(`${apiURL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedData),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to update the post');
                }
                return response.json();
            })
            .then((data) => {
                alert(`${data.name} successfully updated`);
                fetchPosts(); // Assuming fetchPosts is defined elsewhere
                document.getElementById("create-post").style.display = "block";        
                document.getElementById("update-post").style.display = "none"; 
            })
            .catch((error) => console.error("Error updating post:", error));

        console.log("Updated data:", updatedData);        
    });
}
