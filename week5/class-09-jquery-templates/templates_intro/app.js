var presidentObject = {
    presidents: [
        'Washington',
        'Adams',
        'Jefferson',
        'Madison',
        'Monroe',
        'Adams',
        'Jackson',
        'Van Buren',
        'Harrison',
        'Tyler',
        'Polk',
        'Taylor',
        'Fillmore',
        'Pierce',
        'Buchanan',
        'Lincoln',
        'Johnson',
        'Grant',
        'Hayes',
        'Garfield',
        'Arthur',
        'Cleveland',
        'Harrison',
        'Cleveland',
        'McKinley',
        'Roosevelt',
        'Taft',
        'Wilson',
        'Harding',
        'Coolidge',
        'Hoover',
        'Roosevelt',
        'Truman',
        'Eisenhower',
        'Kennedy',
        'Johnson',
        'Nixon',
        'Ford',
        'Carter',
        'Reagan',
        'Bush',
        'Clinton',
        'Bush',
        'Obama',
    ]
}

//HB needs to take in an object
var titleObj = {
    title: "Handlebar",
    description: "A HB Test",
    guys: presidentObject.presidents
};

//step 1: grab the handlebars HTML template
    var source = $('#title-template').html();
    
//step 2: compile the template using Handlebars.compile()
    var template = Handlebars.compile(source);
    // var titleObject = {
    //   title: 'Presidents',
    //   description: 'A JSD Project'
    // };

//step 3: pass compile the obj
    // var titleTemplate = template(titleObject);
    var titleTemplate = template(titleObj);

//step 4: append the obj(s) to the html element
    $('#handlebars-list').append(titleTemplate);



