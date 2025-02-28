let userId = -1;

// config header
function toggleMenu(event) {
    event.preventDefault();
    var menu = document.getElementById("userMenu");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

document.addEventListener("DOMContentLoaded", function () {
    fetchUserSession();
    console.log("Hello from booking page");
});

function fetchUserSession() {
    fetch("http://localhost:8080/me", {credentials: "include"})
        .then(response => response.json())
        .then(data => {
            console.log("Session data:", data);
            if (data.success && data.data.role == "customer") {
                userId = data.data.id;
                document.getElementById("userInfo").textContent = "Welcome customer, " + data.data.name;
                document.getElementById("nav_user").style.display = "block";
                document.getElementById("mycar").style.display = "none";
                document.getElementById("myreport").style.display = "none";
                console.log("Name: ", data.data.name)
            } else if (data.success && data.data.role == "car owner") {
                userId = data.data.id;
                document.getElementById("userInfo").textContent = "Welcome car owner, " + data.data.name;
                document.getElementById("nav_user").style.display = "block";
            }

        })
        .catch(error => console.error("Lỗi kiểm tra session:", error));
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

function convertToNumberOfDays(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const price = parseInt(document.getElementById('pricePerDay').value);

    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

    return diffDays;
}

function calculateTotal(day, price) {
    return day * price;
}

function fetchBookingSearch(page, limit) {
    const requestData = {
        usId: userId,
        page: page,
        limit: limit,
    };
    fetch("http://localhost:8080/booking/view", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                const bookings = result.data;
                const bookingList = document.getElementById("bookingList");

                bookingList.innerHTML = "";
                let no = 1;
                bookings.forEach((booking) => {
                    const row = `
                            <div class="col-md-6 mb-4">
                                <div class="card">
                                    <div class="row g-0">
                                        <div class="col-md-4">
                                            <img src="/assets/pictures/${booking.carImage}" class="img-fluid rounded-start" alt="Car Image">
                                        </div>
                                        <div class="col-md-8">
                                            <div class="card-body">
                                                <h5 class="card-title">${booking.carName}</h5>
                                                <p class="card-text"><small class="text-muted">Time Rent: ${booking.startDateTime} to ${booking.endDateTime}</small></p>
                                                <p class="card-text">Number of Days: ${booking.numberOfDays}</p>
                                                <p class="card-text">Base Price: ${booking.basePrice} $</p>
                                                <p class="card-text">Total: ${booking.totalPrice}</p>
                                                <p class="card-text">Deposit: ${booking.deposit}</p>
                                                <p class="card-text">Booking No: ${booking.id}</p>
                                                <p class="card-text">Booking Status: <span class="badge bg-info">${booking.status}</span></p>
                                                <button class="btn btn-primary btn-sm">View Details</button>
                                                <button class="btn btn-success btn-sm">Confirm Pickup</button>
                                                <button class="btn btn-danger btn-sm">Cancel Booking</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                    no += 1;
                    bookingList.innerHTML += row;

                    renderPagination(result.page, result.totalPage);

                    console.log(booking);
                });
            } else {
                alert("Thông báo: " + result.message);
            }
        })
        .catch(error => {
            console.error("Lỗi khi gửi yêu cầu:", error);
            alert("Đã có lỗi xảy ra!");
        });
}

document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("btnViewBooking").addEventListener("click", function () {
        let limit = document.getElementById("limit").value

        //gọi api
        fetchBookingSearch(1, limit);
    });

    //khi limit thay đổi
    document.getElementById("limit").addEventListener("change", function () {
        let limit = document.getElementById("limit").value;

        fetchBookingSearch(1, limit);
    });
});

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
    fetchBookingSearch(page, limit);
}
