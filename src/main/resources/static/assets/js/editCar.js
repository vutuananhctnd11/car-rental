
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
    fetchCarDetail ()
});

function fetchUserSession() {
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

// change step and show image

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
    window.location.href = "/test/myCar.html";
  
}
//================================================================

// get car infomation 

const urlParam = new URLSearchParams(window.location.search);
const carId = urlParam.get("carid");

function populateForm(data) {
    Object.keys(data).forEach(key => {
        let field = document.querySelector(`[name="${key}"]`);
        
        if (field) {
            if (field.type === "radio") {
                document.querySelectorAll(`[name="${key}"]`).forEach(el => {
                    el.checked = el.value === data[key].toString();
                });
            } else {
                field.value = data[key];
            }
        }
    });
}
function populateCheckbox(name, valuesString) {
    const valuesArray = valuesString.split(", "); // Chuyển chuỗi thành mảng
    document.querySelectorAll(`input[name="${name}"]`).forEach(checkbox => {
        checkbox.checked = valuesArray.includes(checkbox.value);
    });
}

function fetchCarDetail (){
    fetch("http://localhost:8080/car/4", {
        method: "GET",
        headers: {
            "Conten-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(result => {
        if (result.success){

            let images = result.data.images.split(", ");

            //Summary card
            document.getElementById("avatar").src = "/assets/pictures/"+ images[0];
            document.getElementById("cardName").textContent = result.data.name;
            document.getElementById("cardBaseprice").textContent = result.data.baseprice +" VND/Day";
            document.getElementById("cardLocation").textContent = result.data.address;
            document.getElementById("status").value = result.data.status;


            //fill data
            populateForm(result.data);
            populateCheckbox("additionalFunctions", result.data.additionalFunctions);
            populateCheckbox("termOfUse", result.data.termOfUse);
            if (document.querySelector("#ortherTerm").checked){
                const termOfUse = result.data.termOfUse.split(", ");
                document.getElementById("other").value = termOfUse[termOfUse.length-1];
            }
            // get image
            document.getElementById("previewFrontImage").src = "/assets/pictures/"+images[0];
            document.getElementById("previewBackImage").src = "/assets/pictures/"+images[1];
            document.getElementById("previewLeftImage").src = "/assets/pictures/"+images[2];
            document.getElementById("previewRightImage").src = "/assets/pictures/"+images[3];
            
        }
    })
    .catch(error => {
        alert("Error when call API!");
    })
}


//=================================================================



function fetchEditCar (requestData){
    fetch("http://localhost:8080/car",{
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(requestData)
    })
    .then(response => response.json())
    .then(result => {
        if(result.success){
            alert("Update rental car successfully!")
            location.reload();
        } else {
            alert("Error: "+ result.message);
        }
    })
    .catch(error => {
        console.error("Lỗi khi gửi yêu cầu:", error);
        alert("Error when call API!");
    });
}


document.getElementById("editCar").addEventListener("submit", function(event) {
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
    console.log("1: ",getOldImage("#previewFrontImage"));
    console.log("1: ",getOldImage("#previewBackImage"));
    console.log("1: ",getOldImage("#previewLeftImage"));
    console.log("1: ",getOldImage("#previewRightImage"));

    const images = [
        frontImage ? frontImage.name : null,
        backImage ? backImage.name : null,
        leftImage ? leftImage.name : null,
        rightImage ? rightImage.name : null
    ]
    if (images[0]=="") images[0] = getOldImage("#previewFrontImage");
    if (images[1]=="") images[1] = getOldImage("#previewBackImage");
    if (images[2]=="") images[2] = getOldImage("#previewLeftImage");
    if (images[3]=="") images[3] = getOldImage("#previewRightImage");
    
    jsonData.images = images.join(", ");


    

    delete jsonData.frontImage;
    delete jsonData.backImage;
    delete jsonData.leftImage;
    delete jsonData.rightImage;

    // get car id from URL
    jsonData.id = carId;

    fetchEditCar(jsonData);

    console.log("Dữ liệu: ",jsonData);

});

function getOldImage(idPreviewImage) {
    const img = document.querySelector(idPreviewImage);

        return img.src.split('/').pop();
}

//===============================================

// stop rental car

function stopRentalCar(id){
    const status = document.getElementById("status").value;
    console.log("status: ", status)
    let response = true;
    if (status == "Available"){
        response = confirm("Are you sure you want to continue renting this car?");
        console.log("response: ", response)
    } else {
        response = confirm("Are you sure you want to stop renting this car?");
        console.log("response: ", response)
    }
    if (response){
        fetch("http://localhost:8080/car/status/"+id,{
            method: "PUT",
            headers: {
                "Content-Type":"application/json"
            },
        })
        .then (response => response.json())
        .then (result => {
            if (result.success){
                alert("Update status car success!");
                fetchCarDetail();
            } else {
                alert ("Stop rental car fail: "+result.message);
            }
        })
        .catch(error => {
            alert("Error when call API: "+error.message);
        })
    }
}

document.getElementById("status").addEventListener("change", function() {
        stopRentalCar(4);
        //stopRentalCar(carId);

});
//========================================

// confirm deposit
function confirmDeposit(){
     let response = confirm("Please confirm that you have receive the deposit this booking." 
        +"This will allow the customer to pick-up the car at the agreed date and time.")

    if (response){
        document.getElementById("confirmDeposit").style.display = "none";
        document.getElementById("confirmPayment").style.display = "block";
    }
}