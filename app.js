let expenses = loadExpenses();

const fmt = new Intl.NumberFormat("no-NO");


// -------------------------
// Save
// -------------------------

function save() {
    saveExpenses(expenses);
}


// -------------------------
// Currency conversion
// -------------------------

function toNOK(amount, currency) {

    const rate = settings.currencies[currency];

    if (!rate) {
        return 0;
    }

    return amount / rate;
}


function fromNOK(amount, currency) {

    const rate = settings.currencies[currency];

    if (!rate) {
        return 0;
    }

    return amount * rate;
}


// -------------------------
// Add expense
// -------------------------

function addExpense() {

    const person =
        document.getElementById("person").value;

    const amount =
        Number(document.getElementById("amount").value);

    const currency =
        document.getElementById("currency").value;

    const desc =
        document.getElementById("desc").value;


    if (!amount) {
        return;
    }


    expenses.push({

        id: Date.now(),

        person,

        amount,

        currency,

        desc,

        date:
        new Date().toLocaleString("no-NO")

    });


    save();


    // Remember selections
    setDefaultUser(person);
    setDefaultCurrency(currency);


    render();


    // Do not remember these
    document.getElementById("amount").value = "";

    document.getElementById("desc").value = "";

}



// -------------------------
// Delete expense
// -------------------------

function deleteExpense(id) {


    if (!confirm(
        "Vil du slette denne betalingen?"
    )) {

        return;

    }


    expenses =
        expenses.filter(
            e => e.id !== id
        );


    save();

    render();

}



// -------------------------
// Calculate totals
// -------------------------

function calculate() {


    const totals = {};


    settings.users.forEach(user => {

        totals[user] = 0;

    });



    expenses.forEach(expense => {


        // Ignore deleted users safely
        if (!(expense.person in totals)) {

            totals[expense.person] = 0;

        }


        totals[expense.person] +=
            toNOK(
                expense.amount,
                expense.currency
            );


    });



    const total =
        Object.values(totals)
        .reduce(
            (a,b)=>a+b,
            0
        );


    const share =
        total / Object.keys(totals).length;



    const balances = {};


    Object.keys(totals)
    .forEach(user=>{

        balances[user] =
            totals[user] - share;

    });



    return {

        totals,

        balances

    };

}



// -------------------------
// Calculate payments
// -------------------------

function calculateSettlements() {


    const {
        balances
    } = calculate();



    const creditors = [];

    const debtors = [];



    Object.entries(balances)
    .forEach(([user,balance])=>{


        if (balance > 0.01) {

            creditors.push({

                user,

                amount: balance

            });

        }


        else if (balance < -0.01) {


            debtors.push({

                user,

                amount: -balance

            });


        }


    });



    const settlements = [];



    while (
        creditors.length &&
        debtors.length
    ) {


        const creditor =
            creditors[0];


        const debtor =
            debtors[0];



        const amount =
            Math.min(
                creditor.amount,
                debtor.amount
            );



        settlements.push({

            from: debtor.user,

            to: creditor.user,

            amount


        });



        creditor.amount -= amount;

        debtor.amount -= amount;



        if (creditor.amount < 0.01) {

            creditors.shift();

        }


        if (debtor.amount < 0.01) {

            debtors.shift();

        }


    }



    return settlements;

}


// -------------------------
// Debt display
// -------------------------

function debtText() {


    const settlements =
        calculateSettlements();



    if (!settlements.length) {

        return `
        <h2>
        Ingen skylder noe
        </h2>
        `;

    }



    let html = "";



    settlements.forEach(payment => {


        html += `

        <div class="row">

        <h2>
        ${payment.from}
        skylder
        ${payment.to}
        </h2>

        </div>


        <span class="large">

        NOK:
        ${fmt.format(
            Math.round(payment.amount)
        )}

        </span>


        <br>


        KRW:
        ${fmt.format(
            Math.round(
                fromNOK(
                    payment.amount,
                    "KRW"
                )
            )
        )}


        |

        JPY:
        ${fmt.format(
            Math.round(
                fromNOK(
                    payment.amount,
                    "JPY"
                )
            )
        )}


        |

        EUR:
        ${fmt.format(
            Math.round(
                fromNOK(
                    payment.amount,
                    "EUR"
                )
            )
        )}


        <br><br>

        `;


    });



    return html;

}





// -------------------------
// Render everything
// -------------------------

function render() {


    const result =
        calculate();



    // ------------------
    // Balances
    // ------------------

    const balance =
        document.getElementById("balance");


    balance.innerHTML = "";



    Object.keys(result.totals)
    .forEach(user=>{


        balance.innerHTML += `

        ${user} sum:

        ${fmt.format(
            Math.round(
                result.totals[user]
            )
        )}

        kr

        <br>

        `;


    });



    // ------------------
    // Debt
    // ------------------

    document
    .getElementById("debt")
    .innerHTML =
        debtText();





    // ------------------
    // Exchange rates
    // ------------------

    let ratesHTML = "";



    Object.keys(settings.currencies)
    .forEach(currency=>{


        ratesHTML += `

        1 NOK =
        ${settings.currencies[currency]}
        ${currency}

        <br>

        `;


    });



    document
    .getElementById("rates")
    .innerHTML =
        ratesHTML;




    // ------------------
    // History
    // ------------------

    const list =
        document.getElementById("list");



    list.innerHTML = "";



    expenses
    .slice()
    .reverse()
    .forEach(expense=>{


        const nok =
            toNOK(
                expense.amount,
                expense.currency
            );



        list.innerHTML += `


        <div class="item flex">


        <div>


        ${expense.date}

        -

        <b>
        ${expense.person}
        </b>


        <br>


        ${fmt.format(expense.amount)}

        ${expense.currency}


        (

        ${fmt.format(
            Math.round(nok)
        )}

        NOK

        )


        <br>


        <span class="small">

        ${expense.desc || ""}

        </span>


        </div>



        <button

        class="delete slett"

        onclick="
        deleteExpense(${expense.id})
        "

        >

        Slett

        </button>


        </div>


        `;


    });


}




// -------------------------
// Events
// -------------------------

document
.getElementById("add")
.onclick =
addExpense;



document
.getElementById("settingsButton")
.onclick =
showSettings;





// -------------------------
// Start app
// -------------------------

fillSelectors();

render();