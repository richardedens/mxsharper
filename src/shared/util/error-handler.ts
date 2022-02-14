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
function errorHandler(err: any, req: any, res: any, next: any) {
    if (typeof (err) === "string") {
        // custom application error
        return res.status(400).json({ message: err });
    }

    if (err.name === "ValidationError") {
        // mongoose validation error
        return res.status(400).json({ message: err.message });
    }

    if (err.name === "UnauthorizedError") {
        // jwt authentication error
        return res.status(401).json({ message: "Invalid Token" });
    }

    // default to 500 server error
    return res.status(500).json({ message: err.message });
}

module.exports = errorHandler;
