"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NGDashboardGenerator_1 = require("./components/dashboard/NGDashboardGenerator");
class NGAppGenerator {
    init(path) {
        const dashboard = new NGDashboardGenerator_1.NGDashboardGenerator();
        dashboard.init(path);
    }
}
exports.NGAppGenerator = NGAppGenerator;
//# sourceMappingURL=NGAppGenerator.js.map