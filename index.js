const inputslider=document.querySelector("[data-lengthSlider]");
const lenghtDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copymessage]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
let password="";
let passwordLength=10;
let checkcount=0;
handleslider();
//set strength circle color to grey
setIndicator("#ccc");

//set passsword length
function handleslider(){
    inputslider.value=passwordLength;
    lenghtDisplay.innerText=passwordLength;
    const min=inputslider.min;
    const max=inputslider.max;
    inputslider.style.backgroundSize=( (passwordLength - min)*100/(max + min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    //shadow -HW
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;

}
function getRandomInteger(min,max){
    return Math.floor(Math.random()*[max-min])+min;
}
function generateRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65,91));
}

function generateSymbol(){
     const randNum=getRandomInteger(0,symbols.length);
     return symbols.charAt(randNum);
}
function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym=false;
    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(numbersCheck.checked)hasNum=true;
    if(symbolsCheck.checked)hasSym=true;
    if(hasUpper && hasLower && hasNum && hasSym && passwordLength>=10){
        setIndicator("#0f0");
    }
    else if(
        (hasLower || hasUpper) &&
        (hasNum || hasSym) &&
        passwordLength >=6
    ){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }

}

async function copyContent(){
    try{
    await navigator.clipboard.writeText(passwordDisplay.value);
    copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }
    //to make copy vala span visible 
    copyMsg.classList.add("active");

    setTimeout(()=>{
        copyMsg.classList.remove("active"); 
    },2000);
}


function shufflePassword(array){
    //fisher yates method
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}


function handleCheckBoxchange(){
    checkcount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkcount++;
    }); 
    //special condition
    if(passwordLength<checkcount){
        passwordLength=checkcount;
        handleslider();
    }
}
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxchange);
})
//here input mean sliding
inputslider.addEventListener('input',(e)=>{
    passwordLength=e.target.value;
    handleslider();
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})
generateBtn.addEventListener('click',()=>{
    //none of checkbox are selected
    if(checkcount<=0)
        return;
    if(passwordLength<checkcount){
        passwordLength=checkcount;
        handleslider();
    }

    //let's start the finding passwords
    //remove old password
    password="";


    //let's put the checkbox content
    // if(uppercaseCheck.checked){
    //     password+=generateUpperCase();
    // }

    // if(lowercaseCheck.checked){
    //     password+=generateLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password+=generateRandomNumber();
    // }

    // if(symbolsCheck.checked){
    //     password+=generateSymbol();
    // }

    let funcArr=[];
    if(uppercaseCheck.checked){
        funcArr.push(generateUpperCase);
    }

    if(lowercaseCheck.checked){
        funcArr.push(generateLowerCase);
    }

    if(numbersCheck.checked){
        funcArr.push(generateRandomNumber);  
    }

    if(symbolsCheck.checked){
        funcArr.push(generateSymbol);
    }

    //compulsary addition
    for(let i=0;i<funcArr.length;i++){
        password+=funcArr[i]();
    }

    //remaining addition
    for( let i=0;i<passwordLength-funcArr.length;i++){
        let randomInteger=getRandomInteger(0,funcArr.length);
        password+=funcArr[randomInteger]();
    }

    //shuffle the password

    password=shufflePassword(Array.from(password));
    //show in ui

    passwordDisplay.value=password;

    //calculate strength
    calcStrength();

    
})