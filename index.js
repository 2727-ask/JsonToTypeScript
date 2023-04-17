let interfaces = [];
let mymodule = {};
function jsonToTs(data, mymodule, iName) {
    try {
        let json = JSON.parse(data);
        for (let key in json) {
            let value = json[key];
            if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
                mymodule[key] = typeof value;
            } else if (typeof value === 'object') {
                console.log("Object");
                if (Array.isArray(value) && value.length > 0) {
                    let elmType = typeof value[0];
                    if (elmType === 'object' && !Array.isArray(value[0])) {
                        if (arrayOFObjectComparator(value)) {
                            console.log("Success");
                            mymodule[key] = key.charAt(0).toUpperCase() + key.slice(1) + "[]";
                            jsonToTs(JSON.stringify(value[0]), {}, key)

                        } else {
                            mymodule[key] = "any[]";
                        }
                    } else {
                        for (let x in value) {
                            if (typeof x != elmType) {
                                mymodule[key] = "any[]";
                            } else {
                                mymodule[key] = typeof x + "[]";
                            }
                        }
                    }

                } else {
                    console.log("Object Found");
                    console.log(value);
                    mymodule[key] = key.charAt(0).toUpperCase() + key.slice(1);
                    var obj = JSON.stringify(value);
                    var newModule = {}
                    jsonToTs(obj, newModule, key)
                }
            }

        }
        var temp = {}
        temp[iName] = mymodule;
        interfaces.push(temp);
    } catch (error) {
        console.log("Error found", error);
    }
}



// let data = `{
//     "name": "Ashutosh",
//     "id": 2020,
//     "isVerified": true,
//     "contacts": [
//         "9822519373",
//         "8766834856"
//     ],
//     "address": [{
//         "streetAddress": "West Central Street Suite",
//         "zip": "411046",
//         "state": "MH"
//     },
//     {
//         "streetAddress": "West Central Street Suite",
//         "zip": "411046",
//         "state": "MH"
//     }],
//     "card":{
//         "name": "Visa",
//         "bankDetails":{
//             "name":"HDFC BANK",
//             "ifsc":"HDFCINBB",
//             "pin":1234
//         },
//         "id": 123445677888
//     }
// }`


let outputInterfaces = [];


function convertJsonToTs(dataBlob, parentInterfaceName) {
    interfaces = []
    outputInterfaces = [];
    mymodule = {};
    if (dataBlob != null && dataBlob != undefined) {
        jsonToTs(dataBlob, mymodule, parentInterfaceName);
        interfaces.forEach((element, index, array) => {
            console.log("Element is", element);
            for (let mainKey in element) {
                convertObjectToInterface(element, mainKey);
            }
        });
    }
    console.log("Output Iterface is", outputInterfaces);
    return outputInterfaces;
}

let interfaceModule;
function convertObjectToInterface(object, interfaceName) {
    interfaceModule = "interface " + interfaceName.charAt(0).toUpperCase() + interfaceName.slice(1) + "{\n";
    for (let key in object) {
        console.log(object[key]);
        for (let inKey in object[key]) {
            interfaceModule += "\t" + inKey + ":" + object[key][inKey] + ";\n";
        }
    }
    interfaceModule += "}\n";
    outputInterfaces.push(interfaceModule);
    console.log(interfaceModule);
}


function arrayOFObjectComparator(arr) {
    let parentObj = arr[0];
    let isOk = true;
    for (let i = 1; i < arr.length; i++) {
        for (let paramKey in parentObj) {
            if (arr[i][paramKey] == undefined) {
                isOk = false;
            }
        }
    }
    return isOk;
}