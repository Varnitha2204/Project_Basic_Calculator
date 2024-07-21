const btnElement = document.querySelectorAll("button")
// console.log(btnElement)
const expressionElement = document.getElementById("expression")
const inputElement = document.getElementById("result")
const historyList = document.getElementById("historyList")
const historyToggle = document.getElementById("history-toggle")
const historyIcon = document.getElementById("history-icon");
const historySidebar = document.getElementById("historySidebar")
const clearHistoryButton = document.getElementById("clearHistory");

const operators = [ '*', '÷', '%', '+', '-','^'];

let history = []
for(let i = 0; i<btnElement.length;i++){
    btnElement[i].addEventListener("click",()=>{
        // console.log(btnElement[i].textContent);
        const btnValue = btnElement[i].textContent
        if(btnValue === "C"){
            clearResult()
        }
        else if(btnValue === "="){
            finalResult()
        }
        else if(btnValue === "+/-")
            {
                toggleSign()
            }
        else if (btnValue === "⌫") {
                backspace();
            } 
        else if(btnValue === "Clear All"){

        }
        else{
            appendValue(expressionElement,btnValue)
            calculateResult()
        }
    })
}

historyIcon.addEventListener("click", () => { 
    historySidebar.classList.toggle("open")
});

clearHistoryButton.addEventListener("click", () => {
    history = [];
    updateHistory();
});

function clearResult(){
    expressionElement.value = "";
    inputElement.value = "";
}
function calculateResult(){
    try{
    const input = expressionElement.value.replace(/÷/, '/').replace(/\^/g, '**');
    inputElement.value = eval(input)}
    catch(error){
        inputElement.value = inputElement.value
    }
}
function finalResult(){
    if (expressionElement.value.trim() === "") {
        inputElement.value = "";
        return;
    }
    try{
        const input = expressionElement.value.replace(/÷/g, '/')
        const result = eval(input)
        inputElement.value = result
        addToHistory(expressionElement.value,result)
        // expressionElement.value = result;
    }
    catch(error)
    {
        inputElement.value = inputElement.value
    }
}
// function appendValue(btnValue){
//     // expressionElement.value += btnValue;
//     const currentExpression = expressionElement.value;
//     const lastChar = currentExpression[currentExpression.length - 1];

//     if (operators.includes(lastChar) && operators.includes(btnValue)) {
//         expressionElement.value = currentExpression.slice(0, -1) + btnValue;
//     } else {
//         expressionElement.value += btnValue;
//     }
// }

function insertAtCursor(element, value) {
    const start = element.selectionStart;
    const end = element.selectionEnd;
    const text = element.value;
    
    const lastChar = text.charAt(start - 1);
    if (operators.includes(lastChar) && operators.includes(value)) {
        if (value === '+' || value === '-') {
            element.value = text.slice(0, start) + value + text.slice(end);
        } else {
            element.value = text.slice(0, start - 1) + value + text.slice(end);
        }
    } else {
        element.value = text.slice(0, start) + value + text.slice(end);
    }
    
    element.selectionStart = element.selectionEnd = start + value.length;
    element.focus();
}
// function appendValue(expressionElement,btnValue) {
//     const currentExpression = expressionElement.value;
//     const lastChar = currentExpression[currentExpression.length - 1];
//     if (currentExpression === "" && operators.includes(btnValue) && btnValue!="-") {
//         insertAtCursor(expressionElement.value, "0" + btnValue);
//     } 
//     else if (operators.includes(lastChar) && operators.includes(btnValue)) {
//         if (btnValue === '+' || btnValue === '-') {
//             insertAtCursor(expressionElement.value,btnValue);
//         } else {
//             expressionElement.value = currentExpression.slice(0, -1) + btnValue+currentExpression.slice(element.selectionEnd);
//         }
//     } else {
//         expressionElement.value += btnValue;
//     }
// }

