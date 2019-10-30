import { http } from "./http";
import { ui } from "./ui";

//Get posts on Dom Load
document.addEventListener("DOMContentLoaded", getPosts);
//Listen for submit post
document.querySelector(".post-submit").addEventListener("click", submitPost);
//Listen for delete
document.querySelector("#posts").addEventListener("click", deletePost);
//Listen for edit state
document.querySelector("#posts").addEventListener("click", enableEdit);
//Listen for cancel edit
document.querySelector(".card-form").addEventListener("click", cancelEdit);



function getPosts() {
    http.get("http://localhost:3000/posts")
        .then(data => ui.showPosts(data))
        .catch(error => console.log(error))
}

function submitPost() {
    const title = document.querySelector("#title").value;
    const body = document.querySelector("#body").value;
    const id = document.querySelector("#id").value;

    const data = {
        title,
        body
    };

    if (title === "" || body === "") {
        ui.showAlert("Please fill in all fields", "alert alert-danger");
    } else {
        //Check for id
        if (id === "") {
            //Create post
            http.post("http://localhost:3000/posts", data)
                .then(data => {
                    ui.showAlert("Post added", "alert alert-success");
                    ui.clearFields();
                    getPosts();
                })
                .catch(error => console.log(error));
        } else {
            //Update post
            http.put(`http://localhost:3000/posts/${id}`, data)
                .then(data => {
                    ui.showAlert("Post updated", "alert alert-success");
                    ui.changeFormState("add")
                    getPosts();
                })
                .catch(error => console.log(error));
        }
    }
}

function deletePost(e) {
    if (e.target.parentElement.classList.contains("delete")) {
        const id = e.target.parentElement.dataset.id;
        if (confirm("Are you sure?")) {
            http.delete(`http://localhost:3000/posts/${id}`)
                .then(data => {
                    ui.showAlert("Post removed", "alert alert-success");
                    getPosts();
                })
                .catch(error => console.log(error))
        }
    }
}

function enableEdit(e) {
    if (e.target.parentElement.classList.contains("edit")) {
        const id = e.target.parentElement.dataset.id;
        const body = e.target.parentElement.previousElementSibling.textContent;
        const title = e.target.parentElement.previousElementSibling.previousElementSibling.textContent;

       const data = {
           id,
           title,
           body
       };

       //Fill the form with current post
        ui.fillForm(data);
    }
}

function cancelEdit(e) {
    if (e.target.classList.contains("post-cancel")) {
        ui.changeFormState("add");
    }
}


