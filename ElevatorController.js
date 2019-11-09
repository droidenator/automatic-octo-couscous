'use strict';

const Elevator = require('./Elevator');
const EventEmitter = require('events');

function ElevatorController({ floors, elevators }) {
  const my = {
    floors: null,
    emitter: null,
    elevators: [],
    requests: {},
  };

  const that = {
    callElevator,
  };

  function init() {
    my.floors = floors;
    my.emitter = new EventEmitter();
    registerEventListeners();

    for (let i = 0; i < elevators; i++) {
      Elevator({ emitter: my.emitter, elevatorId: i });
    }
  }

  function registerEventListeners() {
    my.emitter.on('elevatorStatusUpdate', msg => console.log(msg));
  }

  function callElevator(currentFloor, destinationFloor) {
    const requestId = Date.now();
    my.requests[requestId] = [];

    my.emitter.emit('requestElevator', { currentFloor, destinationFloor });
    // Current or destination floor must be between 1 and max # of floors
    // Emit request for elevator to all elevators
    // Pick best elevator from responses
  }

  init();

  return that;
}

module.exports = ElevatorController;
