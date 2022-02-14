import { ModelSdkClient, IModel, projects, IModelUnit, domainmodels, JavaScriptSerializer, IStructure } from "mendixmodelsdk";
import { MendixSdkClient, Project, OnlineWorkingCopy, loadAsPromise, Revision, Branch } from "mendixplatformsdk";
import fs from "fs";

class MXModelSDK {

    async init(path: string, mxUsername: string, mxApiKey: string, projectName: string, projectId: string, branchName: string, revisionNumber: any) {

        const client: MendixSdkClient = new MendixSdkClient(mxUsername, mxApiKey);
        const project: Project = new Project(client, projectId, projectName);
        const branch: Branch = new Branch(project, branchName);
        const revision: Revision = new Revision(<number><any>revisionNumber, branch);

        console.log("----------------------------------------------------------------");
        console.log("Getting: " + project.id() + " - " + project.name());
        console.log("Branch: " + branch.name() + " - " + branch.project().name());
        console.log("Revision: " + revision.branch().name() + " - " + revision.num());
        console.log("----------------------------------------------------------------");

        function createDir(path) {
            console.log("Setting up project folder:" + path);
            try {
                fs.statSync(path);
            } catch (e) {
                fs.mkdirSync(path);
            }
        }

        createDir(path + "/navigation/");
        createDir(path + "/menus/");
        createDir(path + "/security/");

        // Get that Mendix Model!
        const workingCopy: OnlineWorkingCopy = await project.createWorkingCopy(revision);

        // Create security model... save at the very end..
        const securityModel = {};
        workingCopy.model().allProjectSecurities().forEach(async projectSecurity => {
            projectSecurity.load((loadedProjectSecurity) => {
                loadedProjectSecurity.userRoles.forEach(async userRole => {
                    userRole.load((loadedUserRole) => {
                        console.log("> Found user role: " + loadedUserRole.name);
                        securityModel[loadedUserRole.name] = [];
                        loadedUserRole.moduleRoles.forEach(async moduleRole => {
                            try {
                                securityModel[loadedUserRole.name].push({
                                    "module": getModule(moduleRole).name,
                                    "moduleRole": moduleRole.name
                                });
                                try {
                                    fs.writeFileSync(path + "/security/security.json", JSON.stringify(securityModel, null, 4));
                                    console.log(">> Found module roles for user role: " + loadedUserRole.name + " - " + getModule(moduleRole).name + "." + moduleRole.name);
                                } catch (error) {
                                    console.log(`>> Continueing but still: error: ${error}`);
                                }
                            } catch (error) {
                                console.log(`>> Continueing but still: error: ${error}`);
                            }
                        });
                        try {
                            fs.writeFileSync(path + "/security/security.json", JSON.stringify(securityModel, null, 4));
                        } catch (error) {
                            console.log(`>> Continueing but still: error: ${error}`);
                        }
                    }, true);

                });
                try {
                    fs.writeFileSync(path + "/security/security.json", JSON.stringify(securityModel, null, 4));
                } catch (error) {
                    console.log(`>> Continueing but still: error: ${error}`);
                }
            }, true);
        });

        workingCopy.model().allDomainModels().forEach(async domainModel => {

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

            let i: any;

            try {
                for (i in menuModels) {
                    await loadAsPromise(menuModels[i]).then((menuModel) => {

                        try {
                            const menuPath = path + "/menus/" + menuModel.id + ".js";
                            fs.writeFileSync(menuPath, JavaScriptSerializer.serializeToJs(menuModel));
                        } catch (error) {
                            console.log(`>> Continueing but still: error: ${error}`);
                        }

                        try {
                            const menuJsonPath = path + "/menus/" + menuModel.id + ".json";
                            fs.writeFileSync(menuJsonPath, JSON.stringify(menuModel, null, 4));
                        } catch (error) {
                            console.log(`>> Continueing but still: error: ${error}`);
                        }

                        console.log("Written navigation: /menus/" + menuModel.id + ".js / .json");
                    });
                }
            } catch (error) {
                console.log(`error: ${error}`);
            }

            try {
                for (i in navigationModels) {
                    await loadAsPromise(navigationModels[i]).then((navigationModel) => {


                        try {
                            const navigationPath = path + "/navigation/" + navigationModel.id + ".js";
                            fs.writeFileSync(navigationPath, JavaScriptSerializer.serializeToJs(navigationModel));
                        } catch (error) {
                            console.log(`>> Continueing but still: error: ${error}`);
                        }

                        try {
                            const navigationJsonPath = path + "/navigation/" + navigationModel.id + ".json";
                            fs.writeFileSync(navigationJsonPath, JSON.stringify(navigationModel, null, 4));
                        } catch (error) {
                            console.log(`>> Continueing but still: error: ${error}`);
                        }

                        console.log("Written navigation: /navigation/" + navigationModel.id + ".js / .json");
                    });
                }
            } catch (error) {
                console.log(`error: ${error}`);
            }

            try {
                for (i in securityModels) {
                    await loadAsPromise(entityModels[i]).then((securityModel) => {

                        try {
                            const securityPath = modulePath + "/security/" + securityModel.id + ".js";
                            fs.writeFileSync(securityPath, JavaScriptSerializer.serializeToJs(securityModel));
                        } catch (error) {
                            console.log(`>> Continueing but still: error: ${error}`);
                        }

                        try {
                            const securityJsonPath = modulePath + "/security/" + securityModel.id + ".json";
                            fs.writeFileSync(securityJsonPath, JSON.stringify(securityModel, null, 4));
                        } catch (error) {
                            console.log(`>> Continueing but still: error: ${error}`);
                        }

                        console.log("Written module security: " + getModule(securityModel).name + "/security/" + securityModel.id + ".js / .json");
                    });
                }
            } catch (error) {
                console.log(`error: ${error}`);
            }

            try {
                for (i in entityModels) {
                    await loadAsPromise(entityModels[i]).then((entityModel) => {

                        try {
                            const entityPath = modulePath + "/entities/" + entityModel.id + ".js";
                            fs.writeFileSync(entityPath, JavaScriptSerializer.serializeToJs(entityModel));
                        } catch (error) {
                            console.log(`>> Continueing but still: error: ${error}`);
                        }

                        try {
                            const entityJsonPath = modulePath + "/entities/" + entityModel.id + ".json";
                            fs.writeFileSync(entityJsonPath, JSON.stringify(entityModel, null, 4));
                        } catch (error) {
                            console.log(`>> Continueing but still: error: ${error}`);
                        }

                        console.log("Written entity: " + getModule(entityModel).name + "/entities/" + entityModel.id + ".js / .json");
                    });
                }
            } catch (error) {
                console.log(`error: ${error}`);
            }

            try {
                for (i in microflowModels) {
                    await loadAsPromise(microflowModels[i]).then((microflowModel) => {

                        try {
                            const microflowPath = modulePath + "/microflows/" + microflowModel.name + ".js";
                            fs.writeFileSync(microflowPath, JavaScriptSerializer.serializeToJs(microflowModel));
                        } catch (error) {
                            console.log(`>> Continueing but still: error: ${error}`);
                        }

                        try {
                            const microflowJsonPath = modulePath + "/microflows/" + microflowModel.name + ".json";
                            fs.writeFileSync(microflowJsonPath, JSON.stringify(microflowModel, null, 4));
                        } catch (error) {
                            console.log(`>> Continueing but still: error: ${error}`);
                        }

                        console.log("Written microflow: " + getModule(microflowModel).name + "/microflow/" + microflowModel.name + ".js / .json");
                    });
                }
            } catch (error) {
                console.log(`error: ${error}`);
            }

            try {
                for (i in pageModels) {
                    await loadAsPromise(pageModels[i]).then((pageModel) => {

                        try {
                            const pagePath = modulePath + "/pages/" + pageModel.name + ".js";
                            fs.writeFileSync(pagePath, JavaScriptSerializer.serializeToJs(pageModel));
                        } catch (error) {
                            console.log(`>> Continueing but still: error: ${error}`);
                        }

                        try {
                            const pageJsonPath = modulePath + "/pages/" + pageModel.name + ".json";
                            fs.writeFileSync(pageJsonPath, JSON.stringify(pageModel, null, 4));
                        } catch (error) {
                            console.log(`>> Continueing but still: error: ${error}`);
                        }

                        console.log("Written page: " + getModule(pageModel).name + "/pages/" + pageModel.name + ".js / .json");
                    });
                }
            } catch (error) {
                console.log(`error: ${error}`);
            }

            try {
                for (i in layoutModels) {
                    await loadAsPromise(layoutModels[i]).then((layoutModel) => {

                        try {
                            const layoutPath = modulePath + "/layouts/" + layoutModel.name + ".js";
                            fs.writeFileSync(layoutPath, JavaScriptSerializer.serializeToJs(layoutModel));
                        } catch (error) {
                            console.log(`>> Continueing but still: error: ${error}`);
                        }

                        try {
                            const layoutJsonPath = modulePath + "/layouts/" + layoutModel.name + ".json";
                            fs.writeFileSync(layoutJsonPath, JSON.stringify(layoutModel, null, 4));
                        } catch (error) {
                            console.log(`>> Continueing but still: error: ${error}`);
                        }

                        console.log("Written layout: " + getModule(layoutModel).name + "/layouts/" + layoutModel.name + ".js / .json");
                    });
                }
            } catch (error) {
                console.log(`error: ${error}`);
            }

        });



        function getModule(element: IStructure): projects.Module {
            let current = element.unit;
            while (current) {
                if (current instanceof projects.Module) {
                    return current;
                }
                current = current.container;
            }
            // @ts-ignore
            return current;
        }
    }

}

export { MXModelSDK };