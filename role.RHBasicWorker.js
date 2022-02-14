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

var harvest = function(creep) {
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
};

var ifNotWorking = function(creep) {
  var containerWithEnergy = creep.pos.findClosestByRange(FIND_STRUCTURES, {
    filter: (i) => {
      return (i.structureType == STRUCTURE_CONTAINER &&
        i.store[RESOURCE_ENERGY] > 0)
    }
  });
  if (!containerWithEnergy) {
    var containerWithEnergy = creep.pos.findClosestByPath(creep.room.find(FIND_STRUCTURES, {
      filter: (i) => {
        return (i.structureType == STRUCTURE_STORAGE && i.store[RESOURCE_ENERGY] < i.storeCapacity && (false && creep.room.controller.level < 8 || i.store[RESOURCE_ENERGY] < 300000))
      }
    }));
  }

  if (containerWithEnergy) {
    if (creep.withdraw(containerWithEnergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
      creep.moveTo(containerWithEnergy, {
        visualizePathStyle: {
          stroke: '#ffffff'
        }
      });
    }
  } else {
    harvest(creep);
  }
};

var ifInRoom = function(creep, room) {
  creep.say("in");
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
    // le creep a besoin de se refill en energy
    ifNotWorking(creep)

  } else {
    if (creep.room.controller.ticksToDowngrade < 5000 || creep.memory.repairing_tick_to_downgrad) {
      creep.memory.repairing_tick_to_downgrad = true
      repairing_tick_to_downgrad(creep)
    } else {
      // d'abord on on remplis les tours, etc...
      var status = refillStruct(creep, [STRUCTURE_TOWER])
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
}

var roleRHBasicWorker = {

  /** @param {Creep} creep **/
  run: function(creep) {
    var room = creep.room;
    if (!creep.memory.base_room) {
      creep.memory.base_room = room;
    }
    var base_room = Game.rooms[creep.memory.base_room.name];
    var target = creep.memory.target;
    // console.log(base_room.memory.pipelines[target].workers["LRHarvesters"])

    if (room.name != target) {
      // console.log("target", target)
      creep.say("out");
      const route = Game.map.findRoute(room.name, target)
      const exit = creep.pos.findClosestByPath(route[0].exit);
      creep.moveTo(exit, {
        visualizePathStyle: {
          stroke: '#ffffff'
        }
      });
    } else {
      ifInRoom(creep, room)
    }

  },

  //code pour initialiser de facon personnelle la memoire
  initMemory: function(room, argus) {
    var creepName = argus["creepName"]
    var target = argus["target"]
    // console.log(room, target)

    //init de la memoire
    room.memory.roomHelping[target].workers["RHBasicWorkers"].push(creepName);
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
      if (creep_room.memory.roomHelping[target].workers["RHBasicWorkers"].includes(name)) {
        creep_room.memory.roomHelping[target].workers["RHBasicWorkers"].splice(creep_room.memory.roomHelping[target].workers["RHBasicWorkers"].indexOf(name), 1);
        creep_room.memory.roomHelping[target].workers["RHWorkers"].splice(creep_room.memory.roomHelping[target].workers["RHWorkers"].indexOf(name), 1);
      }
    } catch (e) {
      console.log(e, "creeproom", creep_room, "creeprole", creep_role, "cleanMem")
    }
  }
};

module.exports = roleRHBasicWorker;
