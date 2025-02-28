// Get car ID from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const carId = urlParams.get('id');

document.addEventListener("DOMContentLoaded", function () {
    // Fetch user info if logged in
    fetchUserInfo();
});

document.addEventListener("DOMContentLoaded", function () {
    if (!carId) {
        alert("No car selected!");
        window.location.href = "/index.html";
        return;
    }

    // Fetch car details
    fetchCarDetails(carId);

    // Để tạm ngày nhận xe, trả xe là ngày hiện tại
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Thêm 1 vì tháng bắt đầu từ 0
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const datetimeString = `${year}-${month}-${day}T${hours}:${minutes}`;
    document.getElementById('pickup-date').value = datetimeString;
    document.getElementById('return-date').value = datetimeString;

    // Set up event listeners
    document.getElementById("differentDriver").addEventListener("change", function () {
        const driverFields = document.querySelectorAll("#pills-renter input[id^='driver']");
        driverFields.forEach(field => {
            field.disabled = !this.checked;
        });
    });

    // Set up next button in renter tab
//    const nextButton = document.querySelector("#pills-renter button.btn-primary");
//    if (nextButton) {
//        nextButton.addEventListener("click", function() {
//            // Switch to driver tab
//            document.getElementById("pills-driver-tab").click();
//        });
//    }
    const nextButton = document.getElementById("nextButton");

    if (nextButton) {
        nextButton.addEventListener("click", function () {
            console.log("Next button clicked!"); // Kiểm tra sự kiện đã hoạt động chưa
            const driverTab = document.getElementById("pills-driver-tab");
            if (driverTab) {
                driverTab.click(); // Chuyển sang tab Driver
            } else {
                console.error("Không tìm thấy phần tử #pills-driver-tab");
            }
        });
    } else {
        console.error("Không tìm thấy nút Next với id='nextButton'");
    }

    // Set up confirm payment button
    const confirmButton = document.querySelector("#pills-driver button.btn-success");
    if (confirmButton) {
        confirmButton.addEventListener("click", function () {
            // Create booking
            createBooking(carId);
        });
    }
});

