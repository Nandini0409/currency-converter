const apiKey = `55fcb0b2a7ec73ae9dc0d98a`;
const api1Url = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;
let ratesObj = {};
let isoCodes = [];
let fromDropdownValue = "USD";
let toDropdownValue = "INR";
const dropdown = document.querySelectorAll("select");
const currentExchangeRate = document.getElementById("currentExchangeRate");
const convertBtn = document.getElementById("conversionBtn");
const clearBtn = document.getElementById("clearBtn");
const inputAmount = document.getElementById("inputAmount");
const convertedAmount = document.getElementById("outputAmount");


//fetching current exchange rates and isocodes from api and stoing it in local storage---->
document.addEventListener('DOMContentLoaded', () => {
    fetch(api1Url, { method: 'GET' })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
             return response.json();
        })
        .then(data => {
            ratesObj = data.conversion_rates;
            isoCodes = Object.keys(ratesObj);
        })
        .then(() => {
            console.log("data fetched")
            isocodesDisplayInDropdown();
            changeSelectValue();
        })
        .catch((error) => {
            console.log(error);
            alert('Failed to fetch exchange rates. Please try again later.');
        })

});


// function to display isocodes in the dropdowns----->
function isocodesDisplayInDropdown() {
    dropdown.forEach(element => {
        isoCodes.forEach(i => {
            let options = document.createElement("option");
            options.value = i;
            options.textContent = i;
            element.appendChild(options)
        });
    });
}


// this function changes the value of select element values whenever they are changed------>
function changeSelectValue() {
    dropdown.forEach(selectElement => {
        selectElement.addEventListener("change", () => {
            fromDropdownValue = dropdown[0].value;
            toDropdownValue = dropdown[1].value;
            console.log(fromDropdownValue, toDropdownValue)
        })
    })
}

// this function changes the currentExchangeRate and displays the converted amount----->
function conversion() {

    const api2Url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${fromDropdownValue}/${toDropdownValue}/${inputAmount.value}`;
    fetch(api2Url, { method: "GET" })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            } 
            return response.json();
        })
        .then(data => {
            currentExchangeRate.innerHTML = `1 ${fromDropdownValue} = ${data.conversion_rate} ${toDropdownValue}`;
            convertedAmount.textContent = data.conversion_result;
        })
        .catch(error => {
            alert("Failed to fetch conversion rates. Please try again later.");
        })

}


// eventlistners for CTAs----->

convertBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let regex = /^\d*\.?\d{0,2}$/;
    if (inputAmount.value === '') {
        alert("Please enter the Amount Before clicking the button!");
    }
    else if (!(regex.test(inputAmount.value))) {
        alert("The amount should only contain decimal numbers up to 2 decimal points, not any alphabet or special character!")
    }
    else {
        conversion();
    }
})


clearBtn.addEventListener("click", (e) => {
    e.preventDefault();
    inputAmount.value = "";
    currentExchangeRate.textContent = "";
})

const api2Key = `8a5aba150e764ca38a3599390cd21a2c`;
const api3Url = `https://openexchangerates.org/api/currencies.json
    ?show_alternative=1`;








