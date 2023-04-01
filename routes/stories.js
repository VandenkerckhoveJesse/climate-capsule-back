var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs');

const filePath = path.join(__dirname, '..', 'data', 'stories.json');
/* GET users listing. */
router.get('/', function(req, res, next) {

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        const listOfStories = [];
        const stories = JSON.parse(data);
        stories.forEach(story => {
            listOfStories.push(story);
        });
        console.log(listOfStories);
        var json =  JSON.stringify(listOfStories);
        res.setHeader("Content-Type", "application/json");
        res.send(json);
    });
});


module.exports = router;
