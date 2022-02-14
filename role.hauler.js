var roleHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(!creep.memory.withdraw && creep.carry.energy == 0) {
            creep.memory.withdraw = true;
            creep.say("Withdraw");
        } else if (creep.memory.withdraw && creep.carry.energy == creep.carryCapacity) {
            creep.memory.withdraw = false;
            creep.say("Deposit");
        }

        if(creep.memory.withdraw) {
            // console.log(creep.room.find(RESOURCE_ENERGY))
            // console.log("en train de withdraw");
            var dropped_energy = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES)
            if(dropped_energy) {
              if(creep.pickup(dropped_energy) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(dropped_energy, {visualizePathStyle: {stroke: '#ffffff'}});
              }
            } else {
              var containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
                filter: (i) => {
                  return (i.structureType == STRUCTURE_CONTAINER &&
                    i.store[RESOURCE_ENERGY] > 0)}});

                    var containerWithEnergy = containersWithEnergy[0];
                    for(var i in containersWithEnergy) {
                      container = containersWithEnergy[i];
                      // console.log(container);
                      if(container.store[RESOURCE_ENERGY] > containerWithEnergy.store[RESOURCE_ENERGY]) {
                        containerWithEnergy = container;
                      }
                    }

                    if(containerWithEnergy) {
                      if(creep.withdraw(containerWithEnergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(containerWithEnergy, {visualizePathStyle: {stroke: '#ffffff'}});
                      }
                    } else if(creep.terminal) {
                      if(creep.room.terminal.store[RESOURCE_ENERGY] > 1000 & creep.room.controller.level < 8) {
                        if(creep.withdraw(creep.room.terminal, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        creep.moveTo(creep.room.terminal, {visualizePathStyle: {stroke: '#ffffff'}});
                      }
                    } else {
                      var storage = creep.room.storage;
                      // if(false) {
                        if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                          creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});

                          // }
                        } else {
                          creep.moveTo(Game.spawns[creep.room]);
                        }
                      }

            }
        } else if(!creep.memory.withdraw) {
            // console.log("commence ");
            var structureToRefill = creep.pos.findClosestByPath(creep.room.find(FIND_STRUCTURES, {
                filter: (i) => {
                    return ((i.structureType == STRUCTURE_EXTENSION | i.structureType == STRUCTURE_SPAWN) &&
                            i.energy < i.energyCapacity)}}));

            if(!structureToRefill) {
                structureToRefill = creep.room.find(FIND_STRUCTURES, {
                filter: (i) => {
                    return (i.structureType == STRUCTURE_POWER_SPAWN && i.energy < i.energyCapacity)}})[0];
            }

            if(!structureToRefill) {
                structureToRefill = creep.pos.findClosestByPath(creep.room.find(FIND_STRUCTURES, {
                filter: (i) => {
                    return (i.structureType == STRUCTURE_STORAGE && i.store[RESOURCE_ENERGY] < i.storeCapacity && (creep.room.controller.level < 8 || i.store[RESOURCE_ENERGY] < 300000))}}));
                // console.log('test ' + structureToRefill);
            }

            if(!structureToRefill) {
                structureToRefill =  creep.room.terminal;
            }

            if(structureToRefill && creep.carry.energy > 0) {
                if(creep.transfer(structureToRefill, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structureToRefill, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                creep.memory.withdraw = true;
            }
        }
    },

    //code pour initialiser de facon personnelle la memoire
    initMemory: function(room, argus) {
        var creepName = argus["creepName"]
        console.log(room)

        //init de la memoire
        room.memory.workers["haulers"].push(creepName);
        room.memory.workers["workers"].push(creepName);

        // creation du dicMem
        return {room:argus["room"], roomName:argus["roomName"], role:argus["role"]};
    },

    // code pour clean la memoire
    cleanMem: function(creep, name) {
      var creep_role = creep.role;
      console.log("Death of a:", creep.role, ", named:", name, ", in room:", creep.room);
      try {
          var creep_room = Game.rooms[creep.roomName];
          if (creep_room.memory.workers["haulers"].includes(name)) {
              creep_room.memory.workers["haulers"].splice(creep_room.memory.workers["haulers"].indexOf(name),1);
              creep_room.memory.workers["workers"].splice(creep_room.memory.workers["workers"].indexOf(name),1);
          }
      } catch(e) {
          console.log(e, "creeproom", creep_room, "creeprole", creep_role, "cleanMem")
      }
    }
};


module.exports = roleHauler;
