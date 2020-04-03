//mysql config
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'hyfuser',
  password : 'hyfpassword',
  database : 'ammar_week2_database'
});

const queries = [
 //   Write a query that prints names of all `authors` and their corresponding `collaborators`
'SELECT a.author_name as Lead_author, b.author_name as Collaborator FROM authors a, authors b WHERE a.friend = b.author_no;',
// Write a query that prints all columns of `authors` and their pubished `research paper title`.
"SELECT author_name, paper_title FROM authors JOIN research_papers ON authors.author_no = research_papers.author_no;"
 ]

 for(var i in queries){
    console.log("Going to run ", queries[i]) 
    connection.query(queries[i], function (error, results, fields) {
        if (error) {
            throw error;
        }
        console.log("the reply is ", results);
    });
}


connection.end();

