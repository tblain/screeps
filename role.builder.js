var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

	   // console.log("target " + creep.memory.building);
	    if(creep.memory.building && creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
	        creep.memory.building = true;
	        creep.say('🚧 build');
	    }

	    if(creep.memory.building) {
	        var target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                // console.log("target " + target);
            if(target) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
            //     // creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#ffffff'}});
                // console.log("new room");
                creep.moveTo(Game.getObjectById("59f1a59682100e1594f3ec08"), {visualizePathStyle: {stroke: '#ffffff'}});
                // creep.moveTo(Game.getObjectById("59f1a59782100e1594f3ec1c"), {visualizePathStyle: {stroke: '#ffffff'}});
            }
	    }
	    else {
	        // var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
         //            filter: (i) => {
         //                return ((i.structureType == STRUCTURE_CONTAINER | i.structureType == STRUCTURE_STORAGE) &&
         //                        i.store[RESOURCE_ENERGY] > creep.carryCapacity)}});
	        var containers = creep.room.find(FIND_STRUCTURES, {filter: (i) => { return ((i.structureType == STRUCTURE_CONTAINER | i.structureType == STRUCTURE_STORAGE) &&
                                i.store[RESOURCE_ENERGY] > 200)}});
            var container = creep.pos.findClosestByRange(containers);

	        if(container) {
	           // console.log("container " + container + "amount " + container.store[RESOURCE_ENERGY] + " room " + container.room);
	            if( (creep.withdraw(container, RESOURCE_ENERGY, (creep.carryCapacity - creep.carry.energy))) == ERR_NOT_IN_RANGE) {
	                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
	            }
	        } else {

	           // console.log("source")
    	       // var sources = creep.room.find(FIND_SOURCES);
    	       // var sourcesDispo;
    	       // var j = 0;
    	       // for (var i = sources.length - 1; i >= 0; i--) {
    	       //     if(sources[i].energy > 0)
    	       //         sourcesDispo = sources[j++];
    	       // }
    	       // var source = creep.pos.findClosestByPath(sourcesDispo);
    	        var source = Game.getObjectById(creep.memory.sourceId);
    	        if(!source) {
                    var sources = creep.room.find(FIND_SOURCES);
                    var nb = Math.round(Math.random() * sources.length);
                    source = sources[nb];
                    // console.log(nb);
                    creep.memory.sourceId = source.id;
                }
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
	        }
	    }
	},

    //code pour initialiser de facon personnelle la memoire
    initMemory: function(room, argus) {
        var creepName = argus["creepName"]

        //init de la memoire
        room.memory.workers["builders"].push(creepName);
        room.memory.workers["workers"].push(creepName);

        // creation du dicMem
        return {room:argus["room"], roomName:argus["roomName"], role:argus["role"]};
    },

    // code pour clean la memoire
    cleanMem: function(creep, name) {
        var creep_role = creep.role;
        console.log("Death of a:", creep.role, ", named:", name, ", in room:", creep.room);
        try {
            var creep_room = Game.rooms[creep.roomName];
            if (creep_room.memory.workers["builders"].includes(name)) {
                creep_room.memory.workers["builders"].splice(creep_room.memory.workers["builders"].indexOf(name),1);
                creep_room.memory.workers["workers"].splice(creep_room.memory.workers["workers"].indexOf(name),1);
            }
        } catch(e) {
            console.log(e, "creeproom", creep_room, "creeprole", creep_role, "cleanMem")
        }
    }
};

module.exports = roleBuilder;
