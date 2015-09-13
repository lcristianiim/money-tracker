// options
var database = 'database.json';
var categories = 'categories.json';

var fs = require('fs');
var extfs = require('extfs');
var Box = require('cli-box');
var Table = require('le-table');

var obj = {};
var date = new Date();
var commit = {
    sum: process.argv[2],
    message: process.argv[3],
    ID: '',
    category: '',
    date: { day: '', month: '', year: '', hour: '', min: '', sec: '' }
};
var options = {
    firstArgv: process.argv[2],
    secondArgv: process.argv[3]
}

// display the current month
if (options.firstArgv === "month") {
    var currentMonth = date.getMonth() + 1;
    var currentYear = date.getFullYear();
    console.log(currentYear);
    var databaseObj = getObjFromFile(database);

    // displays an item from database if it is commited in the specified month
    displayMonthStatus(databaseObj, currentMonth, currentYear);
}

// commit item into database
if (!isNaN (commit.sum)) {
    // get date data
    commit.date.day = date.getDate();
    commit.date.month = date.getMonth() + 1;
    commit.date.year = date.getFullYear();
    commit.date.hour = date.getHours();
    commit.date.min = date.getMinutes();
    commit.date.sec = date.getSeconds();

    extfs.isEmpty(database, function (empty) {
        if (empty) {
            var temp = [
                {
                    "id": "0"
                }
            ];
            fs.writeFile(database, JSON.stringify(temp), function (err) {
                commitObj();
            });
        } else {
            commitObj();
        }
    })
}

// isEmptyObject
function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

// displays an item from database if it is commited in the specified month
function displayItemInMonth (item, month) {
    if (item.date.month == month) {
        console.log (item);
    }
}

// get object from a certain file
function getObjFromFile (file) {
    var newObj = JSON.parse(fs.readFileSync(file, 'utf8'));
    return newObj;
}

// commits the record
function commitObj () {
    obj = JSON.parse(fs.readFileSync(database, 'utf8'));
    // incrementing the global ID
    obj[0].id++;
    // obtaining ID
    commit.ID = obj[0].id;

    // get categories
    categoriesObj = JSON.parse(fs.readFileSync(categories, 'utf8'));
    displayCategories();

    // reading standard input from user for category
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    process.stdin.once('data', function (chunk) {

        chunk = chunk.replace(/(\r\n|\n|\r)/gm,"");
        commit.category = chunk;

        // preparing new obj
        obj[obj.length] = commit;

        // write the object to database
        fs.writeFile(database, JSON.stringify(obj), function (err) {
            displayConfirmation(commit.category);
        });
        process.stdin.destroy();
    });
};

// displays confirmation message
function displayConfirmation (category) {
    console.log('Record registered with category: ' + category);
    var data = [
        ['Sum', 'Message', 'Date'],
        [ commit.sum, commit.message, commit.date.day + '.' + commit.date.month + '.' + commit.date.year]
    ];
    var myTable = new Table();
    for (var i = 0; i < data.length; ++i) {
        myTable.addRow([i].concat(data[i]), {
            hAlign: i > 2 ? "right": "right"
        });
    }
    console.log(myTable.toString());
}

// displays the categories options to choose
function displayCategories () {
    var confirmMessage = "Choose category";
    var data = [
    ];
    for (var i = 0; i < categoriesObj.length; i++) {
       data[i] = categoriesObj[i];
    }
    var myTable = new Table();
    for (var i = 0; i < data.length; ++i) {
        myTable.addRow([i].concat(data[i]), {
            hAlign: i > 2 ? "right": "right"
        });
    }
    console.log(myTable.toString());
}

function displayMonthStatus (object, month, year) {
    var data = [
        ['Sum', 'Message', 'Date']
    ]
    var totalSum = 0;
    object.forEach(function (item) {
        if (item.date != undefined && item.date.month == month) {
            data.push([item.sum, item.message, item.date.day + '.' + item.date.month + '.' + item.date.year]);
            // Calculating the total spending for the mounth
            totalSum += parseInt(item.sum);
        }
    })
    var myTable = new Table();
    // Push data
    for (var i = 0; i < data.length; ++i) {
        myTable.addRow([i].concat(data[i]), {
            hAlign: i > 0 ? "left": "right"
        });
    }

    // Output table
    console.log(myTable.toString());

    // Displays the total of the month
    data = [
        ['Month', 'Year', 'TOTAL'],
        [month, year, totalSum]
    ]

    var myTable = new Table();
    for (var i = 0; i < data.length; ++i) {
        myTable.addRow([i].concat(data[i]), {
            hAlign: i > 2 ? "right": "right"
        });
    }
    console.log(myTable.toString());
}

// get the mounth income
function monthIncome () {
    var date = new Date();
}
