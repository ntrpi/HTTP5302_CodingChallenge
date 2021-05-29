// Image urls
// http://sandbox.bittsdevelopment.com/code1/employeepics/1.jpg

// API endpoint constants.
const apiPrefix = "http://sandbox.bittsdevelopment.com/code1/";
const allEmployees = "fetchemployees.php";
const allRoles = "fetchroles.php";
const rolesPrefix = "/?roles=";
const employeePicsPrefix = apiPrefix + "employeepics/";
const employeePicExt = ".jpg";

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

window.onload = function () {

    // Get template element from DOM.
    let template = document.getElementsByTagName( "template" )[0];

    // Get the div we want to fill out.
    let panelTemplate = template.content.querySelector( "div" );

    // Get the dive we want to put the panels in.
    let panelsDiv = document.getElementById( "panelsDiv" );

    // Do a GET request to get all the employees.
    getAllEmployees( function( text ) {

        // Convert the response to a JS object.
        const employees = JSON.parse( text );

        // Iterate over the employees.
        for( key in employees ) {

            // Create a local var.
            let employee = employees[key];

            // Create a copy of the template element div.
            let panel = document.importNode( panelTemplate, true );

            // Get all the child elements of the panel and iterate over them.
            let children = panel.childNodes;
            for( let i = 0; i < children.length; i++ ) {

                // Create a local var.
                let element = children[i];

                // The template at this point is very simple, with each 
                // element identifiable by its only class name. From a 
                // scalability perspective, this is a bit limited but 
                // will suffice for now.
                switch( element.className ) {

                    case "crown":
                        // Only show the crown if the employee is featured.
                        if( employee.employeeisfeatured != 1 ) {
                            element.innerHTML = "";
                        }
                        break;

                    case "img-circle-crop":
                        // We can only show the image if there is one.
                        if( !employee.employeehaspic ) {
                            break;
                        }
                        // There is currently only one child img element.
                        let image = element.getElementsByTagName( "img" )[0];

                        // Set the source of the image and the alternative text.
                        image.src = employeePicsPrefix + employee.employeeid + employeePicExt;
                        image.alt = "Headshot of " + employee.employeefname + " " + employee.employeelname;
                        break;

                    case "name":
                        // Set the text content of the name div to have 
                        // the employee's first and last names.
                        element.textContent = employee.employeefname + " " + employee.employeelname;
                        break;

                    case "bio-div":
                        // At this point there is only one p child element.
                        let bio = element.getElementsByTagName( "p" )[0];

                        // Set the text content of the bio paragraph to the employee's bio.
                        bio.textContent = employee.employeebio;
                        break;

                    case "roles-div":
                        // Iterate over the employee's roles.
                        for( let j = 0; j < employee.roles.length; j++ ) {

                            // Create a local variable.
                            let role = employee.roles[j];

                            // One of the colour provided for the roles 
                            // is white, which doesn't work for this mockup.
                            // Switch it to grey instead.
                            let roleColour = role.rolecolor == "#FDFFF7" ? "gray" : role.rolecolor;

                            // Create a child element for the role using
                            // the innerHTML property.
                            element.innerHTML += `<div class="role" style="background-color: ${roleColour}">${role.rolename}</div>`;
                        }
                        break;
                }
            }
            panelsDiv.appendChild( panel );
        }
    } );
};

