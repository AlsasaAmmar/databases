
// 3. Read exercises 3 and 4 and then add information (insert rows) of 15 authors and 30 research papers such that
// all queries in the exercises  3 and 4 will return some answers

/*/////--------------notes
-
 to avoid writing the date myself I used some packages that produces random data :)
 -
 ----------------------------------------////////*/
// 1. Create another table, called `Research_Papers` with the following fields: 
// `(paper_id, paper_title, conference, publish_date, ...)`

// Generates random dates
let DateGenerator = require('random-date-generator');

// Generates random unique names
const { uniqueNamesGenerator, adjectives, colors, animals } = require('unique-names-generator');
var generate = require('project-name-generator');

//Values for the author table 
const universities = ['Oxford', 'VU', 'UVA', 'Damascus','Cambridge', 'MIT']; 
const gender = ['m', 'f', 'non'];

// Generates a random value from an array 
function randomValueFromArr (arr){
    const randomNum = Math.floor(Math.random() * arr.length );
    return arr[randomNum]
}

// Generates random animal
function getFunkyAnimal() {
    const randomAnimal = uniqueNamesGenerator({ dictionaries: [adjectives, colors, animals] }); // big_red_donkey
    return randomAnimal.replace(/_/g, " ");
}

//Generates Random dates 
function generateRandomDate(date1, date2){
    DateGenerator.getRandomDate(); // random date
    let startDate = new Date(date1, 1, 1);
    let endDate = new Date(date2, 3, 3);
    let randDate = DateGenerator.getRandomDateInRange(startDate, endDate);
    let formatted_date = randDate.getFullYear() + "-" + (randDate.getMonth() + 1) + "-" + randDate.getDate();
    return formatted_date
}

//Generates Random queries for the Author Table 
const generateRandomAuthors = (numOfAuthors)=> {
    const randomAuthors = [];
    for (let i = 0; i < numOfAuthors; i++) {
        randomAuthors.push( `insert into Authors
        (author_name, university, date_of_birth, h_index, gender, friend)
         values
          ('${generate().spaced}',
           '${randomValueFromArr(universities)}', 
           '${generateRandomDate(1950, 1980)}',
            ${100 + i }, 
            '${randomValueFromArr(gender)}',
            ${Math.ceil(Math.random()*numOfAuthors)})` );
    }
    return randomAuthors
}

//Generates random queries for research paper table
const generateRandomPapers = (numOfEnteries)=> {
    const randomPapers = [];
    for (let i = 0; i < numOfEnteries; i++) {
        randomPapers.push( `insert into Research_Papers
        (paper_title, conference, publish_date, author_no)
         values
          ('Research on ${getFunkyAnimal()}',
           '${randomValueFromArr(universities)}', 
           '${generateRandomDate(2000,2018)}',
           '${Math.ceil(Math.random()*15)}')` );
    }
    return randomPapers
}

//mysql config
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'hyfuser',
  password : 'hyfpassword',
  database : 'ammar_week2_database'
});

//MySQL queries 
let insert_queries_research_papers = generateRandomPapers(30); 
let insert_queries_authors = generateRandomAuthors(15);

const create_table_Research_Papers = 
`create table Research_Papers (
    paper_id int NOT NULL AUTO_INCREMENT, 
    paper_title varchar(50),
    conference varchar(50),
    publish_date date,
    author_no int ,
    PRIMARY KEY(paper_id),
    CONSTRAINT author_no FOREIGN KEY (author_no)REFERENCES authors(author_no) )` ;

// 2. What is the relationship between Authors and Research papers ? Make necessary changes to `Authors` and
// `Research_Papers` tables and add more tables if necessary.
// The relationship is many to many this is why I am creating another table.
const create_table_Research_Papers_authors = 
`CREATE TABLE research_papers_authors
    (author_no int,
    paper_id int,
    CONSTRAINT FK_author_no FOREIGN KEY (author_no) REFERENCES authors(author_no),
    CONSTRAINT FK_paper_id FOREIGN KEY (paper_id) REFERENCES research_papers(paper_id));`


const insert_into_cross_table = `
insert into research_papers_authors (paper_id, author_no) select paper_id, author_no from research_papers;`


//mysql functions 
connection.connect();

//Creates table Research papers
connection.query( create_table_Research_Papers, function (error, result, fields) {
        if (error) {
            throw error;
        }
        console.log(`The reply is`, result);
    })

//Creates table Research papers and authors 
connection.query( create_table_Research_Papers_authors, function (error, result, fields) {
    if (error) {
        throw error;
    }
    console.log(`The reply is`, result);
})


//inserts info into authors
for(var i in insert_queries_authors){
    console.log("Going to run ", insert_queries_authors[i]) // [] subscript operator : Of 
    connection.query(insert_queries_authors[i], function (error, results, fields) {
        if (error) {
            throw error;
        }
        console.log("the reply is ", results[0]);
    });
}

//inserts info into research papers 
for(var i in insert_queries_research_papers){
    console.log("Going to run ", insert_queries_research_papers[i]) // [] subscript operator : Of 
    connection.query(insert_queries_research_papers[i], function (error, results, fields) {
        if (error) {
            throw error;
        }
        console.log("the reply is ", results[0]);
    });
}

//inserts info into research papers authors cross table 

connection.query( insert_into_cross_table, function (error, result, fields) {
    if (error) {
        throw error;
    }
    console.log(`The reply is`, result);
})
 connection.end();


