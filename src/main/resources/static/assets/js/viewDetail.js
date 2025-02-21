const param = new URLSearchParams(window.location.search);
const carId = param.get("id");

// config header 
function toggleMenu(event) {
    event.preventDefault();
    var menu = document.getElementById("userMenu");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

document.addEventListener("DOMContentLoaded", function () {
    fetchUserSession();
});

function fetchUserSession(callback) {
    fetch("http://localhost:8080/me", { credentials: "include" })
                .then(response => response.json())
                .then(data => {
                    console.log("Session data:", data);
                    if (data.success && data.data.role == "customer") {
                        document.getElementById("userInfo").textContent = "Welcome customer, " + data.data.name;
                        document.getElementById("nav_user").style.display = "block";
                        document.getElementById("mycar").style.display = "none";
                        document.getElementById("myreport").style.display = "none";
                    }else if(data.success && data.data.role == "car owner"){
                        document.getElementById("userInfo").textContent = "Welcome car owner, " + data.data.name;
                        document.getElementById("nav_user").style.display = "block";
                    }
                    
                    callback(data.data.id);

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


document.addEventListener("DOMContentLoaded", function() {
    fetchData();
});


function fetchData (){
    fetch("http://localhost:8080/car/"+carId, {
        method: "GET", 
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(result => {
        if (result.success) {
            const carDetail = result.data;
            console.log(carDetail);

            document.getElementById("name").textContent = carDetail.name;
            document.getElementById("baseprice").textContent = carDetail.baseprice + " VND/Day";
            document.getElementById("location").textContent = carDetail.user.nationalIdNo;
            document.getElementById("licensePlate").value = carDetail.licensePlate;
            document.getElementById("color").value = carDetail.color;
            document.getElementById("brand").value = carDetail.brand;
            document.getElementById("model").value = carDetail.model;
            document.getElementById("productionYears").value = carDetail.productionYears;
            document.getElementById("numberOfSeats").value = carDetail.numberOfSeats;
            document.getElementById("transmissionType").value = carDetail.transmissionType;
            document.getElementById("fuelType").value = carDetail.fuelType;
            document.getElementById("mileage").value = carDetail.mileage;
            document.getElementById("fuelConsumption").value = carDetail.fuelConsumption;
            document.getElementById("address").value = carDetail.address;
            document.getElementById("description").value = carDetail.description;
            //Additional Functions
            let additionalFunctions = carDetail.additionalFunctions.split(", ");
            additionalFunctions.forEach(function (feature) {
                let checkbox = document.getElementById(feature.toLowerCase());
                if (checkbox) {
                    checkbox.checked = true;
                    checkbox.disabled = false;
                }
            });
            //Images
            let images = carDetail.images.split(", ");
            document.getElementById("avatar").src = "/assets/pictures/"+images[0];
            document.getElementById("previewFrontImage").src = "/assets/pictures/"+images[0];
            document.getElementById("previewBackImage").src = "/assets/pictures/"+images[1];
            document.getElementById("previewLeftImage").src = "/assets/pictures/"+images[2];
            document.getElementById("previewRightImage").src = "/assets/pictures/"+images[3];

            document.getElementById("basePrice1").value = carDetail.baseprice;
            document.getElementById("deposit").value = carDetail.deposit;
            
            //Term of use
            let termOfUse = carDetail.termOfUse.split(", ");
            termOfUse.forEach(function (feature) {
                let checkbox = document.getElementById(feature);
                if (checkbox) {
                    checkbox.checked = true;
                    checkbox.disabled = false;
                }
            })
            let otherTerm = document.getElementById("other");
            if (otherTerm.checked){
                document.getElementById("otherTermsSpecify").value = termOfUse[termOfUse.length-1];
            }

        } else {
            alert("Thông báo: "+result.message );
        }
    })
    .catch(error => {
        console.error("Lỗi khi gửi yêu cầu:", error);
        alert("Đã có lỗi xảy ra!");
    });
}

function showHomeProfile(){
    window.location.href = "/index.html";
}