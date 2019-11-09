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
    passengers: [],
    requireMaintenace: false,
  };

  const that = {};

  function init() {
    my.emitter = emitter;
    my.currentFloor = startingFloor;
    my.doorOpen = true;
    my.elevatorId = elevatorId;
    emitStatusUpdate(`Elevator ${my.elevatorId} created`);
    registerEventListeners();
  }

  function emitStatusUpdate(msg) {
    my.emitter.emit('elevatorStatusUpdate', msg);
  }

  function registerEventListeners() {
    my.emitter.on('requestElevator', elevatorRequest);
    my.emitter.on(`callElevator:${my.elevatorId}`, handleTrip);
  }

  function elevatorRequest({ requestEvent, currentFloor, destinationFloor }) {
    const response = {
      available: !my.requireMaintenace,
      id: my.elevatorId,
      occupied: !!my.passengers.length,
      moving: !my.doorOpen,
    };
    my.emitter.emit(requestEvent, response);
  }

  function handleTrip() {}

  function moveToFloor(direction) {
    my.currentFloor =
      direction === 'up' ? my.currentFloor + 1 : my.currentFloor - 1;
    my.floorsPassed = my.floorsPassed + 1;
    emitStatusUpdate(`Elevator ${id} moved to floor ${my.currentFloor}`);
  }

  function operateDoor(open) {}

  init();

  return that;
}

module.exports = Elevator;
