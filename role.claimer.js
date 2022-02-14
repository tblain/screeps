var roleClaimer = {

  /** @param {Creep} creep **/
  run: function(creep) {
    var target = creep.memory.target
    current_room = creep.room;
    // console.log("test")

    if (current_room.name != target) {
      creep.say("out");
      const route = Game.map.findRoute(current_room.name, target);
      const exit = creep.pos.findClosestByPath(route[0].exit);
      creep.moveTo(exit);
    } else {
      var target_room = Game.rooms[target];
      creep.say("in");
      var controller = target_room.controller;

      if (creep.claimController(controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(controller, {
          visualizePathStyle: {
            stroke: "#ffaa00",
          },
        });
      } else {
        creep.memory.reserving = true;
      }
    }
  },

  //code pour initialiser de facon personnelle la memoire
  initMemory: function(room, argus) {
    var creepName = argus["creepName"];
    var roomName = argus["roomName"];
    var target = argus["target"];
    console.log(target)

    //init de la memoire
    room.memory.workers["claimers"].push(creepName);
    room.memory.workers["workers"].push(creepName);

    // creation du dicMem
    return {room:argus["room"], roomName:argus["roomName"], role:argus["role"], target:argus["target"]};
  },

  // code pour clean la memoire
  cleanMem: function(creep, name) {
    var creep_role = creep.role;
    console.log("Death of a:", creep.role, ", named:", name, ", in room:", creep.room)
    try {
      var creep_room = Game.rooms[creep.roomName];
      var target = creep.target;
      if (creep_room.memory.workers["claimers"].includes(name)) {
        room.memory.workers["claimers"].splice(room.memory.workers["claimers"].indexOf(name),1);
        room.memory.workers["workers"].splice(room.memory.workers["workers"].indexOf(name),1);
      }
    } catch(e) {
        console.log(e, "creeproom", creep_room, "creeprole", creep_role, "cleanMem")
    }
  }
};

module.exports = roleClaimer;
