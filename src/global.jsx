import "dotenv/config";

class Global {
    constructor() {
        if (!Global.instance) {
            this.isLoggedIn = false;
            this.jwt = null;
            this.username = '';
            this.currency = 1000; // example currency amount
            Global.instance = this;

            // Load from localStorage if available
            const storedToken = localStorage.getItem("token");
            const storedUsername = localStorage.getItem("username");
            const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === 'true';
            const storedCurrency = localStorage.getItem("currency");

            if (storedToken) {
                this.jwt = storedToken;
                this.isLoggedIn = storedIsLoggedIn;
                this.username = storedUsername;
                this.currency = storedCurrency ? parseInt(storedCurrency, 10) : this.currency;
            }
        }
        return Global.instance;
    }

    login(user, token) {
        this.isLoggedIn = true;
        this.username = user;
        this.jwt = token;

        localStorage.setItem("token", token);
        localStorage.setItem("username", user);
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("currency", this.currency);
    }

    logout() {
        this.isLoggedIn = false;
        this.username = '';
        this.jwt = null;
        localStorage.clear();
    }
}

const Globaler = new Global();

export default Globaler;