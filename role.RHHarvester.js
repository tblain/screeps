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

var find_source = function(creep, containers) {
  var harvestersToAvoid = _.filter(creep.room.find(FIND_MY_CREEPS), (harvester) => harvester.memory.role == 'RHHarvester' && harvester.id != creep.id);
  var sources = creep.room.find(FIND_SOURCES_ACTIVE);
  var source = undefined

  // on regarde si il y a un autre harvester
  if (harvestersToAvoid[0]) {
    for (var i = sources.length - 1; i >= 0; i--) {
      let sourcePotentielle = sources[i];
      let container = sourcePotentielle.pos.findClosestByRange(containers);
      // console.log("container: " + container.pos + " harvest : " + harvestersToAvoid[0].pos);
      if (!container.pos.isEqualTo(harvestersToAvoid[0].pos))
        source = sourcePotentielle;
      if (source != undefined) {
        // console.log("on prend la source libre : " + source.pos);
        creep.memory.sourceId = source.id
      }
    }
  } else {
    // console.log("else")
    source = creep.pos.findClosestByPath(sources);
  }

  return source
}

var roleRHHarvester = {

  /** @param {Creep} creep **/
  run: function(creep) {
    var room = creep.room;
    if (!creep.memory.base_room) {
      creep.memory.base_room = room;
      creep.memory.reptimer = 0;
      creep.memory.harvesting = true;
    }
    creep.memory.reptimer = creep.memory.reptimer - 1;
    // console.log("reptimer:", creep.memory.reptimer)

    var base_room = creep.memory.base_room;
    var target = creep.memory.target;

    if (room.name != target) {
      creep.say("out");
      const route = Game.map.findRoute(room.name, target)
      const exit = creep.pos.findClosestByPath(route[0].exit);
      // console.log(route)
      creep.moveTo(exit, {
        visualizePathStyle: {
          stroke: '#ffffff'
        }
      });
    } else {
      // creep.say("in");
      creep.memory.reptimer = creep.memory.reptimer - 1;
      // TODO: rajouter la gestion de se mettre sur un conteneur

      if (!creep.memory.harvesting && creep.carry.energy == 0) {
        // console.log(creep.memory.harvesting, creep.carry.energy)
        creep.memory.harvesting = true;
        creep.say('🔄 harvest');
      }
      if (creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
        creep.memory.harvesting = false;
        creep.say('⚡ deposit');
      }

      if (creep.memory.harvesting) {
        var source = Game.getObjectById(creep.memory.sourceId); // on récupère dans la mémoire la source associé au creep s'il elle existe
        var containers = creep.room.find(FIND_STRUCTURES, {
          filter: (i) => {
            return i.structureType == STRUCTURE_CONTAINER
          }
        });
        if (!source) {
          // s'il n'a pas de source on lui en fournit une
          var source = find_source(creep, containers);
        }

        if (source != undefined) {
          if (containers.length > 0) {
            if (source.pos.findClosestByRange(containers).pos.lookFor(LOOK_CREEPS).length > 0) {
              if (source.pos.findClosestByRange(containers).pos.lookFor(LOOK_CREEPS)[0].name != creep.name) {
                var source = find_source(creep, containers)
              }
            }
            if (source != undefined) {
              // console.log(creep.pos, source.pos, containers, source.pos.findClosestByRange(containers).pos)
              if (creep.pos.isEqualTo(source.pos.findClosestByRange(containers).pos)) { // si le creep n'est pas à porté de la source il avance vers elle
                // console.log("test", creep.harvest(source), source, creep)
                creep.harvest(source);
              } else {
                creep.moveTo(source.pos.findClosestByRange(containers), {
                  visualizePathStyle: {
                    stroke: '#ffaa00'
                  }
                });
              }
            }

          } else {
            var sources = creep.room.find(FIND_SOURCES_ACTIVE);
            var source = creep.pos.findClosestByPath(sources);

            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
              creep.moveTo(source, {
                visualizePathStyle: {
                  stroke: '#ffaa00'
                }
              });
            }
          }
        }
      } else {
        var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
          filter: (s) => (false || s.structureType == STRUCTURE_CONTAINER)
        });
        target = undefined
        if (target && (true || creep.room.memory.workers["LRWorkers"].length == 0)) {
          creep.say("Build")
          if (creep.build(target) == ERR_NOT_IN_RANGE)
            creep.moveTo(target, {
              visualizePathStyle: {
                stroke: '#ffffff'
              }
            });
        } else {
          var closestDamagedStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => s.hits < (s.hitsMax - 5000) && s.structureType == STRUCTURE_CONTAINER && s.pos.inRangeTo(creep.pos, 4)
          });
          closestDamagedStructure = undefined

          if (closestDamagedStructure && creep.memory.reptimer <= 0) {
            creep.say("Rep")
            if (creep.repair(closestDamagedStructure) == ERR_NOT_IN_RANGE)
              creep.moveTo(closestDamagedStructure, {
                visualizePathStyle: {
                  stroke: '#ffffff'
                }
              });
          } else {
            var source = creep.memory.sourceId;
            if (creep.memory.reptimer <= 0)
              creep.memory.reptimer = 200;

            var containerNotFull = creep.pos.findClosestByPath(FIND_STRUCTURES, {
              filter: (i) => {
                return (i.structureType == STRUCTURE_CONTAINER &&
                  i.store[RESOURCE_ENERGY] < i.storeCapacity)
              }
            });
            if (containerNotFull && creep.carry.energy > 0) {
              if (creep.transfer(containerNotFull, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(containerNotFull, {
                  visualizePathStyle: {
                    stroke: '#ffffff'
                  }
                });
              }
            } else {
              refillStruct(creep, [STRUCTURE_EXTENSION, STRUCTURE_SPAWN])
              creep.say("RAF")
            }
          }
        }
      }
    }
  },

  //code pour initialiser de facon personnelle la memoire
  initMemory: function(room, argus) {
    var creepName = argus["creepName"]
    var target = argus["target"]
    // console.log(room, target)

    //init de la memoire
    room.memory.roomHelping[target].workers["RHHarvesters"].push(creepName);
    room.memory.roomHelping[target].workers["RHWorkers"].push(creepName);

    // creation du dicMem
    return {
      room: argus["room"],
      roomName: argus["roomName"],
      role: argus["role"],
      target: target
    };
  },

  // code pour clean la memoire
  cleanMem: function(creep, name) {
    var creep_role = creep.role;
    var target = creep.target
    console.log("Death of a:", creep.role, ", named:", name, ", in room:", creep.room);
    try {
      var creep_room = Game.rooms[creep.roomName];
      if (creep_room.memory.roomHelping[target].workers["RHHarvesters"].includes(name)) {
        creep_room.memory.roomHelping[target].workers["RHHarvesters"].splice(creep_room.memory.roomHelping[target].workers["RHHarvesters"].indexOf(name), 1);
        creep_room.memory.roomHelping[target].workers["RHWorkers"].splice(creep_room.memory.roomHelping[target].workers["RHWorkers"].indexOf(name), 1);
      }
    } catch (e) {
      console.log(e, "creeproom", creep_room, "creeprole", creep_role, "cleanMem")
    }
  }
};

module.exports = roleRHHarvester;
