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
      console.error(err.message);
    }
  }

  function handleElevatorRequestResponses(requestEvent, tripRequest) {
    return function handleResponse(response) {
      my.requests[requestEvent].push(response);
      // If not all elevators have responded, return and wait for more messages
      if (my.requests[requestEvent].length < my.elevators) return;

      my.emitter.removeAllListeners(requestEvent);
      pickElevator(my.requests[requestEvent], { ...tripRequest, requestEvent });
    };
  }

  function pickElevator(elevators, tripRequest) {
    const { currentFloor, destinationFloor } = tripRequest;
    const direction = currentFloor < destinationFloor ? 'up' : 'down';
    const availableElevators = elevators.filter(elevator => elevator.available);
    const onCurrentFloor = availableElevators.filter(
      elevator => elevator.currentFloor === currentFloor && !elevator.moving
    );

    if (onCurrentFloor.length) {
      callElevator(onCurrentFloor[0].id, tripRequest);
      return;
    }

    // The logic past this point isn't solid. The way I'm requesting elevators in index.js causes some problems
    // That is, because I'm requesting the elevators as fast as I can but using setTimeout when moving elevators,
    // I end up in a weird state.
    return;

    const movingElevators = availableElevators.filter(
      elevator => elevator.moving && elevator.direction === direction
    );
    if (movingElevators.length) {
      const elevator = pickClosestElevator(movingElevators, currentFloor);
      callElevator(elevator.id, tripRequest);
      return;
    }

    const unoccupiedElevators = availableElevators.filter(
      elevator => !elevator.moving
    );
    const elevator = pickClosestElevator(unoccupiedElevators, currentFloor);

    callElevator(elevator.id, tripRequest);
  }

  // I didn't get much time to test this function
  function pickClosestElevator(elevators, floor) {
    return elevators.reduce((closest, elevator) => {
      if (
        !closest ||
        Math.abs(closest.currentFloor - floor) >
          Math.abs(elevator.currentFloor - floor)
      ) {
        return elevator;
      }
      return closest;
    }, null);
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
