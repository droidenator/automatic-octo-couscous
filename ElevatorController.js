'use strict';

const Elevator = require('./Elevator');
const EventEmitter = require('events');

function ElevatorController({ floors, elevators }) {
  const my = {
    floors: null,
    emitter: null,
    elevators: null,
    requests: {},
  };

  const that = {
    callElevator,
  };

  function init() {
    my.floors = floors;
    my.elevators = elevators;
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
    const requestEvent = `request:${Date.now()}`;
    my.requests[requestEvent] = [];
    const eventHandler = handleElevatorRequestResponses(requestEvent);
    my.emitter.on(requestEvent, eventHandler);
    my.emitter.emit('requestElevator', {
      requestEvent,
      currentFloor,
      destinationFloor,
    });
    // Current or destination floor must be between 1 and max # of floors
    // Emit request for elevator to all elevators
    // Pick best elevator from responses
  }

  function handleElevatorRequestResponses(requestEvent) {
    return function handleResponse(response) {
      my.requests[requestEvent].push(response);
      // If not all elevators have responded, return and wait for more messages
      if (my.requests[requestEvent].length < my.elevators) return;

      my.emitter.removeListener(requestEvent);
    };
  }

  init();

  return that;
}

module.exports = ElevatorController;
