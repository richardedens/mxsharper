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
import figlet from "figlet";
import chalk from "chalk";

interface IIntro {
    show(msg: string, cb: any): boolean;
}

class Intro implements IIntro {

    show(msg: string, cb: any): boolean {

        figlet(msg, (err: Error, data: string) => {
            if (err) {
                console.log("Something went wrong...");
                console.dir(err);
                return;
            }
            console.log(chalk.yellow(data));
            cb();
        });

        return true;

    }

}

export { Intro };
