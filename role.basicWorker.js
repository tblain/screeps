var refillStruct = function(creep, listStructure) {
  var structureToRefill = creep.pos.findClosestByPath(creep.room.find(FIND_STRUCTURES, {
    filter: (i) => {
      return (listStructure.includes(i.structureType) &&
        i.energy < i.energyCapacity)
    }
  }));
  var status = -1
  if (structureToRefill && creep.carry.energy > 0) {
    var status = creep.transfer(structureToRefill, RESOURCE_ENERGY)
    // console.log(structureToRefill, status)
    if (status == ERR_NOT_IN_RANGE) {
      creep.moveTo(structureToRefill, {
        visualizePathStyle: {
          stroke: '#ffffff'
        }
      });
    }
  }
  return status;
};

var repairStruct = function(creep) {
  var closestDamagedStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
    filter: (s) => s.hits < (s.hitsMax - 500) && s.structureType != STRUCTURE_WALL && s.structureType != STRUCTURE_RAMPART
  });
  var status = -1;
  // closestDamagedStructure = undefined
  if (closestDamagedStructure) {
    creep.say("Rep");
    status = creep.repair(closestDamagedStructure);
    if (status == ERR_NOT_IN_RANGE)
      creep.moveTo(closestDamagedStructure, {
        visualizePathStyle: {
          stroke: '#ffffff'
        }
      });
  }
  return status;
};

var buildStruct = function(creep) {
  var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
  // target = undefined;
  var status = -1;
  if (target) {
    status = creep.build(target);
    if (status == ERR_NOT_IN_RANGE) {
      creep.moveTo(target, {
        visualizePathStyle: {
          stroke: '#ffffff'
        }
      });
    }
  }
  return status;
};

var repairing_tick_to_downgrad = function(creep) {
  creep.memory.repairing_tick_to_downgrad = true;
  var status = -1;
  if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
    status = creep.moveTo(creep.room.controller, {
      visualizePathStyle: {
        stroke: '#ffffff'
      }
    });
  }

  if (creep.room.controller.ticksToDowngrade > 9500) {
    creep.memory.repairing_tick_to_downgrad = false;
  }
  return -1;
};

var upgradeController = function(creep) {
  var status = -1;
  if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
    status = creep.moveTo(creep.room.controller, {
      visualizePathStyle: {
        stroke: '#ffffff'
      }
    });
  }
  return status;
};

var roleBasicWorker = {

    /** @param {Creep} creep **/
    run: function(creep) {
      var sources = creep.room.find(FIND_SOURCES_ACTIVE);
      var source = creep.pos.findClosestByPath(sources);

      // TODO: rajouter la gestion de se mettre sur un conteneur

      if (creep.memory.working && creep.carry.energy == 0) {
        creep.memory.working = false;
        creep.say('🔄 harvest');
      }
      if (!creep.memory.working && creep.carry.energy == creep.carryCapacity) {
        creep.memory.working = true;
        creep.say('⚡ working');
      }

      if (!creep.memory.working) {
        var containerWithEnergy = creep.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: (i) => {
            return (i.structureType == STRUCTURE_CONTAINER &&
              i.store[RESOURCE_ENERGY] > 0)
          }
        });
        if (!containerWithEnergy) {
          var containerWithEnergy = creep.pos.findClosestByPath(creep.room.find(FIND_STRUCTURES, {
            filter: (i) => {
              return (i.structureType == STRUCTURE_STORAGE && i.store[RESOURCE_ENERGY] > 0 && (false && creep.room.controller.level < 8 || i.store[RESOURCE_ENERGY] < 300000))
            }
          }));
        }

        if (containerWithEnergy) {
          // console.log("test")
          if (creep.withdraw(containerWithEnergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(containerWithEnergy, {
              visualizePathStyle: {
                stroke: '#ffffff'
              }
            });
          }
        } else {
          var source = Game.getObjectById(creep.memory.sourceId);
          // var sources = creep.room.find(FIND_SOURCES);
          // source = creep.pos.findClosestByPath(sources);
          if (!source) {
            var sources = creep.room.find(FIND_SOURCES);
            var nb = Math.round(Math.random() * sources.length);
            source = sources[nb];
            if (source)
              creep.memory.sourceId = source.id;
          }
          if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {
              visualizePathStyle: {
                stroke: '#ffaa00'
              }
            });
          }
        }

      } else {
        if (creep.room.controller.ticksToDowngrade < 5000 || creep.memory.repairing_tick_to_downgrad) {
          creep.memory.repairing_tick_to_downgrad = true
          repairing_tick_to_downgrad(creep)
        } else {
          // d'abord on on remplis les tours, etc...
          var status = refillStruct(creep, [STRUCTURE_TOWER,STRUCTURE_SPAWN, STRUCTURE_EXTENSION])
          if (status == -1) {
            var status = repairStruct(creep);
            if (status == -1) {
              status = refillStruct(creep, [STRUCTURE_SPAWN, STRUCTURE_EXTENSION])
              // console.log(status)
              if (status == -1) {
                status = buildStruct(creep)
                if (status == -1) {
                  status = upgradeController(creep)
                }
              }
            }
          }
        }
      }
    },

    //code pour initialiser de facon personnelle la memoire
    initMemory: function(room, argus) {
        var creepName = argus["creepName"]
        console.log(room)

        //init de la memoire
        room.memory.workers["basicWorkers"].push(creepName);
        room.memory.workers["workers"].push(creepName);

        // creation du dicMem
        return {room:argus["room"], roomName:argus["roomName"], role:argus["role"]};
    },

    // code pour clean la memoire
    cleanMem: function(creep, name) {
        var creep_role = creep.role;
        try {
            var creep_room = Game.rooms[creep.roomName];
            console.log(creep_room, creep_role, creep_room.memory.workers["basicWorkers"])
            if (creep_room.memory.workers["basicWorkers"].includes(name)) {
                creep_room.memory.workers["basicWorkers"].splice(creep_room.memory.workers["basicWorkers"].indexOf(name),1);
                creep_room.memory.workers["workers"].splice(creep_room.memory.workers["workers"].indexOf(name),1);
            }
        } catch(e) {
            console.log(e, creep_room, creep_role, "cleanMem")
        }

        delete Memory.creeps[name];
        console.log("Death of ", name);
    }
};

module.exports = roleBasicWorker;
