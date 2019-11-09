'use strict';

const ElevatorController = require('./ElevatorController');
const elevatorController = ElevatorController({ floors: 10, elevators: 5 });
elevatorController.callElevator(3, 1);
