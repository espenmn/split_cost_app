let settings = loadSettings();

function addUser(name) {
    name = name.trim();

    if (!name) return;

    if (!settings.users.includes(name)) {
        settings.users.push(name);
        saveSettings(settings);
    }
}


function deleteUser(name) {

    const used = expenses.some(
        e => e.person === name
    );

    if (used) {
        alert(
          "Denne brukeren har utlegg og kan ikke slettes."
        );
        return;
    }

    settings.users =
        settings.users.filter(
            u => u !== name
        );

    saveSettings(settings);
}


function addCurrency(code, rate) {

    code = code.toUpperCase().trim();

    if (!code || !rate) return;

    settings.currencies[code] =
        Number(rate);

    saveSettings(settings);
}


function deleteCurrency(code) {

    if (code === "NOK") {
        alert("NOK kan ikke slettes.");
        return;
    }

    delete settings.currencies[code];

    saveSettings(settings);
}


function setDefaultUser(user) {

    settings.defaults.user = user;
    saveSettings(settings);
}


function setDefaultCurrency(currency) {

    settings.defaults.currency = currency;
    saveSettings(settings);
}