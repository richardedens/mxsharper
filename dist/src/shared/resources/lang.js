"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Resources = void 0;
class Resources {
    lang(lng) {
        const en_EN_Content = {
            EMPTY: "",
            CLI_INFO: "mxsharper",
            CLI_SLOGAN: "We let you export your Mendix Model to full blown angular application.",
            CLI_HELP_ASSIST: "When you want more information please add --help as your first parameter.",
            CLI_LOGIN_CREDENTIALS: "Please enter your login credentials.",
            CLI_PROJECT_SETTINGS: "Please enter project settings.",
            CLI_FETCH: "We will start fetching your Mendix project.",
            CLI_ANGULAR: "Creating an angular app from the Mendix applications."
        };
        const resources = {
            en_EN: en_EN_Content
        };
        return resources[lng];
    }
}
exports.Resources = Resources;
//# sourceMappingURL=lang.js.map