function appendValue(element, btnValue) {
    const currentExpression = element.value
    const start = element.selectionStart
    const end = element.selectionEnd
    const lastChar = currentExpression[element.selectionStart - 1]
    const prevChar = currentExpression[element.selectionStart - 2]
    if (btnValue === '.' && lastChar === '.') {
        return; 
    }
    
    // if (operators.includes(lastChar) && operators.includes(btnValue)) {
    //     return; 
    // }

    if (currentExpression === "" && operators.includes(btnValue) && btnValue !== "-") {
        insertAtCursor(element, "0" + btnValue);
    } else if (operators.includes(lastChar) && operators.includes(btnValue)) {
        if ((btnValue === '+' || btnValue === '-' ) && (lastChar === '*' || lastChar === '÷')) {
            insertAtCursor(element, btnValue);
        }
        else if(operators.includes(prevChar) && (lastChar === '+' || lastChar === '-')){
            return
        } else {
            element.value = currentExpression.slice(0, element.selectionStart - 1) + btnValue + currentExpression.slice(element.selectionEnd);
            element.selectionStart = element.selectionEnd = element.selectionStart;
        }
    } else {
        insertAtCursor(element, btnValue);
    }
    element.selectionStart = element.selectionEnd = start + btnValue.length;
    element.focus();
}

function toggleSign(){
    const start = expressionElement.selectionStart
    const end = expressionElement.selectionEnd
    const value = expressionElement.value
    if(expressionElement.value.startsWith('-')){
        expressionElement.value = expressionElement.value.substring(1);
    }
    else{
        expressionElement.value = '-' + expressionElement.value
    }
    expressionElement.selectionStart = start
    expressionElement.selectionEnd = end
    calculateResult()
    inputElement.value = eval(expressionElement.value.replace(/÷/g, '/').replace(/\^/g, '**'))
}

function addToHistory(expression,result){
    const historyItem = `${expression} = ${result}`
    history.push(historyItem)
    updateHistory()
}

function backspace() {
    // const start = expressionElement.selectionStart;
    // const end = expressionElement.selectionEnd;
    // expressionElement.value = expressionElement.value.slice(0, -1);
    // if (expressionElement.value) {
    //     calculateResult();
    // } else {
    //     inputElement.value = "";
    // }
    const start = expressionElement.selectionStart;
    const end = expressionElement.selectionEnd;
    const text = expressionElement.value;

    if (start === end && start > 0) {
        expressionElement.value = text.slice(0, start - 1) + text.slice(end);
        expressionElement.selectionStart = expressionElement.selectionEnd = start - 1;
    } else {
        expressionElement.value = text.slice(0, start) + text.slice(end);
        expressionElement.selectionStart = expressionElement.selectionEnd = start;
    }
    if (expressionElement.value) {
        calculateResult();
    } else {
        inputElement.value = "";
    }
    setTimeout(() => {
        expressionElement.focus();
        expressionElement.selectionStart = expressionElement.selectionEnd = start - 1;
    }, 0);
    // expressionElement.focus()
    // calculateResult();
}

// function updateHistory(){
//     historyList.innerHTML = ""
//     for(let item of history){
//         const li = document.createElement("li")
//         li.textContent = item
//         historyList.appendChild(li)
//     }
// }
function updateHistory() {
    historyList.innerHTML = ""
    history.forEach((item, index) => {
        const li = document.createElement("li")
        li.className = "history-item"
        li.innerHTML = `
            <span>${item}</span>
            <button onclick="deleteHistoryItem(${index})">Delete</button>
        `;
        historyList.appendChild(li)
    })
}

window.deleteHistoryItem = function(index) {
    history.splice(index, 1)
    updateHistory()
}

document.addEventListener("keydown", (event) => {
    const key = event.key
    // expressionElement.focus()
    if (!isNaN(key) || key === '.') { 
        event.preventDefault();
        appendValue(expressionElement,key)
        calculateResult()
    } else if (key === 'Enter') {
        event.preventDefault();
        finalResult()
    } else if (key === 'Backspace') {
        // event.preventDefault()
        backspace()
    } else if (operators.includes(key)) {
        event.preventDefault();
        appendValue(expressionElement,key)
        calculateResult()
    } 
    else if(key === 'p' || key === 'P'){
        event.preventDefault();
        toggleSign()
    }
        else if (key === 'Escape') {
        clearResult()
    } else if (key === 'Delete') {
        clearResult()
    }
    else if (key === '(' || key === ')') { 
        event.preventDefault();
        appendValue(expressionElement,key);
        calculateResult();
    }
})