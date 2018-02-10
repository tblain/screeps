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
                // creep.moveTo(Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#ffffff'}});
                creep.moveTo(Game.rooms["E38N3"].controller);
            }
	    }
	    else {
	        var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (i) => {
                        return ((i.structureType == STRUCTURE_CONTAINER | i.structureType == STRUCTURE_STORAGE) &&
                                i.store[RESOURCE_ENERGY] > creep.carryCapacity)}});
	        if(container) {
	           // console.log("container " + container + "amount " + (creep.carryCapacity - creep.carry.energy));
	            if( (creep.withdraw(container, RESOURCE_ENERGY, (creep.carryCapacity - creep.carry.energy))) == ERR_NOT_IN_RANGE) {
	                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
	            }
	        } else {
	           // creep.moveTo(Game.rooms["E37N3"].controller);
	           // console.log("source")
    	        var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
	        }
	    }
	}
};

module.exports = roleBuilder;