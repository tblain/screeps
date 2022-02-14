var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
        else {
            var links = creep.room.find(FIND_STRUCTURES, {filter: (i) => { return i.structureType == STRUCTURE_LINK}});
            var container = creep.room.controller.pos.findClosestByRange(links);
            if(!container || creep.room.controller.level < 5) {
                container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (i) => {
                        return ((i.structureType == STRUCTURE_CONTAINER | i.structureType == STRUCTURE_STORAGE) &&
                                i.store[RESOURCE_ENERGY] > creep.carryCapacity)}});
            }
	        if(container) {
	            var withdraw = creep.withdraw(container, RESOURCE_ENERGY);
	            if( withdraw == ERR_NOT_IN_RANGE) {
	                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
	            }
	        } else {
    	        var sources = creep.room.find(FIND_SOURCES);
    	       // var source = creep.pos.findClosestByPath(sourcesDispo);

                if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
	        }
        }
    },

    //code pour initialiser de facon personnelle la memoire
    initMemory: function(room, argus) {
        var creepName = argus["creepName"]

        //init de la memoire
        room.memory.workers["upgraders"].push(creepName);
        room.memory.workers["workers"].push(creepName);

        // creation du dicMem
        return {room:argus["room"], roomName:argus["roomName"], role:argus["role"]};
    },

    // code pour clean la memoire
    cleanMem: function(creep, name) {
        var creep_role = creep.role;
        try {
          console.log("Death of a:", creep.role, ", named:", name, ", in room:", creep.room);
            var creep_room = Game.rooms[creep.roomName];
            if (creep_room.memory.workers["upgraders"].includes(name)) {
                creep_room.memory.workers["upgraders"].splice(creep_room.memory.workers["upgraders"].indexOf(name),1);
                creep_room.memory.workers["workers"].splice(creep_room.memory.workers["workers"].indexOf(name),1);
            }
        } catch(e) {
            console.log(e, creep_room, creep_role, "cleanMem")
        }

        delete Memory.creeps[name];
        console.log("Death of ", name);
    }
};

module.exports = roleUpgrader;
