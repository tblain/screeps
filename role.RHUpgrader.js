var roleRHUpgrader = {

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
        if (creep.memory.upgrading && creep.carry.energy == 0) {
          creep.memory.upgrading = false;
          creep.say('🔄 harvest');
        }
        if (!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
          creep.memory.upgrading = true;
          creep.say('⚡ upgrade');
        }

        if (creep.memory.upgrading) {
          if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller, {
              visualizePathStyle: {
                stroke: '#ffffff'
              }
            });
          }
        } else {
          var links = creep.room.find(FIND_STRUCTURES, {
            filter: (i) => {
              return i.structureType == STRUCTURE_LINK
            }
          });
          var container = creep.room.controller.pos.findClosestByRange(links);
          if (!container || creep.room.controller.level < 5) {
            container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
              filter: (i) => {
                return ((i.structureType == STRUCTURE_CONTAINER | i.structureType == STRUCTURE_STORAGE) &&
                  i.store[RESOURCE_ENERGY] > creep.carryCapacity)
              }
            });
          }
          if (container) {
            var withdraw = creep.withdraw(container, RESOURCE_ENERGY);
            if (withdraw == ERR_NOT_IN_RANGE) {
              creep.moveTo(container, {
                visualizePathStyle: {
                  stroke: '#ffaa00'
                }
              });
            }
          } else {
            var sources = creep.room.find(FIND_SOURCES);
            // var source = creep.pos.findClosestByPath(sourcesDispo);

            if (creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
              creep.moveTo(sources[0], {
                visualizePathStyle: {
                  stroke: '#ffaa00'
                }
              });
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
    room.memory.roomHelping[target].workers["RHUpgraders"].push(creepName);
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
    console.log("Death of a:", creep.role, ", named:", sname, ", in room:", creep.room);
    try {
      var creep_room = Game.rooms[creep.roomName];
      if (creep_room.memory.roomHelping[target].workers["RHUpgraders"].includes(name)) {
        creep_room.memory.roomHelping[target].workers["RHUpgraders"].splice(creep_room.memory.roomHelping[target].workers["RHUpgraders"].indexOf(name), 1);
        creep_room.memory.roomHelping[target].workers["RHWorkers"].splice(creep_room.memory.roomHelping[target].workers["RHWorkers"].indexOf(name), 1);
      }
    } catch (e) {
      console.log(e, "creeproom", creep_room, "creeprole", creep_role, "cleanMem")
    }
  }
};

module.exports = roleRHUpgrader;
