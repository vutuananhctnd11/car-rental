function loadComponent(id, file) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
            reinitBootstrap(); // Chạy lại Bootstrap sau khi load
        });
}


function reinitBootstrap() {
    var modals = document.querySelectorAll(".modal");
    modals.forEach(modal => {
        new bootstrap.Modal(modal);
    });
}

function showProfile(){
    loadComponent("homepage", "/components/page/myprofile.html");
    fetch("http://localhost:8080/me", { credentials: "include" })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        document.getElementById("name").value = data.data.name;
        document.getElementById('dateOfBirth').value = data.data.dateOfBirth;
        document.getElementById('phoneNo').value = data.data.phoneNo;
        document.getElementById('emailProfile').value = data.data.email;
        document.getElementById('nationalIdNo').value = data.data.nationalIdNo;
        console.log(document.getElementById('drivingLicense').file[0]);
        document.getElementById('drivingLicense').value = data.data.drivingLicense;

        document.getElementById('address').value = data.data.address;
    })
    .catch(error => console.error("Lỗi kiểm tra session:", error));
}

function showBooking(){
    window.location.href = "/test/mybooking.html";
}
function showWallet(){
    loadComponent("homepage", "/components/page/mywallet.html");
}
function showCar(){
    window.location.href = "/test/myCar.html";
}
function showReport(){
    loadComponent("homepage", "components/page/myreport.html");
}
function showHomeProfile(){
    location.reload();
}

function logoutUser() {
    fetch("http://localhost:8080/logout", { credentials: "same-origin" })
    .then(() => {
        window.location.href = "/index.html";
    });
}