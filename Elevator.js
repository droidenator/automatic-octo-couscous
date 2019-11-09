'use strict';

const MAX_TRIPS_BEFORE_MAITENANCE = 100;

function Elevator({ emitter, startingFloor, elevatorId }) {
  const my = {
    currentFloor: null,
    doorOpen: null,
    elevatorId: null,
    emitter: null,
    trips: 0,
    floorsPassed: 0,
  };

  const that = {};

  function init() {
    my.emitter = emitter;
    my.currentFloor = startingFloor;
    my.doorOpen = true;
    my.elevatorId = elevatorId;
    my.emitter.emit('elevatorInit', { id: my.elevatorId });
  }

  function callElevator(currentFloor, destinationFloor) {
    // Current or destination floor must be between 1 and max # of floors
    // Emit request for elevator to all elevators
    // Pick best elevator from responses
  }

  function moveToFloor(direction) {}

  function operateDoor(open) {}
}

module.exports = Elevator;
