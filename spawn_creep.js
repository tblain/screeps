var roleHarvester = require("role.harvester");
var roleUpgrader = require("role.upgrader");
var roleBuilder = require("role.builder");
var roleHauler = require("role.hauler");
var roleTowerHauler = require("role.towerHauler");
var roleLRHauler = require("role.LRHauler");
var roleLRBasicWorker = require("role.LRBasicWorker");
var roleLRHarvester = require("role.LRHarvester");
var roleLRDefMel = require("role.LRDefMel");
var roleLRClaimer = require("role.LRClaimer");
var roleBasicWorker = require("role.basicWorker");
var roleFighter = require("role.fighter");
var roleMiner = require("role.miner");
var roleMineHauler = require("role.mineHauler");
var rolePowerHauler = require("role.powerHauler");
var roleSmallMele = require("role.small_mele");
var tower = require("tower");
var link = require("link");
var terminal = require("terminal");
var roleClaimer = require("role.claimer");
var roleRHBasicWorker = require("role.RHBasicWorker");
var roleRHHarvester = require("role.RHHarvester");
var roleRHUpgrader = require("role.RHUpgrader");
// var spawn_creep = require("spawn_creep");

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
};

module.exports = {


	spawn_creep: function(name, roomName, body, role, mem_roomName) {
		var room = roomName;
		var spawns = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_SPAWN}); // on récupères le spawn associé à la room
		var spawn = -1;

	    for (var i = 0; i < spawns.length; i++) {
	        if(!spawns[i].spawning){
	        	spawn = spawns[i];
	        	break;
	        }
	    }


	    // si aucun spawn dispo
	    if (spawn == -1){ return -1 }

		if (mem_roomName == undefined) {
			mem_roomName = room.name
			mem_room = Game.rooms[mem_roomName]
		}
		mem_room = Game.rooms[mem_roomName]
		var returnValue = spawn.spawnCreep(body, name, { memory: {role:role, room:mem_roomName, reservation:false}});

		if (returnValue == 0) {
			// console.log("==========")
			// console.log("room id:", mem_room, mem_room.id)
			console.log(roomName, " | ", mem_room, " | ", role)
			mem_room.memory.workers[role+"s"].push(name);
			mem_room.memory.workers["workers"].push(name);
		}
		return returnValue;

	},

	sspawn_creep: function(argus) {
    // console.log("roomName", argus["roomName"])
		// on gere si le nom de la room ou la room directe est donnee
		if (argus["room"] != undefined) {
			var room = argus["room"]
			var roomName = room.name
			argus["roomName"] = roomName
		} else if (argus["roomName"] != undefined) {
			var roomName = argus["roomName"]
			var room = Game.rooms[roomName]
			argus["room"] = room
		} else {
			console.log("Erreur ni room, ni roomName")
			return -1
		}

		var role = argus["role"]
		var creepName = argus["creepName"]
		var body = argus["body"]


		var spawns = room.find(FIND_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_SPAWN && !s.spawning}); // on récupères le spawn associé à la room

		if (spawns.length > 0) { var spawn = spawns[0];	} else { return -1 }

    try {
      var returnValue = spawn.spawnCreep(body, creepName, {dryRun:true});

    } catch (e) {

      console.log("Spawning:",returnValue, creepName, role, "error:", e)
    }

		if (returnValue == 0) {
			// on laisse la gestion de la memoire au role, il doit aussi renvoyer un dictionnaire de memoire a donner au creep
			var dicMem = eval("role"+capitalize(role)+".initMemory(room, argus)")
			var returnValue = spawn.spawnCreep(body, creepName, { memory: dicMem});
		}
		return returnValue;

	}
};
