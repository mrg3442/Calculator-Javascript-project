// creates object to track values
const  Calculator = {
    //displays 0 on screen
    Display_Value: '0',
    //holds first operend for expressions is set to null by default
    First_Operand: null,
    //checks to see if second operand has been inputed
    Wait_Second_Operand: false,
    //holds operator
    operator: null,
};

//modifies values each time button is clicked
function Input_Digit(digit) {
    const {Display_Value, Wait_Second_Operand } = Calculator;
    //checks to see if wait second operand is true and set
    //display value to key that was clicked
    if(Wait_Second_Operand === true) {
        Calculator.Display_Value = digit;
        Calculator.Wait_Second_Operand = false;
    }else {
        //overwrites display value if set to 0
        // otherwise adds to it
        Calculator.Display_Value = Display_Value === '0' ? digit : Display_Value + digit;
    }
}
// handles decimal points
function Input_Decimal(dot) {
    //ensures that accidental clicking of the decimal point
    //avoids bugs
    if (Calculator.Wait_Second_Operand === true) return;
    if(!Calculator.Display_Value.includes(dot)) {
        // if display value does not include decimal we want to add decimal
        Calculator.Display_Value += dot;
    }
}

//handles operators
function Handle_Operator(Next_Operator) {
    const { First_Operand, Display_Value, operator} = Calculator
    //when operator key is pressed the current number displayed
    // is converted to a number and stores the result in 
    //calculator.first_operand if it doesnt exist already
    const Value_of_Input = parseFloat(Display_Value);
    //checks if operator exits and if wait_second_operand is true,
    //then updates operator and exits function
    if(operator && Calculator.Wait_Second_Operand) {
        Calculator.operator = Next_Operator;
        return
    }
    if(First_Operand==null) {
        Calculator.First_Operand = Value_of_Input;
    }else if(operator) {//checks if an operator already exists
        const Value_Now = First_Operand || 0;
        //if operator exists, property lookup is performed for the operator
        //in the Perform_Calculations object and the function that matches the 
        //operator is excuted
        let result = Perform_Calculation[operator](Value_Now, Value_of_Input);
        //add fixed amount of numbers after decimals
        result = Number(result).toFixed(9)
        //removes trailing 0's
        result = Number(result * 1).toString()
        Calculator.Display_Value = parseFloat(result);
        Calculator.First_Operand = parseFloat(result);
    }
    Calculator.Wait_Second_Operand = true;
    Calculator.operator = Next_Operator;
}

const Perform_Calculation = {
    '/': (First_Operand, Second_Operand) => First_Operand / Second_Operand,

    '*': (First_Operand, Second_Operand) => First_Operand * Second_Operand,

    '+': (First_Operand, Second_Operand) => First_Operand + Second_Operand,

    '-': (First_Operand, Second_Operand) => First_Operand - Second_Operand,

    '=': (First_Operand, Second_Operand) => Second_Operand
};

function Calculator_Reset() {
    Calculator.Display_Value = '0';
    Calculator.First_Operand = null;
    Calculator.Wait_Second_Operand = false;
    Calculator.operator = null;
}

// updates screen with contents of Display_Value
function Update_Display() {
    const display = document.querySelector('.calculator-screen');
    display.value = Calculator.Display_Value
}

Update_Display();
//this section monitors button clicks
const keys = document.querySelector('.calculator-keys');
keys.addEventListener('click', (event) => {
    //the target var is a object that represents element that was clicked
    const {target} = event;
    //if element thatw was clicked on was not a button exit function
    if(!target.matches('button')) {
        return;
    }

    if (target.classList.contains('operator')) {
        Handle_Operator(target.value);
        Update_Display();
        return;
    }
    //ensures that AC clears numbers from calculator
    if(target.classList.contains('all-clear')) {
        Calculator_Reset();
        Update_Display();
        return;
    }

    Input_Digit(target.value);
    Update_Display();
})