import { Template } from 'meteor/templating';
import { Session } from 'meteor/session'
import { ReactiveVar } from 'meteor/reactive-var'

import Chart from 'chart.js';
import Sentiment from 'sentiment';


import {Comments} from "../api/comments.js";

import './ml.html';

Template.ml.helpers({
  comments () {
    return Comments.find({}).fetch().reverse();
  }
});

Template.ml.events({
  'click .add, keyup'(event) {
      function addComment(){
        const sentiment = new Sentiment();
        let sentimentScore = sentiment.analyze(document.getElementById('text').value).score;
        let sentimentResult = (sentimentScore >=1) ? "positive": (sentimentScore <=-1) ? "negative": "neutral";
        Comments.insert({
          text: document.getElementById('text').value,
          sentiment: sentimentResult,
        })
       document.getElementById('text').value = ""
      }
      let userText = document.getElementById('text').value.replace(/^\s+/, '').replace(/\s+$/, '');
      if ((event.type == "keyup" && event.which == 13 && userText != "") || (event.type == "click" && userText != ""))  {
         addComment();
         event.stopPropagation();
         return false;
      }
    },

  'click .delete'(event) {
      // let target = event.currentTarget;
      // let parentTarget = target.parentElement.parentElement;
      // parentTarget.classList.add("scale-transition","scale-out");
      // let idComment = this._id;
      // setTimeout(function(){Comments.remove(this._id);}, 300);
      Comments.remove(this._id);
    },
});

Template.ml.onRendered(function () {
  this.myBarChart = null
  this.autorun(() => {
  if(this.myBarChart) {
   this.myBarChart.destroy();
  }
  this.myBarChart = new Chart(document.getElementById("myChart"), {
      type: 'doughnut',
      data: {
            labels: [
              "Positive",
              "Negative",
              "Neutral"
            ],
            datasets: [{
              data: [(Comments.find({"sentiment":"positive"}).count()/Comments.find().count())*100,
                     (Comments.find({"sentiment":"negative"}).count()/Comments.find().count())*100,
                     (Comments.find({"sentiment":"neutral"}).count()/Comments.find().count())*100],
              backgroundColor: [
                "#36A2EB",
                "#FF6384",
                "#FFCE56"
              ],
              hoverBackgroundColor: [
                "#36A2EB",
                "#FF6384",
                "#FFCE56"
              ]
            }]
          },
      options: {
        responsive: false,
        tooltips: {
          callbacks: {
            label: function(tooltipItem, data) {
              return data['labels'][tooltipItem['index']] + ': ' + data['datasets'][0]['data'][tooltipItem['index']] + '%';
            }
          }
        }
      }
    });
  });
});

Template.ml.onCreated(function(){
  let handle= Comments.find({}).observeChanges({
    added:function(id,doc){
      console.log("new")
    }
  });
});
