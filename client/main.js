import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {Comments} from "../imports/api/comments.js";
// Import layout and loading templates statically as it will be used a lot

import '../imports/ui/home.js';
import '../imports/ui/home.html';
import '../imports/ui/ml.js';
import '../imports/ui/ml.html';


// Create index route
FlowRouter.route('/', {
  name: 'index',
  action() {
    this.render('home','home');
  }
});

// Create ml route
FlowRouter.route('/ml', {
  name: 'ml',
  action() {
    this.render('ml','ml');
  }
});

// Create ml route
FlowRouter.route('/ml-API', {
  name: 'ml-API',
  action() {
    return Comments.find({});
  }
});
