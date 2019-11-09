'use strict';

const MAX_TRIPS_BEFORE_MAITENANCE = 100;

function Elevator({ emitter, startingFloor = 1, elevatorId }) {
  const my = {
    currentFloor: null,
    doorOpen: null,
    elevatorId: null,
    emitter: null,
    trips: 0,
    floorsPassed: 0,
  };

  const that = {
    callElevator,
  };

  function init() {
    my.emitter = emitter;
    my.currentFloor = startingFloor;
    my.doorOpen = true;
    my.elevatorId = elevatorId;
    my.emitter.emit('elevatorInit', { id: my.elevatorId });
  }

  function registerEventListeners() {
    my.emitter.on('requestElevator', elevatorRequest);
  }

  function elevatorRequest() {}

  function moveToFloor(direction) {}

  function operateDoor(open) {}

  init();

  return that;
}

module.exports = Elevator;
