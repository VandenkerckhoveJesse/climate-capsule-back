var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs/promises');
const fs2 = require('fs');
const bodyParser = require('body-parser');
router.use(bodyParser.json());

const filePath = path.join(__dirname, '..', 'data', 'stories.json');
/* GET users listing. */

/**
 * Returns an array of JSON objects.
 * @returns {string} An array of JSON objects.
 */
function getStories() {
    return fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            return;
        }
        const stories = JSON.parse(data);
        const listOfStories = [];
        stories.forEach(story => {
            listOfStories.push(story);
        });
        console.log(listOfStories);
        return JSON.stringify(listOfStories);
    });
}

/**
 * Validate if the object is a valid json story
 * @param {Object}story
 * @returns {boolean}
 */
function isValidJsonStory(story) {
    if (typeof story === 'object' && story !== null && !Array.isArray(story)) {
        if (!story.location || !story.location.lat || !story.location.lng) {
            console.log("location");
            return false;
        }
        if (!story.title || typeof story.title !== 'string' || !story.title.trim().length > 0) {
            console.log("title");
            return false;
        }
        if (!story.summary || typeof story.summary !== 'string' || !story.summary.trim().length > 0) {
            console.log("summary");
            return false;
        }
        if (!story.author || typeof story.author !== 'string' || !story.author.trim().length > 0) {
            console.log("author");
            return false;
        }
        if (!story.date || isNaN(Date.parse(story.date))) {
            console.log("date");
            //return false;
        }
        if (!story.book.pages || !Array.isArray(story.book.pages)) {
            console.log("pages");
            return false;
        } else {
            let invalidPageFound = false;
            for (let page of story.book.pages) {
                if (!page.type || typeof page.type !== 'string' || !page.content) {
                    // The page is missing a type or content field
                    invalidPageFound = true;
                    break;
                } else if (page.type === 'TEXT' && (typeof page.content !== 'string' || page.content.trim().length === 0)) {
                    // The text page is invalid
                    invalidPageFound = true;
                    break;
                } else if (page.type === 'IMAGE' && (typeof page.content !== 'string' || !/^https?:\/\/\S+$/.test(page.content))) {
                    // The image page is invalid
                    invalidPageFound = true;
                    break;
                }
            }
            if (invalidPageFound) {
                console.log("other");
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}
router.get('/', async function(req, res, next) {
    res.setHeader("Content-Type", "application/json");
    res.send(await getStories());
});

router.post('/', async function(req, res, next) {

    const story = req.body;
    //check if the json we received is valid
    if(!isValidJsonStory(story)) res.status(400).send('received an invalid json object');

    else {
        const stories = JSON.parse(await getStories());
        console.log(stories);
        stories.push(story);
        fs2.writeFileSync(filePath, JSON.stringify(stories));
        res.send('received a valid json object');
    }


});

module.exports = router;