// Thay đổi số ngày thuê, tổng tiền thuê khi chọn end date
document.getElementById("return-date").addEventListener("change", function () {
    const startDate = new Date(document.getElementById("pickup-date").value);
    const endDate = new Date(document.getElementById("return-date").value);
    const price = parseInt(document.getElementById('pricePerDay').value);

    // Kiểm tra xem các biến có đúng kiểu dữ liệu chưa
    if(!isNaN(startDate.getTime()) && !isNaN(endDate.getTime()) && !isNaN(price) && endDate > startDate){
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

        // Thay đổi giá trị của số ngày thuê, tổng tiền
        document.getElementById('numberOfDays').value = diffDays;
        document.getElementById('total').value = price * diffDays;
    }
});


    function fetchCarDetails(carId) {
        fetch(`http://localhost:8080/car/${carId}`, {credentials: "include"})
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const car = data.data;

                    // Display car image
                    const carImage = document.querySelector(".col-md-6 img");
                    if (carImage && car.images) {
                        carImage.src = `/assets/pictures/${car.images.split(", ")[0]}`;
                    }

                    // Display car name
                    const carNameElements = document.querySelectorAll(".col-md-6 h5.card-title");
                    carNameElements.forEach(element => {
                        element.textContent = car.name;
                    });

                    // Display car price and other details
                    const cardText = document.querySelector(".col-md-6 p.card-text");
                    if (cardText) {
                        cardText.innerHTML = `
                        <i class="bi bi-star-fill text-warning"></i> 4.5 (100 rides)<br>
                        <strong>Price:</strong> ${car.baseprice.toLocaleString()} VND/day<br>
                        <strong>Location:</strong> ${car.address}<br>
                        <strong>Status:</strong> Available
                    `;
                    }

                    // Set booking summary
//                const startDate = new Date(document.querySelector("[id^='pickup-date']").value);
//                const endDate = new Date(document.querySelector("[id^='return-date']").value);
//                 const pickupDateElement = document.getElementById("pickup-date");
//                 const returnDateElement = document.getElementById("return-date");
//
//                 if (!pickupDateElement || !returnDateElement) {
//                     console.error("Error: Pickup date or return date input field not found!");
//                     return;
//                 } else {
//                     const startDate = new Date(pickupDateElement.value);
//                     const endDate = new Date(returnDateElement.value);
//
//                     if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
//                         alert("Please select valid pickup and return dates!");
//                         return;
//                     }
//
//                     const diffTime = Math.abs(endDate - startDate);
//                     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
//
//                     const bookingSummary = document.querySelector(".col-md-6:nth-child(2) ul");
//                     if (bookingSummary) {
//                         bookingSummary.innerHTML = `
//                         <li><strong>Number of Days:</strong>0</li>
//                         <li><strong>Price per Day:</strong> ${car.baseprice.toLocaleString()} VND</li>
//                         <li><strong>Total:</strong> ${(car.baseprice * diffDays).toLocaleString()} VND</li>
//                         <li><strong>Deposit:</strong> ${car.deposit.toLocaleString()} VND</li>
//                     `;
//                     }
//                 }

                    const bookingSummary = document.querySelector(".col-md-6:nth-child(2) ul");
                    if (bookingSummary) {
                        document.getElementById("pricePerDay").value = car.baseprice;
                        document.getElementById("deposit").value = car.deposit;
                    }
                } else {
                    alert("Failed to load car details!");
                }
            })
            .catch(error => {
                console.error("Error fetching car details:", error);
                alert("An error occurred while loading car details!");
            });
    }

    function fetchUserInfo() {
        fetch("http://localhost:8080/me", {credentials: "include"})
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const user = data.data;

                    // Fill user information
                    document.getElementById("fullName").value = user.name || "";
                    document.getElementById("phoneNumber").value = user.phoneNo || "";
                    document.getElementById("email").value = user.email || "";
                    document.getElementById("nationalId").value = user.nationalIdNo || "";
                    document.getElementById("dob").value = user.dateOfBirth.toLocaleString() || "";
                    document.getElementById("customerWallet").value = user.wallet;

                    console.log(user);
                }
            })
            .catch(error => console.error("Error checking session:", error));
    }

    function createBooking(carId) {
        // Validate fields
        const requiredFields = ["fullName", "phoneNumber", "email", "nationalId", "dob"];
        for (const field of requiredFields) {
            if (!document.getElementById(field).value) {
                alert("Please fill in all required renter information!");
                return;
            }
        }

        // Get selected payment method
        let paymentMethod = "";
        const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
        for (const radio of paymentRadios) {
            if (radio.checked) {
                paymentMethod = radio.id;
                break;
            }
        }

        if (!paymentMethod) {
            alert("Please select a payment method!");
            return;
        }

        // Get user ID
        fetch("http://localhost:8080/me", {credentials: "include"})
            .then(response => response.json())
            .then(userData => {
                if (!userData.success) {
                    alert("You must be logged in to book a car!");
                    return;
                }

                const userId = userData.data.id;

                // Get start and end dates
//            const startDate = document.querySelector("[id^='pickup-date']").value;
//            const endDate = document.querySelector("[id^='return-date']").value;
                const startDate = document.getElementById("pickup-date").value;
                const endDate = document.getElementById("return-date").value;

                if (!startDate || !endDate) {
                    alert("Please select pickup and return dates!");
                    return;
                }

                if (startDate >= endDate) {
                    alert("Return date must be larger than pickup date!");
                    return;
                }

                const depositMoney = document.getElementById('deposit').value;
                const customerWallet = document.getElementById('customerWallet').value;
                
                if(paymentMethod === "bankTransfer" && parseInt(depositMoney) > parseInt(customerWallet)){
                    alert("Your wallet is not enough to rent!");
                    return;
                }

                // Create booking request
                const isDifferentDriver = document.getElementById("differentDriver").checked;

                const bookingRequest = {
                    userId: userId,
                    carId: parseInt(carId),
                    startDateTime: startDate,
                    endDateTime: endDate,
                    paymentMethod: paymentMethod,
                    totalMoney: document.getElementById('total').value,
                    renterFullName: document.getElementById("fullName").value,
                    renterPhone: document.getElementById("phoneNumber").value,
                    renterEmail: document.getElementById("email").value,
                    renterNationalId: document.getElementById("nationalId").value,
                    differentDriver: isDifferentDriver
                };

                if (isDifferentDriver) {
                    bookingRequest.driverFullName = document.getElementById("driverFullName").value;
                    bookingRequest.driverPhone = document.getElementById("driverPhoneNumber").value;
                    bookingRequest.driverEmail = document.getElementById("driverEmail").value;
                    bookingRequest.driverNationalId = document.getElementById("driverNationalId").value;
                    bookingRequest.driverLicense = document.getElementById("driverDrivingLicense").value;
                }

                // Send booking request
                fetch("http://localhost:8080/booking/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(bookingRequest),
                    credentials: "include"
                })
                    .then(response => response.json())
                    .then(result => {
                        if (result.success) {
                            // Show success message and redirect to payment tab
                            document.getElementById("pills-payment-tab").click();
                            document.querySelector("#pills-payment p:first-child").textContent =
                                `You've successfully booked ${bookingRequest.renterFullName} from ${startDate} to ${endDate}`;
                            document.querySelector("#pills-payment p:nth-child(2)").textContent =
                                `Your booking number is: ${result.data.id}`;
                        } else {
                            alert("Booking failed: " + result.message);
                        }
                    })
                    .catch(error => {
                        console.error("Error creating booking:", error);
                        alert("An error occurred while creating your booking!");
                    });
            })
            .catch(error => {
                console.error("Error checking session:", error);
                alert("An error occurred while verifying your account!");
            });
    }

// Function to navigate back to home
    function showHomeProfile() {
        window.location.href = "/index.html";
    }

// Function called from search results page
    function bookCar(id) {
        window.location.href = "/test/bookCar.html?id=" + id;
    }

    function goToHomepage(){
        window.location.href = "/test/home.html";
    }

function viewBooking(){
    window.location.href = "/test/mybooking.html";
}