var roleLRHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
    	var room = creep.room;
    	if (!creep.memory.base_room) {
    		creep.memory.base_room = room;
    		creep.memory.reptimer = 0;
    		creep.memory.harvesting = true;
    	}
    	creep.memory.reptimer = creep.memory.reptimer-1;
		// console.log("reptimer:", creep.memory.reptimer)

    	var base_room = creep.memory.base_room;
    	var target = creep.memory.target;

    	if (room.name != target) {
            creep.say("out");
            const route = Game.map.findRoute(room.name, target)
            const exit = creep.pos.findClosestByPath(route[0].exit);
            // console.log(route)
            creep.moveTo(exit, {visualizePathStyle: {stroke: '#ffffff'}});
        } else {
            // creep.say("in");
            creep.memory.reptimer = creep.memory.reptimer-1;
            var sources = creep.room.find(FIND_SOURCES_ACTIVE);
            var source = creep.pos.findClosestByPath(sources);

            // TODO: rajouter la gestion de se mettre sur un conteneur

            if(creep.memory.harvesting && creep.carry.energy == 0) {
	            creep.memory.harvesting = false;
	            creep.say('🔄 harvest');
	        }
	        if(!creep.memory.harvesting && creep.carry.energy == creep.carryCapacity) {
	            creep.memory.harvesting = true;
	            creep.say('⚡ deposit');
	        }

	        if(!creep.memory.harvesting) {
	            var source = Game.getObjectById(creep.memory.sourceId);
	            if(!source) {
	                var sources = creep.room.find(FIND_SOURCES);
	                var nb = Math.round(Math.random() * sources.length);
	                source = sources[nb];
	                // console.log(nb);
	                if(source)
	                    creep.memory.sourceId = source.id;
	            }
	            // console.log(creep.harvest(source));
	            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
	                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
	            }
	        }
	        else {
	        	var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {filter: (s) => (false || s.structureType == STRUCTURE_CONTAINER)});
	            if(target && (true || creep.room.memory.workers["LRWorkers"].length == 0)) {
	            	creep.say("Build")
	                if(creep.build(target) == ERR_NOT_IN_RANGE)
	                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
	            } else {
	                var closestDamagedStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {filter: (s) => s.hits < (s.hitsMax - 5000) && s.structureType == STRUCTURE_CONTAINER});

		            if(closestDamagedStructure && creep.memory.reptimer <= 0) {
	            		creep.say("Rep")
		 	            if(creep.repair(closestDamagedStructure) == ERR_NOT_IN_RANGE)
	                    	creep.moveTo(closestDamagedStructure, {visualizePathStyle: {stroke: '#ffffff'}});
	                } else {
	                	var source = creep.memory.sourceId;
	                	if (creep.memory.reptimer <= 0)
	                		creep.memory.reptimer = 200;

	                	var containerNotFull = creep.pos.findClosestByPath(FIND_STRUCTURES, {
			                filter: (i) => {
			                    return (i.structureType == STRUCTURE_CONTAINER &&
			                            i.store[RESOURCE_ENERGY] < i.storeCapacity)}});
			            if(containerNotFull && creep.carry.energy > 0) {
			                if(creep.transfer(containerNotFull, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
			                    creep.moveTo(containerNotFull, {visualizePathStyle: {stroke: '#ffffff'}});
			                }
			            } else {
			            	creep.say("RAF")
			            }

	            }


              //   	console.log(containers)
		            // creep.moveTo(source.pos.findClosestByRange(containers), {visualizePathStyle: {stroke: '#ffaa00'}});
		            // if(creep.harvest(source) == ERR_NOT_IN_RANGE) { // si le creep n'est pas à porté de la source il avance vers elle
		            //     creep.moveTo(source.pos.findClosestByRange(containers), {visualizePathStyle: {stroke: '#ffaa00'}});
		            // }
                }

			}

        }
	},

  //code pour initialiser de facon personnelle la memoire
  initMemory: function(room, argus) {
    var creepName = argus["creepName"]
    var target = argus["target"]

    //init de la memoire
    room.memory.pipelines[target].workers["LRHarvesters"].push(creepName)
    room.memory.pipelines[target].workers["LRWorkers"].push(creepName)

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
      // console.log("lui", creep_room.memory.pipelines[target].workers["LRHarvesters"].indexOf(name))
      if (creep_room.memory.pipelines[target].workers["LRHarvesters"].includes(name)) {
        creep_room.memory.pipelines[target].workers["LRHarvesters"].splice(creep_room.memory.pipelines[target].workers["LRHarvesters"].indexOf(name), 1);
        creep_room.memory.pipelines[target].workers["LRWorkers"].splice(creep_room.memory.pipelines[target].workers["LRWorkers"].indexOf(name), 1);
      }
    } catch (e) {
      console.log(e, "creeproom", creep_room, "creeprole", creep_role, "cleanMem")
    }
  }
};

module.exports = roleLRHarvester;
