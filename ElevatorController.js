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
    requestElevator,
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

  function requestElevator(currentFloor, destinationFloor) {
    try {
      assertFloorIsValid(currentFloor);
      assertFloorIsValid(destinationFloor);

      const requestEvent = `request:${Date.now()}`;
      my.requests[requestEvent] = [];
      const eventHandler = handleElevatorRequestResponses(requestEvent, {
        currentFloor,
        destinationFloor,
      });
      my.emitter.on(requestEvent, eventHandler);
      my.emitter.emit('requestElevator', {
        requestEvent,
        currentFloor,
        destinationFloor,
      });
    } catch (err) {
      console.error(err);
    }
  }

  function handleElevatorRequestResponses(requestEvent, tripRequest) {
    return function handleResponse(response) {
      my.requests[requestEvent].push(response);
      // If not all elevators have responded, return and wait for more messages
      if (my.requests[requestEvent].length < my.elevators) return;

      my.emitter.removeAllListeners(requestEvent);
      pickElevator(my.requests[requestEvent], tripRequest);
    };
  }

  function pickElevator(elevators, tripRequest) {
    const { currentFloor, destinationFloor } = tripRequest;

    const availableElevators = elevators.filter(elevator => elevator.avaible);
    const onCurrentFloor = elevators.filter(
      elevator =>
        elevator.available &&
        elevator.currentFloor === currentFloor &&
        !elevator.moving
    );

    if (onCurrentFloor.length) {
      callElevator(onCurrentFloor[0].id, tripRequest);
      return;
    }
  }

  function assertFloorIsValid(floor) {
    if (floor > my.floors || floor < 1)
      throw new Error(`Invalid Floor: ${floor}`);
  }

  function callElevator(id, tripRequest) {
    my.emitter.emit(`callElevator:${id}`, tripRequest);
  }

  init();

  return that;
}

module.exports = ElevatorController;
