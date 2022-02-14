"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class NGDashboardGenerator {
    init(path) {
        console.log(">> Attempting to alter the dashboard");
        console.log(path);
        // Getting the navigation definiton
        fs_1.default.readdir(path + "navigation", function (err, files) {
            if (err) {
                return console.log("Unable to scan directory: " + path + "navigation" + " - " + err);
            }
            ;
            files.forEach(function (file) {
                // Interpret the navigation file.
                if (file.endsWith(".json")) {
                    console.log(file);
                    const navigationDefinitionJSON = fs_1.default.readFileSync(path + "navigation/" + file);
                    const navigationDefinition = JSON.parse(navigationDefinitionJSON.toString());
                    console.log(navigationDefinition);
                    navigationDefinition.profiles.forEach((item, index) => {
                        if (item.kind.toLowerCase() === "responsive") {
                            console.log(item.roleBasedHomePages);
                        }
                    });
                }
            });
        });
    }
}
exports.NGDashboardGenerator = NGDashboardGenerator;
//# sourceMappingURL=NGDashboardGenerator.js.map