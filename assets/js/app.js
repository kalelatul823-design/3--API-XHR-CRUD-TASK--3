let cl = console.log;

const postContainer = document.getElementById("postContainer");
const form = document.getElementById("form");
const titleControl = document.getElementById("title");
const bodyControl = document.getElementById("body");
const userIdControl = document.getElementById("userId");
const addPostBtn = document.getElementById("addPostBtn");
const updatePostBtn = document.getElementById("updatePostBtn");
const spinner = document.getElementById('spinner')

let BASE_URL = `https://jsonplaceholder.typicode.com/`;

let POST_URL = `${BASE_URL}/posts`;

function snakBar(msg, icon){
    Swal.fire({
       title : msg,
       icon : icon,
       timer : 3000
    })
}

function makeApiCall() {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", `${POST_URL}`);
  xhr.send(null);
  xhr.onload = function () {
    if (xhr.status === 200) {
      let res = JSON.parse(xhr.response);
      cl(res);
      showUi(res);
    } else {
      cl("something went wrong");
    }
  };
}
makeApiCall();

//read
function showUi(arr) {
  let result = "";
  arr.forEach((post) => {
    result += ` <div class="col-md-3 mb-4" id=${post.id}>
                   <div class="card h-100">
                    <div class="card-header">
                        <h3 class="m-0">${post.title}</h3>
                    </div>
                    <div class="card-body">
                        <p class="m-0">${post.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onEdit(this)" class="btn btn-sm btn-primary">Edit</button>
                        <button onclick="onRemove(this)" class="btn btn-sm btn-danger">Delete</button>
                    </div>
                </div>
            </div>`;
  });
  postContainer.innerHTML = result;
}

//create
function onAddPost(eve) {
  eve.preventDefault();
  let NEW_POST = {
    title: titleControl.value,
    body: bodyControl.value,
    userId: userIdControl.value,
  };
  let xhr = new XMLHttpRequest();
  spinner.classList.remove("d-none")
  xhr.open("POST", POST_URL);
  xhr.send(JSON.stringify(NEW_POST));
  xhr.onload = function () {
    if (xhr.status === 201) {
      let res = JSON.parse(xhr.response);
      cl(res);
      let div = document.createElement("div");
      div.id = res.id;

      let result = "";
      div.className = `col-md-3 mb-4`;
      div.innerHTML += ` <div class="card h-100">
                    <div class="card-header">
                        <h3 class="m-0">${NEW_POST.title}</h3>
                    </div>
                    <div class="card-body">
                        <p class="m-0">${NEW_POST.body}</p>
                    </div>
                    <div class="card-footer d-flex justify-content-between">
                        <button onclick="onEdit(this)" class="btn btn-sm btn-primary">Edit</button>
                        <button onclick="onRemove(this)" class="btn btn-sm btn-danger">Delete</button>
                    </div>
                </div>`;
      postContainer.prepend(div);
      form.reset();
      snakBar(`This todo is created successfully`, `success`)
    } else {
      cl("something went wrong");
    }
    spinner.classList.add('d-none')
  };
}

//edit
function onEdit(ele) {
  let EDIT_ID = ele.closest(".col-md-3").id;
  cl(EDIT_ID);
  localStorage.setItem("EDIT_ID", EDIT_ID);
  let xhr = new XMLHttpRequest();
   spinner.classList.remove("d-none")
  xhr.open("GET", `${POST_URL}/${EDIT_ID}`);
  xhr.send(null);
  xhr.onload = function () {
    if (xhr.status === 200) {
      let res = JSON.parse(xhr.response);
      titleControl.value = res.title;
      bodyControl.value = res.body;
      userIdControl.value = res.userId;
      addPostBtn.classList.add("d-none");
      updatePostBtn.classList.remove("d-none");
    } else {
      cl("something went wrong");
    }
    spinner.classList.add('d-none')
  };
}

//update
function onUpdatePost(eve) {
  let UPDATE_ID = localStorage.getItem("EDIT_ID");
  let UPDATE_OBJ = {
    title: titleControl.value,
    body: bodyControl.value,
    userId: userIdControl.value,
  };
  let xhr = new XMLHttpRequest();
   spinner.classList.remove("d-none")
  xhr.open("PATCH", `${POST_URL}/${UPDATE_ID}`);
  xhr.send(JSON.stringify(UPDATE_OBJ));
  xhr.onload = function () {
    if (xhr.status === 200) {
      let res = JSON.parse(xhr.response);
      cl(res);
      let div = document.getElementById(UPDATE_ID);
      div.querySelector(".card-header h3").innerHTML = titleControl.value;
      div.querySelector(".card-body p").innerHTML = bodyControl.value;
      updatePostBtn.classList.add("d-none");
      addPostBtn.classList.remove("d-none");
      snakBar(`This todo is updated successfully`, `success`)
      form.reset();
    } else {
      cl("something went wrong");
    }
    spinner.classList.add('d-none')
  };
}

//delete
function onRemove(ele) {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
    let REMOVE_ID = ele.closest(".col-md-3").id;
  let xhr = new XMLHttpRequest();
   spinner.classList.remove("d-none")
  xhr.open("DELETE", `${POST_URL}/${REMOVE_ID}`);
  xhr.send();
  xhr.onload = function () {
    if (xhr.status === 200) {
      let res = JSON.parse(xhr.response);
      cl(res);
      ele.closest(".col-md-3").remove();
      snakBar(`This todo is deleted successfully`, `success`)
    } else {
      cl("something went wrong");
    }
    spinner.classList.add('d-none')
  };
}   
  });
}

form.addEventListener("submit", onAddPost);
updatePostBtn.addEventListener("click", onUpdatePost);
