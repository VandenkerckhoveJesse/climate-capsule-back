var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs/promises');
const fs2 = require('fs');
const bodyParser = require('body-parser');
router.use(bodyParser.json());
const filePath = path.join(__dirname, '..', 'data', 'stories.json');
/* GET users listing. */

const http = require('http');
const querystring = require('querystring');
const {json} = require("express");

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
        if (!story.location || !story.location.lat || !story.location.long) {
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


/**
 * @param city string
 * @returns {{lat, lng}}
 */
function getCoordinatesFromCity(city) {
    const apiKey = 'ba96c5fccf934a96b624f1b41879bbbd';
    const endpoint = `http://api.opencagedata.com/geocode/v1/json?q=${querystring.escape(city)}&key=${apiKey}`;
    return new Promise((resolve, reject) => {
        http.get(endpoint, (response) => {
            let rawData = '';

            response.on('data', (chunk) => {
                rawData += chunk;
            });

            response.on('end', () => {
                try {
                    const parsedData = JSON.parse(rawData);
                    const lat = parsedData.results[0].geometry.lat;
                    const lng = parsedData.results[0].geometry.lng;
                    const location = {
                        lat: lat,
                        lng: lng
                    };
                    //console.log(JSON.stringify(location));
                    resolve(JSON.stringify(location));
                } catch (e) {
                    console.log("did not find the coordinates with API");
                    reject(e.message);
                }
            });
        }).on('error', (e) => {
            console.error(e.message);
            throw new Error('Internal Server Error');
        });
    })

}

function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

function calculateDistanceBetween(l1, l2) {
    const earthRadiusKm = 6371;
    const dLat = degreesToRadians(l2.lat - l1.lat);
    const dLon = degreesToRadians(l2.long - l1.lng);

    const lat1 = degreesToRadians(l1.lat);
    const lat2 = degreesToRadians(l2.lat);

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return earthRadiusKm * c;
}

/**
 * pour chaque coordonnée, je dois comparer avec cityCoordonates et voir si la distance < radius
 * @param {number} radius
 * @param {{lat, lng}} cityCoordonates
 */
function isInRadius(radius, cityCoordonates, stories) {
    const jsonCityCoordonates = JSON.parse(cityCoordonates); //objet à comparer
    for (let i = 0; i < stories.length; i++) {

        const currentObject = stories[i];
        let allStoriesInRadius = [];
        if(calculateDistanceBetween(jsonCityCoordonates, currentObject.location) <= radius) {
            allStoriesInRadius.push(stories[i]);
        }
        console.log(allStoriesInRadius);
        return allStoriesInRadius;
    }
}

//ROUTES----------
router.get('/', async function(req, res, next) {
    const city = req.query.city;
    const radius = req.query.radius;
    if(city != null && city.length > 0 && radius != null && radius.length > 0) {
        //case that we have a get request
        const cityCoordinates= await getCoordinatesFromCity(city);
        const stories = JSON.parse(await getStories());
        isInRadius(radius, cityCoordinates, stories);
        res.send("did it");
    } else {
        //nothing
        res.setHeader("Content-Type", "application/json");
        res.send(await getStories());
    }
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
