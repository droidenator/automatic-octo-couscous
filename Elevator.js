'use strict';

const MAX_TRIPS_BEFORE_MAITENANCE = 100;

function Elevator({ emitter, startingFloor = 1, elevatorId }) {
  const my = {
    currentDirection: null,
    currentFloor: null,
    doorOpen: null,
    elevatorId: null,
    emitter: null,
    trips: 0,
    floorsPassed: 0,
    passengers: [],
    requiresMaintenace: false,
  };

  const that = {};

  function init() {
    my.emitter = emitter;
    my.currentFloor = startingFloor;
    my.doorOpen = true;
    my.id = elevatorId;
    emitStatusUpdate(`Elevator ${my.id} created`);
    registerEventListeners();
  }

  function emitStatusUpdate(msg) {
    my.emitter.emit('elevatorStatusUpdate', msg);
  }

  function registerEventListeners() {
    my.emitter.on('requestElevator', elevatorRequest);
    my.emitter.on(`callElevator:${my.id}`, handleTrip);
  }

  function elevatorRequest({ requestEvent, currentFloor, destinationFloor }) {
    // This is an area that I would probably refactor heavily given more time to be sure
    // I'm getting the right data passed over.
    const response = {
      available: !my.requiresMaintenace,
      currentFloor: my.currentFloor,
      id: my.id,
      occupied: !!my.passengers.length,
      moving: !my.doorOpen,
      direction: my.direction,
    };
    my.emitter.emit(requestEvent, response);
  }

  async function handleTrip(tripRequest) {
    const { currentFloor, destinationFloor } = tripRequest;
    operateDoor(false);
    my.passengers.push(tripRequest);
    my.currentDirection = currentFloor < destinationFloor ? 'up' : 'down';

    // Towards the end of my 2 hours, it dawned on me that I should move to the new
    // floor and then let the moveToNewFloor function decide what to do next. This current
    // implementation works fine assuming there's a single passenger per elevator but breaks
    // down once an elevator picks up an additional passenger
    while (my.currentFloor !== destinationFloor) {
      await moveToNewFloor();
    }

    // Last minute hacking below
    operateDoor(true);
    my.passengers = [];
    my.currentDirection = null;
    my.trips++;
    if (my.trips === 100) my.requiresMaintenace = true;
  }

  function moveToNewFloor() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        my.currentFloor =
          my.currentDirection === 'up'
            ? my.currentFloor + 1
            : my.currentFloor - 1;
        my.floorsPassed = my.floorsPassed + 1;
        emitStatusUpdate(`Elevator ${my.id} moved to floor ${my.currentFloor}`);
        resolve();
      }, 100);
    });
  }

  function operateDoor(open) {
    my.doorOpen = open;
    emitStatusUpdate(`Elevator ${my.id} ${open ? 'opening' : 'closing'} doors`);
  }

  init();

  return that;
}

module.exports = Elevator;
