"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cli = void 0;
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
const intro_1 = require("./shared/util/intro");
const lang_1 = require("./shared/resources/lang");
const MXModelSDK_1 = require("./mendix/MXModelSDK");
const prompts_1 = __importDefault(require("prompts"));
const fs_1 = __importDefault(require("fs"));
const clear_1 = __importDefault(require("clear"));
const resource = new lang_1.Resources().lang("en_EN");
class Cli {
    push() {
        // TODO push something
    }
    intro() {
        clear_1.default();
        const intro = new intro_1.Intro();
        intro.show(resource.CLI_INFO, () => {
            console.log(resource.CLI_SLOGAN);
            console.log(resource.CLI_HELP_ASSIST);
            console.log(resource.EMPTY);
        });
    }
    pwd() {
        console.log(process.cwd());
    }
    init() {
        clear_1.default();
        const intro = new intro_1.Intro();
        intro.show(resource.CLI_INFO, () => {
            console.log(resource.EMPTY);
            console.log(resource.CLI_PROJECT_SETTINGS);
            const questions = [{
                    type: "text",
                    name: "name",
                    message: "Please fill in the name of this project"
                }, {
                    type: "text",
                    name: "version",
                    message: "Please fill in the version"
                }, {
                    type: "text",
                    name: "author",
                    message: "Please fill in the author"
                }, {
                    type: "text",
                    name: "mendixusername",
                    message: "Please fill in your mendix user name (email)"
                }, {
                    type: "text",
                    name: "mendixapikey",
                    message: "Please fill in your mendix api key"
                }, {
                    type: "text",
                    name: "mendixproject",
                    message: "Please fill in your mendix project name"
                }, {
                    type: "text",
                    name: "mendixprojectid",
                    message: "Please fill in your mendix project id"
                }, {
                    type: "text",
                    name: "branch",
                    message: "Please fill in the branch of the mendix project"
                }, {
                    type: "text",
                    name: "revision",
                    message: "Please fill in the revision of the mendix project"
                }, {
                    type: "text",
                    name: "gitrepoangular",
                    message: "Please fill in the GIT repo of your angular application"
                }];
            (() => __awaiter(this, void 0, void 0, function* () {
                const response = yield prompts_1.default(questions);
                const directory = (process.cwd() + '/.mendix');
                try {
                    fs_1.default.statSync(directory);
                    fs_1.default.unlinkSync(directory);
                    fs_1.default.mkdirSync(directory);
                }
                catch (e) {
                    fs_1.default.mkdirSync(directory);
                }
                fs_1.default.writeFileSync(directory + '/config.json', JSON.stringify(response));
                console.log(resource.EMPTY);
                console.log(response);
            }))();
        });
    }
    fetch(projectName = "") {
        clear_1.default();
        const intro = new intro_1.Intro();
        function createDir(name) {
            console.log('Setting up project folder:' + name);
            try {
                fs_1.default.statSync(name);
            }
            catch (e) {
                fs_1.default.mkdirSync(name);
            }
        }
        intro.show(resource.CLI_INFO, () => {
            console.log(resource.EMPTY);
            console.log(resource.CLI_FETCH);
            const mx = new MXModelSDK_1.MXModelSDK();
            const directory = (process.cwd() + "/.mendix");
            // First create the project directory.
            let projectDirectory = directory + "/../";
            createDir(projectDirectory);
            // Secondly alter the path to a named project if this is provided.
            let projectNamedDirectory = "";
            if (projectName !== "") {
                projectNamedDirectory = projectDirectory + projectName + "/";
                projectDirectory = projectNamedDirectory;
                createDir(projectDirectory);
            }
            const configuration = require(directory + "/config.json");
            mx.init(projectDirectory, configuration.mendixusername, configuration.mendixapikey, configuration.mendixproject, configuration.mendixprojectid, configuration.branch, configuration.revision);
        });
    }
}
exports.Cli = Cli;
//# sourceMappingURL=cli.js.map