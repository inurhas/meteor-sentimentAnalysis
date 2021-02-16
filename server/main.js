import { Meteor } from 'meteor/meteor';
import { JsonRoutes } from 'meteor/simple:json-routes';
import {Comments} from "../imports/api/comments.js";

Meteor.startup(() => {
  // code to run on server at startup
  JsonRoutes.add("get", "/ml-API", function (req, res) {
    var data = Comments.find({}).fetch();
    JsonRoutes.sendResult(res, {
      data: data
    });
  });
});
