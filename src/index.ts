import App from "app";
import "routes";
import environments from "app/environments";

new App(environments.PORT);
