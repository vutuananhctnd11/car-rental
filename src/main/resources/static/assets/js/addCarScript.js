
//config header
function toggleMenu(event) {
    event.preventDefault(); // Prevent default link behavior
    var menu = document.getElementById("userMenu");
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

function showLogin(){
    document.getElementById("nav_sign").style.display = "none";
    document.getElementById("nav_log").style.display = "none";
    document.getElementById("nav_user").style.display = "block";
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
                        showLogin();
                        document.getElementById("userInfo").textContent = "Welcome customer, " + data.data.name;
                        document.getElementById("nav_user").style.display = "block";
                    }else if (data.success && data.data.role == "car owner"){
                        showLogin();
                        document.getElementById("userInfo").textContent = "Welcome car owner, " + data.data.name;
                        document.getElementById("nav_user").style.display = "block";

                    }

                    callback(data.data.id);
                })
                .catch(error => console.error("Lỗi kiểm tra session:", error));
}

//=================================================================
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

function nextStep(step) {

    document.querySelectorAll(".step-content").forEach(step => {
        step.classList.remove("active");
    });
    document.querySelectorAll(".step-indicator div").forEach(indicator => {
        indicator.classList.remove("highlight");
    });

    document.getElementById(`step${step}`).classList.add("active");
    document.querySelector(`.step-indicator div[data-step="${step}"]`).classList.add("highlight");
}

function previewFont(event) {
    let input = event.target;
    let reader = new FileReader();

    reader.onload = function () {
        let imgElement = document.getElementById("previewFrontImage");
        let iconElement = document.getElementById("iconFront");

        imgElement.src = reader.result;
        imgElement.style.display = "block";
        iconElement.style.display = "none";
    };

        if (input.files && input.files[0]) {
        reader.readAsDataURL(input.files[0]);
        }
}

function previewBack(event) {
    let input = event.target;
    let reader = new FileReader();

    reader.onload = function () {
        let imgElement = document.getElementById("previewBackImage");
        let iconElement = document.getElementById("iconBack");

        imgElement.src = reader.result;
        imgElement.style.display = "block";
        iconElement.style.display = "none";
    };

        if (input.files && input.files[0]) {
        reader.readAsDataURL(input.files[0]);
        }
}

function previewLeft(event) {
    let input = event.target;
    let reader = new FileReader();

    reader.onload = function () {
        let imgElement = document.getElementById("previewLeftImage");
        let iconElement = document.getElementById("iconLeft");

        imgElement.src = reader.result;
        imgElement.style.display = "block";
        iconElement.style.display = "none";
    };

        if (input.files && input.files[0]) {
        reader.readAsDataURL(input.files[0]);
        }
}

function previewRight(event) {
    let input = event.target;
    let reader = new FileReader();

    reader.onload = function () {
        let imgElement = document.getElementById("previewRightImage");
        let iconElement = document.getElementById("iconRight");

        imgElement.src = reader.result;
        imgElement.style.display = "block";
        iconElement.style.display = "none";
    };

        if (input.files && input.files[0]) {
        reader.readAsDataURL(input.files[0]);
        }
}

function cancelForm() {
    alert('Form canceled!');
  
}

function fetchAddCar (carOwnerId, requestData){
    fetch("http://localhost:8080/car/"+carOwnerId,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(result => {
        if(result.success){
            alert("Added new rental car successfully!")
            window.location.href = "/test/myCar.html";
        } else {
            alert("Please check the information again, you have not filled it in completely");
        }
    })
    .catch(error => {
        console.error("Lỗi khi gửi yêu cầu:", error);
        alert("Error when call API!");
    });
}


document.getElementById("addCar").addEventListener("submit", function(event) {
    event.preventDefault();

    const formData = new FormData(this);
    let jsonData = Object.fromEntries(formData.entries());

    //additionalFunctions
    const additionalFunctions = [];
    document.querySelectorAll('input[name="additionalFunctions"]:checked').forEach((checkbox) => {
        additionalFunctions.push(checkbox.value);
    });
    jsonData.additionalFunctions = additionalFunctions.join(", ");

    //Term of use
    const termOfUse = [];
    document.querySelectorAll('input[name="termOfUse"]:checked').forEach((checkbox) => {
        termOfUse.push(checkbox.value);
    });
    const otherCheckbox = document.getElementById("ortherTerm");
    if (otherCheckbox.checked) {
        const other = document.getElementById("other").value.trim();
        termOfUse.push(other);
    }
    jsonData.termOfUse = termOfUse.join(", ");

    //images
    const leftImage = formData.get("leftImage");
    const rightImage = formData.get("rightImage");
    const frontImage = formData.get("frontImage");
    const backImage = formData.get("backImage");

    const images = [
        frontImage ? frontImage.name : null,
        backImage ? backImage.name : null,
        leftImage ? leftImage.name : null,
        rightImage ? rightImage.name : null  
    ].filter(name => name !== null);
    if (images.length<4) jsonData.images = "";
    else jsonData.images = images.join(", ");

    delete jsonData.frontImage;
    delete jsonData.backImage;
    delete jsonData.leftImage;
    delete jsonData.rightImage;

    fetchUserSession(carOwnerId => {
        fetchAddCar(carOwnerId, jsonData);
    });

    console.log("Dữ liệu: ",jsonData);

});

