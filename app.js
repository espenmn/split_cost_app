let expenses = loadExpenses();

const fmt = new Intl.NumberFormat("no-NO");


function save() {
    saveExpenses(expenses);
}



function toNOK(amount, currency) {

    return amount / settings.currencies[currency];

}


function fromNOK(amount, currency) {

    return amount * settings.currencies[currency];

}



function addExpense(){

    const person =
        document.getElementById("person").value;

    const amount =
        Number(document.getElementById("amount").value);

    const currency =
        document.getElementById("currency").value;

    const desc =
        document.getElementById("desc").value;


    if (!amount) return;


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


    // remember last choices
    setDefaultUser(person);
    setDefaultCurrency(currency);


    render();


    // Clear only these fields
    document.getElementById("amount").value="";
    document.getElementById("desc").value="";

}




function deleteExpense(id){

    if (!confirm(
        "Vil du slette denne betalingen?"
    )) return;


    expenses =
        expenses.filter(
            e=>e.id !== id
        );


    save();

    render();

}



function calculate(){


    let totals={};


    settings.users.forEach(u=>{
        totals[u]=0;
    });



    expenses.forEach(e=>{

        totals[e.person] +=
            toNOK(
                e.amount,
                e.currency
            );

    });



    let total=0;

    Object.values(totals)
    .forEach(v=> total+=v);



    let share =
        total / settings.users.length;



    let maxUser=null;
    let maxValue=-Infinity;


    Object.keys(totals)
    .forEach(u=>{

        let diff =
            totals[u]-share;


        if(diff>maxValue){

            maxValue=diff;
            maxUser=u;

        }

    });



    return {
        totals,
        debt:maxValue,
        user:maxUser
    };

}




function debtText(){

    const result =
        calculate();


    if(result.debt < 0.01){

        return "Ingen skylder noe";

    }


    let debtor =
        settings.users
        .find(u =>
            u !== result.user
        );


    let amount =
        result.debt;



    return `
    <div class="row">        
    <h2>
    ${debtor} skylder ${result.user}
    </h2>
    </div>

 
    <span class="large">

    NOK:
    ${fmt.format(Math.round(amount))}

    </span>

    <br>


    KRW:
    ${fmt.format(
        Math.round(
        fromNOK(amount,"KRW"))
    )}


    |

    JPY:
    ${fmt.format(
        Math.round(
        fromNOK(amount,"JPY"))
    )}


    |

    EUR:
    ${fmt.format(
        Math.round(
        fromNOK(amount,"EUR"))
    )}
 
    `;


}




function render(){


    let result =
        calculate();



    let balance =
        document.getElementById("balance");


    balance.innerHTML="";


    Object.keys(result.totals)
    .forEach(u=>{

        balance.innerHTML += `

        ${u} sum:
        ${fmt.format(
            Math.round(
            result.totals[u])
        )}
        kr<br>

        `;

    });



    document.getElementById("debt")
    .innerHTML =
        debtText();



    document.getElementById("rates")
    .innerHTML = `

    100 NOK =
    ${fmt.format(
        100*settings.currencies.KRW || 0
    )}
    KRW |

    ${fmt.format(
        100*settings.currencies.JPY || 0
    )}
    JPY |

    ${fmt.format(
        100*settings.currencies.EUR || 0
    )}
    EUR

    `;



    let list =
        document.getElementById("list");


    list.innerHTML="";


    expenses
    .slice()
    .reverse()
    .forEach(e=>{


        let nok =
            toNOK(
                e.amount,
                e.currency
            );


        list.innerHTML += `


        <div class="item flex">

        <div>

        ${e.date}
        -
        <b>${e.person}</b>


        <br>

        ${fmt.format(e.amount)}
        ${e.currency}

        (${fmt.format(
            Math.round(nok)
        )}
        NOK)


        <br>

        <span class="small">
        ${e.desc || ""}
        </span>



        </div>
        <button
        class="delete slett"
        onclick="deleteExpense(${e.id})">

        Slett

        </button>



        </div>


        `;


    });


}



document
.getElementById("add")
.onclick =
addExpense;



document
.getElementById("settingsButton")
.onclick =
showSettings;



fillSelectors();

render();