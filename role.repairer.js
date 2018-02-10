var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {

	    if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
	    }
	    if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
	        var buildingToRepair = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(object){
                    return object.hits > object.hitsMax;                } 
            });
            
	        creep.memory.repairing = true;
	        creep.say('🚧 repairing');
	    }

	    if(creep.memory.repairing) {
            var buildingToRepair = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(object){
                    return object.hits > object.hitsMax;} 
            });
            
             if (roadToRepair){
                if(creep.repair(buildingToRepair) == ERR_NOT_IN_RANGE)
                creep.moveTo(buildingToRepair);
            } else {
        
                // nothing to repair, let's do something else?
        
            }
	    }
	    else {
	        var sources = creep.room.find(FIND_SOURCES);
            if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
	    }
	}
};

module.exports = roleRepairer;