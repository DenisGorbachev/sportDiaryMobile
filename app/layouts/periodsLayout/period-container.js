import React from 'react';
import Period from './period.js';
import Meteor, { createContainer } from 'react-native-meteor';

export default createContainer(({ _id, startsAt, endsAt, exercises })=> {
  const trainingsHandle = Meteor.subscribe('trainingsByPeriodId', _id);
  const Trainings = Meteor.collection('trainings');
  const trainings = trainingsHandle.ready() ? Trainings.find({}) : []
  return {
    _id,
    startsAt,
    endsAt,
    exercises,
    trainings,
  }
}, Period);
