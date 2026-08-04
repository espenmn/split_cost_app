const STORAGE_EXPENSES = "expenses";
const STORAGE_SETTINGS = "utlegg_settings";

function loadExpenses() {
    return JSON.parse(localStorage.getItem(STORAGE_EXPENSES) || "[]");
}

function saveExpenses(data) {
    localStorage.setItem(STORAGE_EXPENSES, JSON.stringify(data));
}

function defaultSettings() {
    return {
        users: [
            "Kari",
            "Espen"
        ],

        currencies: {
            NOK: 1,
            EUR: 0.089,
            KRW: 156,
            JPY: 16.35
        },

        defaults: {
            user: "Kari",
            currency: "NOK"
        }
    };
}

function loadSettings() {
    let settings = JSON.parse(
        localStorage.getItem(STORAGE_SETTINGS)
    );

    if (!settings) {
        settings = defaultSettings();
        saveSettings(settings);
    }

    return settings;
}

function saveSettings(settings) {
    localStorage.setItem(
        STORAGE_SETTINGS,
        JSON.stringify(settings)
    );
}