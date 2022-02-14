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
exports.MXModelSDK = void 0;
const mendixmodelsdk_1 = require("mendixmodelsdk");
const mendixplatformsdk_1 = require("mendixplatformsdk");
const fs_1 = __importDefault(require("fs"));
class MXModelSDK {
    init(path, mxUsername, mxApiKey, projectName, projectId, branchName, revisionNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = new mendixplatformsdk_1.MendixSdkClient(mxUsername, mxApiKey);
            const project = new mendixplatformsdk_1.Project(client, projectId, projectName);
            const branch = new mendixplatformsdk_1.Branch(project, branchName);
            const revision = new mendixplatformsdk_1.Revision(revisionNumber, branch);
            console.log("----------------------------------------------------------------");
            console.log("Getting: " + project.id() + " - " + project.name());
            console.log("Branch: " + branch.name() + " - " + branch.project().name());
            console.log("Revision: " + revision.branch().name() + " - " + revision.num());
            console.log("----------------------------------------------------------------");
            function createDir(path) {
                console.log("Setting up project folder:" + path);
                try {
                    fs_1.default.statSync(path);
                }
                catch (e) {
                    fs_1.default.mkdirSync(path);
                }
            }
            createDir(path + "/navigation/");
            createDir(path + "/menus/");
            createDir(path + "/security/");
            // Get that Mendix Model!
            const workingCopy = yield project.createWorkingCopy(revision);
            // Create security model... save at the very end..
            const securityModel = {};
            workingCopy.model().allProjectSecurities().forEach((projectSecurity) => __awaiter(this, void 0, void 0, function* () {
                projectSecurity.load((loadedProjectSecurity) => {
                    loadedProjectSecurity.userRoles.forEach((userRole) => __awaiter(this, void 0, void 0, function* () {
                        userRole.load((loadedUserRole) => {
                            console.log("> Found user role: " + loadedUserRole.name);
                            securityModel[loadedUserRole.name] = [];
                            loadedUserRole.moduleRoles.forEach((moduleRole) => __awaiter(this, void 0, void 0, function* () {
                                try {
                                    securityModel[loadedUserRole.name].push({
                                        "module": getModule(moduleRole).name,
                                        "moduleRole": moduleRole.name
                                    });
                                    try {
                                        fs_1.default.writeFileSync(path + "/security/security.json", JSON.stringify(securityModel, null, 4));
                                        console.log(">> Found module roles for user role: " + loadedUserRole.name + " - " + getModule(moduleRole).name + "." + moduleRole.name);
                                    }
                                    catch (error) {
                                        console.log(`>> Continueing but still: error: ${error}`);
                                    }
                                }
                                catch (error) {
                                    console.log(`>> Continueing but still: error: ${error}`);
                                }
                            }));
                            try {
                                fs_1.default.writeFileSync(path + "/security/security.json", JSON.stringify(securityModel, null, 4));
                            }
                            catch (error) {
                                console.log(`>> Continueing but still: error: ${error}`);
                            }
                        }, true);
                    }));
                    try {
                        fs_1.default.writeFileSync(path + "/security/security.json", JSON.stringify(securityModel, null, 4));
                    }
                    catch (error) {
                        console.log(`>> Continueing but still: error: ${error}`);
                    }
                }, true);
            }));
            workingCopy.model().allDomainModels().forEach((domainModel) => __awaiter(this, void 0, void 0, function* () {
                const modulePath = path + getModule(domainModel).name;
                createDir(modulePath);
                createDir(modulePath + "/entities/");
                createDir(modulePath + "/microflows/");
                createDir(modulePath + "/pages/");
                createDir(modulePath + "/layouts/");
                createDir(modulePath + "/security/");
                const navigationModels = workingCopy.model().allNavigationDocuments();
                const menuModels = workingCopy.model().allMenuDocuments();
                const entityModels = workingCopy.model().allDomainModels().filter(obj => {
                    return getModule(obj).name === getModule(domainModel).name;
                });
                const securityModels = workingCopy.model().allModuleSecurities().filter(obj => {
                    return getModule(obj).name === getModule(domainModel).name;
                });
                const microflowModels = workingCopy.model().allMicroflows().filter(obj => {
                    return getModule(obj).name === getModule(domainModel).name;
                });
                const pageModels = workingCopy.model().allPages().filter(obj => {
                    return getModule(obj).name === getModule(domainModel).name;
                });
                const layoutModels = workingCopy.model().allLayouts().filter(obj => {
                    return getModule(obj).name === getModule(domainModel).name;
                });
                console.log("We have setup directory: " + modulePath);
                console.log("-> We have found: " + pageModels.length + " of pages.");
                let i;
                try {
                    for (i in menuModels) {
                        yield mendixplatformsdk_1.loadAsPromise(menuModels[i]).then((menuModel) => {
                            try {
                                const menuPath = path + "/menus/" + menuModel.id + ".js";
                                fs_1.default.writeFileSync(menuPath, mendixmodelsdk_1.JavaScriptSerializer.serializeToJs(menuModel));
                            }
                            catch (error) {
                                console.log(`>> Continueing but still: error: ${error}`);
                            }
                            try {
                                const menuJsonPath = path + "/menus/" + menuModel.id + ".json";
                                fs_1.default.writeFileSync(menuJsonPath, JSON.stringify(menuModel, null, 4));
                            }
                            catch (error) {
                                console.log(`>> Continueing but still: error: ${error}`);
                            }
                            console.log("Written navigation: /menus/" + menuModel.id + ".js / .json");
                        });
                    }
                }
                catch (error) {
                    console.log(`error: ${error}`);
                }
                try {
                    for (i in navigationModels) {
                        yield mendixplatformsdk_1.loadAsPromise(navigationModels[i]).then((navigationModel) => {
                            try {
                                const navigationPath = path + "/navigation/" + navigationModel.id + ".js";
                                fs_1.default.writeFileSync(navigationPath, mendixmodelsdk_1.JavaScriptSerializer.serializeToJs(navigationModel));
                            }
                            catch (error) {
                                console.log(`>> Continueing but still: error: ${error}`);
                            }
                            try {
                                const navigationJsonPath = path + "/navigation/" + navigationModel.id + ".json";
                                fs_1.default.writeFileSync(navigationJsonPath, JSON.stringify(navigationModel, null, 4));
                            }
                            catch (error) {
                                console.log(`>> Continueing but still: error: ${error}`);
                            }
                            console.log("Written navigation: /navigation/" + navigationModel.id + ".js / .json");
                        });
                    }
                }
                catch (error) {
                    console.log(`error: ${error}`);
                }
                try {
                    for (i in securityModels) {
                        yield mendixplatformsdk_1.loadAsPromise(entityModels[i]).then((securityModel) => {
                            try {
                                const securityPath = modulePath + "/security/" + securityModel.id + ".js";
                                fs_1.default.writeFileSync(securityPath, mendixmodelsdk_1.JavaScriptSerializer.serializeToJs(securityModel));
                            }
                            catch (error) {
                                console.log(`>> Continueing but still: error: ${error}`);
                            }
                            try {
                                const securityJsonPath = modulePath + "/security/" + securityModel.id + ".json";
                                fs_1.default.writeFileSync(securityJsonPath, JSON.stringify(securityModel, null, 4));
                            }
                            catch (error) {
                                console.log(`>> Continueing but still: error: ${error}`);
                            }
                            console.log("Written module security: " + getModule(securityModel).name + "/security/" + securityModel.id + ".js / .json");
                        });
                    }
                }
                catch (error) {
                    console.log(`error: ${error}`);
                }
                try {
                    for (i in entityModels) {
                        yield mendixplatformsdk_1.loadAsPromise(entityModels[i]).then((entityModel) => {
                            try {
                                const entityPath = modulePath + "/entities/" + entityModel.id + ".js";
                                fs_1.default.writeFileSync(entityPath, mendixmodelsdk_1.JavaScriptSerializer.serializeToJs(entityModel));
                            }
                            catch (error) {
                                console.log(`>> Continueing but still: error: ${error}`);
                            }
                            try {
                                const entityJsonPath = modulePath + "/entities/" + entityModel.id + ".json";
                                fs_1.default.writeFileSync(entityJsonPath, JSON.stringify(entityModel, null, 4));
                            }
                            catch (error) {
                                console.log(`>> Continueing but still: error: ${error}`);
                            }
                            console.log("Written entity: " + getModule(entityModel).name + "/entities/" + entityModel.id + ".js / .json");
                        });
                    }
                }
                catch (error) {
                    console.log(`error: ${error}`);
                }
                try {
                    for (i in microflowModels) {
                        yield mendixplatformsdk_1.loadAsPromise(microflowModels[i]).then((microflowModel) => {
                            try {
                                const microflowPath = modulePath + "/microflows/" + microflowModel.name + ".js";
                                fs_1.default.writeFileSync(microflowPath, mendixmodelsdk_1.JavaScriptSerializer.serializeToJs(microflowModel));
                            }
                            catch (error) {
                                console.log(`>> Continueing but still: error: ${error}`);
                            }
                            try {
                                const microflowJsonPath = modulePath + "/microflows/" + microflowModel.name + ".json";
                                fs_1.default.writeFileSync(microflowJsonPath, JSON.stringify(microflowModel, null, 4));
                            }
                            catch (error) {
                                console.log(`>> Continueing but still: error: ${error}`);
                            }
                            console.log("Written microflow: " + getModule(microflowModel).name + "/microflow/" + microflowModel.name + ".js / .json");
                        });
                    }
                }
                catch (error) {
                    console.log(`error: ${error}`);
                }
                try {
                    for (i in pageModels) {
                        yield mendixplatformsdk_1.loadAsPromise(pageModels[i]).then((pageModel) => {
                            try {
                                const pagePath = modulePath + "/pages/" + pageModel.name + ".js";
                                fs_1.default.writeFileSync(pagePath, mendixmodelsdk_1.JavaScriptSerializer.serializeToJs(pageModel));
                            }
                            catch (error) {
                                console.log(`>> Continueing but still: error: ${error}`);
                            }
                            try {
                                const pageJsonPath = modulePath + "/pages/" + pageModel.name + ".json";
                                fs_1.default.writeFileSync(pageJsonPath, JSON.stringify(pageModel, null, 4));
                            }
                            catch (error) {
                                console.log(`>> Continueing but still: error: ${error}`);
                            }
                            console.log("Written page: " + getModule(pageModel).name + "/pages/" + pageModel.name + ".js / .json");
                        });
                    }
                }
                catch (error) {
                    console.log(`error: ${error}`);
                }
                try {
                    for (i in layoutModels) {
                        yield mendixplatformsdk_1.loadAsPromise(layoutModels[i]).then((layoutModel) => {
                            try {
                                const layoutPath = modulePath + "/layouts/" + layoutModel.name + ".js";
                                fs_1.default.writeFileSync(layoutPath, mendixmodelsdk_1.JavaScriptSerializer.serializeToJs(layoutModel));
                            }
                            catch (error) {
                                console.log(`>> Continueing but still: error: ${error}`);
                            }
                            try {
                                const layoutJsonPath = modulePath + "/layouts/" + layoutModel.name + ".json";
                                fs_1.default.writeFileSync(layoutJsonPath, JSON.stringify(layoutModel, null, 4));
                            }
                            catch (error) {
                                console.log(`>> Continueing but still: error: ${error}`);
                            }
                            console.log("Written layout: " + getModule(layoutModel).name + "/layouts/" + layoutModel.name + ".js / .json");
                        });
                    }
                }
                catch (error) {
                    console.log(`error: ${error}`);
                }
            }));
            function getModule(element) {
                let current = element.unit;
                while (current) {
                    if (current instanceof mendixmodelsdk_1.projects.Module) {
                        return current;
                    }
                    current = current.container;
                }
                // @ts-ignore
                return current;
            }
        });
    }
}
exports.MXModelSDK = MXModelSDK;
//# sourceMappingURL=MXModelSDK.js.map