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
import { Intro } from "./shared/util/intro";
import { Resources } from "./shared/resources/lang";
import { MXModelSDK } from "./mendix/MXModelSDK";

import prompts from "prompts";
import fs from "fs";
import clear from "clear";

const resource = new Resources().lang("en_EN");

class Cli {

    push() {
        // TODO push something
    }

    intro() {
        clear();
        const intro: Intro = new Intro();
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
        clear();
        const intro: Intro = new Intro();
        intro.show(resource.CLI_INFO, () => {
            console.log(resource.EMPTY);
            console.log(resource.CLI_PROJECT_SETTINGS);

            const questions:any = [{
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
            },{
                type: "text",
                name: "branch",
                message: "Please fill in the branch of the mendix project"
            },{
                type: "text",
                name: "revision",
                message: "Please fill in the revision of the mendix project"
            },{
                type: "text",
                name: "gitrepoangular",
                message: "Please fill in the GIT repo of your angular application"
            }];

            (async () => {
                const response = await prompts(questions);

                const directory = (process.cwd() + '/.mendix');

                try {
                    fs.statSync(directory);
                    fs.unlinkSync(directory);
                    fs.mkdirSync(directory);
                } catch (e) {
                    fs.mkdirSync(directory);
                }

                fs.writeFileSync(directory + '/config.json', JSON.stringify(response));

                console.log(resource.EMPTY);
                console.log(response);
            })();
        });
    }

    fetch(projectName: String = "") {
        clear();
        const intro: Intro = new Intro();

        function createDir(name) {
            console.log('Setting up project folder:' + name);
            try {
                fs.statSync(name);
            } catch (e) {
                fs.mkdirSync(name);
            }
        }

        intro.show(resource.CLI_INFO, () => {
            console.log(resource.EMPTY);
            console.log(resource.CLI_FETCH);

            const mx = new MXModelSDK();
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

export { Cli };