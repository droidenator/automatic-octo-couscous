'use strict';

const ElevatorController = require('./ElevatorController');
const elevatorController = ElevatorController({ floors: 10, elevators: 5 });
elevatorController.requestElevator(3, 1);
elevatorController.requestElevator(1, 3);
elevatorController.requestElevator(1, 13);
elevatorController.requestElevator(11, 3);
