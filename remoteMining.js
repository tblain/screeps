var roleLRHauler = require("role.LRHauler");
var roleLRBasicWorker = require("role.LRBasicWorker");
var roleLRHarvester = require("role.LRHarvester");
var roleLRDefMel = require("role.LRDefMel");
var roleLRClaimer = require("role.LRClaimer");
var spawn_creep = require("spawn_creep");

var remoteMining = {

  /** @param {Creep} creep **/
  remoteMine: function(pipeline) {
    var base = pipeline["base"];
    var target = pipeline["target"];
    var target_room = Game.rooms[target];
    var base_room = Game.rooms[base];
    // console.log(target_room)

    // var LRDefMels = target_room.memory.workers["LRDefMels"];
    var hostileStructs = []
    var hostileCreeps = []
    var gotVisu = target_room != undefined;
    if (gotVisu) hostileStructs = target_room.find(FIND_HOSTILE_STRUCTURES);
    else hostileStructs = []
    if (gotVisu) hostileCreeps = target_room.find(FIND_HOSTILE_CREEPS);
    else hostileCreeps = []

    var hostiles = hostileCreeps.concat(hostileStructs)

    // console.log("hostiles:", hostiles.length)

    // si on a pas de visu sur la salle on la declare non safe
    base_room.memory.pipelines[target].safe = gotVisu && hostiles.length == 0

    // deja on ne commence l'operation que si la target_room est safe
    if (base_room.memory.pipelines[target].safe) {
      // on fait spawn un claimer
      // var claimer = Game.creeps["claimer" + target];
      var LRClaimers = base_room.memory.pipelines[target].workers["LRClaimers"];
      // console.log(target)
      var controller = target_room.controller;

      if (!controller.reservation) claimed = false
      else claimed = controller.reservation.username == "Jausejoestar";

      // bon la on essaye on est essaye d'adapter le body du claim pour economiser l'energie
      if (LRClaimers.length < 1) {

        if (claimed) {
          // si le controller est quasi max reserve on spawn un plus petit claimer
          if (controller.reservation.ticksToEnd > 4500) body = [MOVE, MOVE, CLAIM]
          else if (controller.reservation.ticksToEnd > 3000) body = [MOVE, MOVE, CLAIM, CLAIM]
          else body = [MOVE, MOVE, MOVE, CLAIM, CLAIM, CLAIM]
        } else body = [MOVE, MOVE, CLAIM, CLAIM]

        var status = spawn_creep.sspawn_creep({creepName: "LRClaimer" + target,room: base_room,role: "LRClaimer",body:body, target:target})
      }

      if (claimed) {
        // tout est bon on peut commencer l'operation
        var LRBasicWorkers = base_room.memory.pipelines[target].workers["LRBasicWorkers"];
        var LRHarvesters = base_room.memory.pipelines[target].workers["LRHarvesters"];
        var LRHaulers = base_room.memory.pipelines[target].workers["LRHaulers"];
        var containers = target_room.find(FIND_STRUCTURES, {filter: (i) => {return (i.structureType == STRUCTURE_CONTAINER)}});

        if (LRHarvesters.length < target_room.find(FIND_SOURCES).length) {
          var status = spawn_creep.sspawn_creep({creepName: "LRHarvester" + target + Game.time,room: base_room,role: "LRHarvester",body:[MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK], target:target})
       } if (LRBasicWorkers.length < 2 - LRHarvesters.length) {
          var status = spawn_creep.sspawn_creep({creepName: "LRBasicWorker" + target + Game.time,room: base_room,role: "LRBasicWorker",body:[MOVE, MOVE, MOVE, WORK, WORK, CARRY], target:target})
        } else if (LRHaulers.length < target_room.find(FIND_SOURCES).length && LRHaulers.length < containers.length) {
          var body = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,  CARRY, CARRY,  CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
          var status = spawn_creep.sspawn_creep({creepName: "LRHauler" + target + Game.time,room: base_room,role: "LRHauler",body:body, target:target})
        }

      }

    } else {
      LRDefMels = base_room.memory.pipelines[target].workers["LRDefMels"];
      // console.log(LRDefMels.length)
      // LRDefMels = 2
      //Game.rooms["W2N5"].memory.pipelines["W3N5"].workers["LRDefMels"]

      // on envoie un creep pour regarder si c'est safe et clean le danger si oui
      if (gotVisu) {
        // console.log(target_room.find(FIND_HOSTILE_STRUCTURES), hostiles)
        if (LRDefMels.length < hostiles.length) {
          var body = [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK]
          var status = spawn_creep.sspawn_creep({creepName: "LRDefMel" + target + Game.time,room: base_room,role: "LRDefMel",body:body, target:target})
        }

        if(hostileCreeps == 0) {
          var LRClaimers = base_room.memory.pipelines[target].workers["LRClaimers"];
          if (LRClaimers.length < 1) {
            var body = [MOVE, MOVE, MOVE, CLAIM, CLAIM, CLAIM]
            var status = spawn_creep.sspawn_creep({creepName: "LRClaimer" + target,room: base_room,role: "LRClaimer",body:body, target:target})

          }
        }
      } else {
        if (LRDefMels.length < 1) {
          var body = [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK]
          var status = spawn_creep.sspawn_creep({creepName: "LRDefMel" + target + Game.time,room: base_room,role: "LRDefMel",body:body, target:target})
        }
      }
    }
  }
};
module.exports = remoteMining;
