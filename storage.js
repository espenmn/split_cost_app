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
            "Me",
            "You"
        ],

        currencies: {
            NOK: 1,
            EUR: 0.089, 
        },

        defaults: {
            user: "Me",
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