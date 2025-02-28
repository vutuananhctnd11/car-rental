
// config header 
function toggleMenu(event) {
    event.preventDefault();
    var menu = document.getElementById("userMenu");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

document.addEventListener("DOMContentLoaded", function () {
    fetchUserSession();
});

function fetchUserSession() {
    fetch("http://localhost:8080/me", { credentials: "include" })
                .then(response => response.json())
                .then(data => {
                    console.log("Session data:", data);
                    if (data.success && data.data.role == "customer") {
                        document.getElementById("userInfo").textContent = "Welcome customer, " + data.data.name;
                        document.getElementById("nav_user").style.display = "block";
                        document.getElementById("mycar").style.display = "none";
                        document.getElementById("myreport").style.display = "none";
                        console.log("Name: ", data.data.name)
                    }else if (data.success && data.data.role == "car owner") {
                        document.getElementById("userInfo").textContent = "Welcome car owner, " + data.data.name;
                        document.getElementById("nav_user").style.display = "block";
                    }

                })
                .catch(error => console.error("Lỗi kiểm tra session:", error));
}

function showCar(){
    window.location.href = "/test/myCar.html";
}
//===========================================
//footer
document.addEventListener("DOMContentLoaded", function () {
    fetch("/components/layout/footer.html")
        .then(response => response.text()) // Lấy nội dung file HTML
        .then(data => {
            document.getElementById("footer").innerHTML = data;
        })
        .catch(error => console.error("Lỗi khi tải footer:", error));
});

//======================================================



function fetchDataSearch (page, limit, search){
    const requestData = {
        page : page, 
        limit : limit,
        search: search
    };
    fetch("http://localhost:8080/car/search", {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            const cars = result.data;
            const tableBody = document.getElementById("result");

            tableBody.innerHTML = "";
            let no = 1;
            cars.forEach(car => {
                const row = `
                    <tr>
                        <td>${no}</td>
                        <td>${car.name}</td>
                        <td><img src="/assets/pictures/${car.images.split(", ")[0]}" alt="Car 1" class="img-fluid" width="100"></td>
                        <td>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                            <i class="fas fa-star"></i>
                        </td>
                        <td>120</td>
                        <td>${car.baseprice.toLocaleString()} VND</td>
                        <td>${car.address}</td>
                        <td>${car.status}</td>
                        <td>
                            <button class="btn btn-success" onclick="bookCar(${car.id})">Rent now</button>
                            <button class="btn btn-info" onclick="carDetail(${car.id})">View Detail</button>
                        </td>
                    </tr>
                `;
                no+=1;
                tableBody.innerHTML += row;

                renderPagination(result.page, result.totalPage);
            });
        } else {
            alert("Thông báo: "+result.message );
        }
    })
    .catch(error => {
        console.error("Lỗi khi gửi yêu cầu:", error);
        alert("Đã có lỗi xảy ra!");
    });
}

document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("searchButton").addEventListener("click", function() {
            let limit = document.getElementById("limit").value
            let search = document.getElementById("pickupLocation").value
            //gọi api
            fetchDataSearch (1, limit, search);
        
    });

    //khi limit thay đổi
    document.getElementById("limit").addEventListener("change", function () {
        let limit = document.getElementById("limit").value;
        let search = document.getElementById("pickupLocation").value
        fetchDataSearch(1, limit, search);
    
    });
});

function carDetail(id){
    window.location.href = "/test/viewDetail.html?id="+id;
}

//Add function bookCar
function bookCar(id) {
    window.location.href = "/test/bookCar.html?id="+id;
}

//phân trang ()
function renderPagination(currentPage, totalPages) {
    const pagination = document.getElementById("pagination");
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    // Đảm bảo luôn hiển thị đủ 5 trang khi có thể
    if (currentPage <= 2) {
        endPage = Math.min(5, totalPages);
    }
    if (currentPage >= totalPages - 1) {
        startPage = Math.max(1, totalPages - 4);
    }

    let pagesHtml = `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="javascript:void(0);" onclick="changePage(1)">First</a>
        </li>
    `;

    for (let i = startPage; i <= endPage; i++) {
        pagesHtml += `
            <li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="javascript:void(0);" onclick="changePage(${i})">${i}</a>
            </li>
        `;
    }

    pagesHtml += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="javascript:void(0);" onclick="changePage(${totalPages})">Last</a>
        </li>
    `;

    pagination.innerHTML = pagesHtml;
}

function changePage(page) {
    let limit = document.getElementById("limit").value
    let search = document.getElementById("pickupLocation").value
    fetchDataSearch(page, limit, search);
}
