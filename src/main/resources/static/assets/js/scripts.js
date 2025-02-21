function registerUser(event) {
    event.preventDefault();

    // let name = document.getElementById("nameRegister").value;
    // let email = document.getElementById("emailRegister").value;
    // let phoneNo = document.getElementById("phoneRegister").value;
    // let password = document.getElementById("passwordRegister").value;
    // let confirmPassword = document.getElementById("confirmPasswordRegister").value;
    // let role = "customer";
    // console.log("Dữ liệu nhập vào:", { name, email, phoneNo, password, confirmPassword });
    // console.log(JSON.stringify({ name, email, phoneNo, password, confirmPassword, role }));

    // Rút gọn code -> Đỡ phải truyền 1 đống tham số:))
    let json = {};
    json["name"] = document.getElementById("nameRegister").value;
    json["phoneNo"] = document.getElementById("phoneNoRegister").value;
    json["password"] = document.getElementById("passwordRegister").value;
    json["confirmPassword"] = document.getElementById("confirmPasswordRegister").value;
    json["email"] = document.getElementById("emailRegister").value;
    json["role"] = document.getElementById("roleRegister").value;

    console.log("Dữ liệu nhập vào:", json);

    fetch("/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(json)
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                //document.getElementById("message").textContent = "Đăng nhập thành công!";
                location.reload();
                //window.location.href = "homecarowner.html";
                console.log("thành công");
                document.getElementById("loginForm").reset();
                alert(data.message);
            } else {
                alert(data.message);
                console.log("thất bại");
            }
        })
        .catch(error => console.error("Lỗi:", error));
}

function loginUser() {
    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include"
    })
        .then(response => response.json())
        .then(data => {
            if (data.success && data.data.role === "car owner") {
                document.getElementById("message").textContent = "Đăng nhập thành công!";
                location.reload();
                //window.location.href = "homecarowner.html";
                console.log("thành công");
                document.getElementById("loginForm").reset();
            } else if (data.success) {
                document.getElementById("message").textContent = "Đăng nhập thành công!";
                location.reload();
                //window.location.href = "home.html";
                console.log("thành công");
                document.getElementById("loginForm").reset();
            } else {
                document.getElementById("message").textContent = "Sai tài khoản hoặc mật khẩu!";
                console.log("thất bại");
            }
        })
        .catch(error => console.error("Lỗi:", error));
}

function changePassword() {
    let password = document.getElementById("newPasswordChange").value.trim();
    let confirmPassword = document.getElementById("confirmPasswordChange").value.trim();

    if (password == "" || confirmPassword == "") {
        alert("Không được để trống dữ liệu!");
    } else if (password != confirmPassword) {
        alert("Mật khẩu mới và xác nhận mật khẩu mới không khớp!");
    } else {
        if(confirm("Bạn chắc chắn muốn đổi mật khẩu?")){
            fetch("/changepassword", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({password})
            })
                .then(response => response.json())
                .then(data => {
                    alert(data.message);
                    if (data.success) {
                        location.reload();
                    }
                })
                .catch(error => console.error("Lỗi", error));
        }
    }
}

function toggleMenu(event) {
    event.preventDefault(); // Prevent default link behavior
    var menu = document.getElementById("userMenu");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}


document.addEventListener("DOMContentLoaded", function () {
    var toggleBtn = document.getElementById("toggleMenu");
    var menu = document.getElementById("userMenu");

    if (toggleBtn && menu) {
        toggleBtn.addEventListener("click", function (event) {
            event.preventDefault(); // Ngăn chặn load lại trang khi click
            menu.classList.toggle("d-block"); // Hiện/ẩn menu
        });
    }
});

function searchcar() {
    window.location.href = "/test/searchResults.html";
}
function mycar (){
    window.location.href ="/test/addCar.html";
}

