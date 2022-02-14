var roleLRClaimer = {

  /** @param {Creep} creep **/
  run: function(creep) {
    var target = creep.memory.target
    current_room = creep.room;

    if (current_room.name != target) {
      creep.say("out");
      const route = Game.map.findRoute(current_room.name, target);
      const exit = creep.pos.findClosestByPath(route[0].exit);
      creep.moveTo(exit);
    } else {
      var target_room = Game.rooms[target];
      creep.say("in");
      var controller = target_room.controller;
      if (controller.reservation) {
        if (controller.reservation.username != "Jausejoestar"){
          creep.attackController(controller)
        }

      }
      if (creep.reserveController(controller) == ERR_NOT_IN_RANGE) {
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

    //init de la memoire
    room.memory.pipelines[target].workers["LRClaimers"].push(creepName);
    room.memory.pipelines[target].workers["LRWorkers"].push(creepName);

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
      if (creep_room.memory.pipelines[target].workers["LRClaimers"].includes(name)) {
        creep_room.memory.pipelines[target].workers["LRClaimers"].splice(creep_room.memory.pipelines[target].workers["LRClaimers"].indexOf(name),1);
        creep_room.memory.pipelines[target].workers["LRWorkers"].splice(creep_room.memory.pipelines[target].workers["LRWorkers"].indexOf(name),1);
      }
    } catch(e) {
        console.log(e, "creeproom", creep_room, "creeprole", creep_role, "cleanMem")
    }
  }
};

module.exports = roleLRClaimer;
