// Image urls
// http://sandbox.bittsdevelopment.com/code1/employeepics/1.jpg

// API endpoint constants.
const apiPrefix = "http://sandbox.bittsdevelopment.com/code1/";
const allEmployees = "fetchemployees.php";
const allRoles = "fetchroles.php";
const rolesPrefix = "/?roles=";
const employeeImages = "employeepics/";
const employeeImageExt = ".jpg";

// Code inspired by https://www.w3schools.com/xml/xml_http.asp on 2021/05/12
// Do an asyncronous GET request to the given url. On a successful response,
// call the given onSuccess callback and pass it the response text.
// url: the url of the GET request
// onSuccess: the function to call after the request was performed successful. Takes the response text as a parameter.
function doGetAsync( url, onSuccess )
{
    let xmlHttp = new XMLHttpRequest();
    let isAsync = true;
    xmlHttp.onreadystatechange = function() { 
        if( xmlHttp.readyState == 4 && xmlHttp.status == 200 ) {
            onSuccess( xmlHttp.responseText );
        }
    }
    xmlHttp.open( "GET", url, isAsync ); 
    xmlHttp.send( null );
}

// Syntactic sugar.
function getAllEmployees( onSuccess )
{
    doGetAsync( apiPrefix + allEmployees, onSuccess );
}

// Syntactic sugar.
function getAllRoles( onSuccess )
{
    doGetAsync( apiPrefix + allRoles, onSuccess );
}

// Syntactic sugar.
function getEmployeesWithRole( role, onSuccess )
{
    doGetAsync( apiPrefix + allEmployees + rolesPrefix + role, onSuccess );
}

// Syntactic sugar.
// roles: an array of role IDs
function getEmployeesWithRole( roles, onSuccess )
{
    let url = apiPrefix + allEmployees + rolesPrefix;
    for( let i = 0; i < roles.length; i++ ) {
        url += roles[i] + i != roles.length -1 ? "," : "";
    }
    doGetAsync( url, onSuccess );
}

// JSON response structure:
// employees:
// [
//     {
//         employeeid: 1,
//         employeefname: "name",
//         employeelname: "name",
//         employeebio: "bio",
//         employeehaspic: 1,
//         employeeisfeatured: 0/1,
//         roles: [
//             {
//                 roleid: 1,
//                 rolecolor: "#ffffff",
//                 rolename: "name"
//             }
//         ]
//     }
// ]
// roles:
// [
//     {
//         roleid: 1,
//         rolecolor: "#ffffff",
//         rolename: "name"
//     },
//     {
//         roleid: 1,
//         rolecolor: "#ffffff",
//         rolename: "name"
//     }, ...
// ]

function log( text )
{
    const response = JSON.parse( text );
    for( const key in response ) {
        const keyVal = response[key]
        console.log( `${key}: ${keyVal}`);
    }
}

window.onload = function () {

    // getAllEmployees( log );
    getAllRoles( log );
};