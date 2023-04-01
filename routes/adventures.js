var GraphHopperRouting = require("graphhopper-js-api-client/src/GraphHopperRouting")
var GHInput = require('graphhopper-js-api-client/src/GHInput')
var express = require('express');
var router = express.Router();


const graphHopperAPIKey = '46867b44-2a2f-40e1-8b23-f9d4190750c4'
const ghRouting = new GraphHopperRouting({
        key: graphHopperAPIKey,
        vechile: 'foot'
    })

/* Start a new adventure. */
router.get('/new', function(req, res, next) {
    var storiesString = "[{\"location\":{\"lat\":51.209419,\"lng\":3.225200},\"title\":\"Alfred The Grandfather's tree story\",\"summary\":\"The story about my grandfathers trees, he loved trees.\",\"author\":\"Alfred The Grandfather\",\"date\":\"1992-04-0T00:00:00.000Z\",\"book\":{\"pages\":[{\"type\":\"TEXT\",\"content\":\"As a grandfather i remember there were trees. Now all i trees i see are pink instead of green.\"},{\"type\":\"IMAGE\",\"content\":\"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.phillymag.com%2Fnews%2F2020%2F09%2F12%2Fliving-near-grandparents%2F&psig=AOvVaw3b3F2i5p0_lJWWnM3Bjtld&ust=1680425415936000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCPDsmdKmiP4CFQAAAAAdAAAAABAJ\"}]}},{\"location\":{\"lat\":51.235052,\"lng\":3.267495},\"title\":\"Alfred The Grandfather's tree story\",\"summary\":\"The story about my grandfathers trees, he loved trees.\",\"author\":\"Alfred The Grandfather\",\"date\":\"1992-04-0T00:00:00.000Z\",\"book\":{\"pages\":[{\"type\":\"TEXT\",\"content\":\"As a grandfather i remember there were trees. Now all i trees i see are pink instead of green.\"},{\"type\":\"IMAGE\",\"content\":\"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.phillymag.com%2Fnews%2F2020%2F09%2F12%2Fliving-near-grandparents%2F&psig=AOvVaw3b3F2i5p0_lJWWnM3Bjtld&ust=1680425415936000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCPDsmdKmiP4CFQAAAAAdAAAAABAJ\"}]}},{\"location\":{\"lat\":51.218282,\"lng\":3.275397},\"title\":\"Alfred The Grandfather's tree story\",\"summary\":\"The story about my grandfathers trees, he loved trees.\",\"author\":\"Alfred The Grandfather\",\"date\":\"1992-04-0T00:00:00.000Z\",\"book\":{\"pages\":[{\"type\":\"TEXT\",\"content\":\"As a grandfather i remember there were trees. Now all i trees i see are pink instead of green.\"},{\"type\":\"IMAGE\",\"content\":\"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.phillymag.com%2Fnews%2F2020%2F09%2F12%2Fliving-near-grandparents%2F&psig=AOvVaw3b3F2i5p0_lJWWnM3Bjtld&ust=1680425415936000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCPDsmdKmiP4CFQAAAAAdAAAAABAJ\"}]}},{\"location\":{\"lat\":51.210540,\"lng\":3.279520},\"title\":\"Alfred The Grandfather's tree story\",\"summary\":\"The story about my grandfathers trees, he loved trees.\",\"author\":\"Alfred The Grandfather\",\"date\":\"1992-04-0T00:00:00.000Z\",\"book\":{\"pages\":[{\"type\":\"TEXT\",\"content\":\"As a grandfather i remember there were trees. Now all i trees i see are pink instead of green.\"},{\"type\":\"IMAGE\",\"content\":\"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.phillymag.com%2Fnews%2F2020%2F09%2F12%2Fliving-near-grandparents%2F&psig=AOvVaw3b3F2i5p0_lJWWnM3Bjtld&ust=1680425415936000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCPDsmdKmiP4CFQAAAAAdAAAAABAJ\"}]}},{\"location\":{\"lat\":51.205378,\"lng\":3.270244},\"title\":\"Alfred The Grandfather's tree story\",\"summary\":\"The story about my grandfathers trees, he loved trees.\",\"author\":\"Alfred The Grandfather\",\"date\":\"1992-04-0T00:00:00.000Z\",\"book\":{\"pages\":[{\"type\":\"TEXT\",\"content\":\"As a grandfather i remember there were trees. Now all i trees i see are pink instead of green.\"},{\"type\":\"IMAGE\",\"content\":\"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.phillymag.com%2Fnews%2F2020%2F09%2F12%2Fliving-near-grandparents%2F&psig=AOvVaw3b3F2i5p0_lJWWnM3Bjtld&ust=1680425415936000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCPDsmdKmiP4CFQAAAAAdAAAAABAJ\"}]}}]";
    var stories = JSON.parse(storiesString)

    var points = stories.map(story => [story.location.lng, story.location.lat])

    console.log(points)
    ghRouting.doRequest({points:points})
    .then(function(json) {
        let coordinates = json.paths[0].points.coordinates
        let parsedCoordinates = coordinates.map(coordinate => {return {lat: coordinate[1], lng : coordinate[0]}})
        res.send({location : {lat: 0, lng: 0}, stories: stories, path: {coordinates: parsedCoordinates}})
    })
    .catch(function(err) {
        console.error(err.message)
    })
})

module.exports = router;