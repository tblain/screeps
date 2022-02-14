var roleBuilder = {

    /** @param {Creep} creep **/
    run: function(creep) {

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
            if(target) {
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                creep.moveTo(Game.getObjectById("59f1a59682100e1594f3ec08"), {visualizePathStyle: {stroke: '#ffffff'}});
            }
	    }
	    else {
	        var containers = creep.room.find(FIND_STRUCTURES, {filter: (i) => { return ((i.structureType == STRUCTURE_CONTAINER | i.structureType == STRUCTURE_STORAGE) &&
                                i.store[RESOURCE_ENERGY] > 200)}});
          var container = creep.pos.findClosestByRange(containers);

	        if(container) {
	            if( (creep.withdraw(container, RESOURCE_ENERGY, (creep.carryCapacity - creep.carry.energy))) == ERR_NOT_IN_RANGE) {
	                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
	            }
	        } else {
    	        var source = Game.getObjectById(creep.memory.sourceId);
    	        if(!source) {
                    var sources = creep.room.find(FIND_SOURCES);
                    var nb = Math.round(Math.random() * sources.length);
                    source = sources[nb];
                    creep.memory.sourceId = source.id;
                }
                if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
	        }
	    }
	}
};

module.exports = roleBuilder;