function fillSelectors() {

    const person =
        document.getElementById("person");

    const currency =
        document.getElementById("currency");


    person.innerHTML = "";

    settings.users.forEach(user => {

        let option =
            document.createElement("option");

        option.value = user;
        option.textContent = user;

        person.appendChild(option);

    });


    currency.innerHTML = "";

    Object.keys(settings.currencies)
        .forEach(cur => {

            let option =
                document.createElement("option");

            option.value = cur;
            option.textContent = cur;

            currency.appendChild(option);

        });


    person.value =
        settings.defaults.user;

    currency.value =
        settings.defaults.currency;
}



function showSettings() {

    let html = `
    <div class="container">
        <div class="card dialog">

            <div class="row">
                <h2>Brukere</h2>
            </div>
        

            <div id="users"></div>

            <input id="newUser"
                placeholder="Ny bruker">

            <button onclick="createUser()">
                Legg til bruker
            </button>


            <hr>

            <div class="row">
                <h2>Valuta</h2>
            </div>

            <div id="currencies"></div>


            <input id="newCurrency"
                placeholder="Kode f.eks DKK">

            <input id="newRate"
                placeholder="Kurs f.eks 0.8"
                type="number">


            <button onclick="createCurrency()">
                Legg til valuta
            </button>


            <br><br>

            <button class="ferdig" onclick="closeSettings()">
                Ferdig
            </button>


        </div>
    </div>
    `;


    document.body.insertAdjacentHTML(
        "afterbegin",
        html
    );

    renderSettings(); 
    
}



function renderSettings() {

    let users =
        document.getElementById("users");

    if (!users) return;


    users.innerHTML = "";


    settings.users.forEach(u => {

        users.innerHTML += `

        <div class="settingsRow">

        ${u}

        <button  class="slett"
        onclick="removeUser('${u}')">
        Slett
        </button>

        </div>

        `;

    });



    let currencies =
        document.getElementById("currencies");


    currencies.innerHTML = "";


    Object.keys(settings.currencies)
        .forEach(c => {

            currencies.innerHTML += `

        <div class="settingsRow">

        ${c}
        :
        ${settings.currencies[c]}


        <button class="slett"
        onclick="removeCurrency('${c}')">
        Slett
        </button>

        </div>

        `;

        });

        document.getElementById("maincontainer").style.visibility= 'hidden';        

}



function createUser() {

    addUser(
        document.getElementById("newUser").value
    );

    fillSelectors();
    renderSettings();
}



function removeUser(u) {

    deleteUser(u);

    fillSelectors();
    renderSettings();
}



function createCurrency() {

    addCurrency(
        document.getElementById("newCurrency").value,
        document.getElementById("newRate").value
    );

    fillSelectors();
    renderSettings();

}



function removeCurrency(c) {

    deleteCurrency(c);
    fillSelectors();
    renderSettings();

}



function closeSettings() {

    document.querySelector(".dialog")
        .remove();
        document.getElementById("maincontainer").style.visibility= 'visible';

}