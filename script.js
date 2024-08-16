const apiKey = `55fcb0b2a7ec73ae9dc0d98a`;
const api1Url = `https://gist.githubusercontent.com/stevekinney/8334552/raw/28d6e58f99ba242b7f798a27877e2afce75a5dca/currency-symbols.json`;
let ratesObj = {};
let isoCodes = [];
let currencyNamesArr = [];
let symbolArr = [];
let fromDropdownValue = "";
let toDropdownValue = "";
const dropdown = document.querySelectorAll("select");
const currentExchangeRate = document.getElementById("currentExchangeRate");
const convertBtn = document.getElementById("conversionBtn");
const clearBtn = document.getElementById("clearBtn");
const inputAmount = document.getElementById("inputAmount");
const convertedAmount = document.getElementById("outputAmount");
const fromCurrencySymbol = document.getElementById("fromCurrencySymbol");
const toCurrencySymbol = document.getElementById("toCurrencySymbol");


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
            storingDataInArrays(data);
            isocodesDisplayInDropdown();
            changeSelectValue();
        })
        .catch((error) => {
            alert('Failed to fetch exchange rates. Please try again later.');
        })

});


// this function stores the fetched isoCodes, symbols and country name in the respective arrays----->
function storingDataInArrays(data) {
    for (let i = 0; i < data.length; i++) {
        let isoCodesElements = data[i].abbreviation;
        let currencyNames = data[i].currency;
        let symbols = data[i].symbol;
        isoCodes.push(isoCodesElements);
        currencyNamesArr.push(currencyNames);
        symbolArr.push(symbols);
    }
    symbolArr[45] = "&#8360;"
}


// function to display isocodes in the dropdowns----->
function isocodesDisplayInDropdown() {
    dropdown.forEach(element => {
        for (let i = 0; i < isoCodes.length; i++) {
            let options = document.createElement("option");
            options.value = isoCodes[i];
            options.textContent = `${isoCodes[i]} - ${currencyNamesArr[i]}`;
            element.appendChild(options)
        }
    });
}


// this function changes the value of select element values whenever they are changed------>
function changeSelectValue() {
    dropdown[0].addEventListener("change", () => {
        fromDropdownValue = dropdown[0].value;
        let fromSymbolIndex = isoCodes.findIndex(elem => elem === fromDropdownValue);
        fromCurrencySymbol.innerHTML = `${symbolArr[fromSymbolIndex]}`;
    })
    dropdown[1].addEventListener("change", () => {
        toDropdownValue = dropdown[1].value;
        let toSymbolIndex = isoCodes.findIndex(elem => elem === toDropdownValue);
        toCurrencySymbol.innerHTML = `${symbolArr[toSymbolIndex]}`;
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
            convertedAmount.textContent = Math.round(data.conversion_result);
        })
        .catch(error => {
            alert("Failed to fetch conversion rates. Please try again later.");
        })

}


// eventlistners for CTAs----->

convertBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let regex = /^\d*\.?\ ?\,?\d{0,2}$/;
    let cleanedInput = inputAmount.value.replace(/[\s,]/g, '');
    if (cleanedInput === '') {
        alert("Please enter the Amount Before clicking the button!");
    }
    else if (!(regex.test(cleanedInput))) {
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
    convertedAmount.textContent = "";
    fromDropdownValue = "";
    toDropdownValue = "";
})

