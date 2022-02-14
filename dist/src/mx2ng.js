"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Licensed to the MangoICT software company under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
const cli_1 = require("./cli");
const package_json_1 = __importDefault(require("../package.json"));
class SystemMX2NG {
    exec() {
        // Init cli
        const cli = new cli_1.Cli();
        // Process commandline arguments
        if (process.argv.length === 2) {
            cli.intro();
        }
        else {
            process.argv.forEach(function (val, index, array) {
                switch (val) {
                    case "--version":
                        console.log("current version is: " + package_json_1.default.version);
                        break;
                    case "pwd":
                        cli.pwd();
                        break;
                    case "init":
                        cli.init();
                        break;
                    case "fetch-mendix":
                        if (process.argv[index + 1] !== undefined) {
                            cli.fetch(process.argv[index + 1]);
                        }
                        else {
                            cli.fetch();
                        }
                        break;
                    case "create-ng":
                        if (process.argv[index + 1] !== undefined) {
                            cli.createAngular(process.argv[index + 1]);
                        }
                        else {
                            cli.createAngular();
                        }
                        break;
                    case "push":
                        cli.push();
                        break;
                }
            });
        }
    }
}
exports.SystemMX2NG = SystemMX2NG;
//# sourceMappingURL=mx2ng.js.map