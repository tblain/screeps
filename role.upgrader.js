
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
            var links = creep.room.find(FIND_MY_STRUCTURES, {filter: (i) => {i.structureType == STRUCTURE_LINK }});
            var container = creep.room.controller.pos.findClosestByRange(links);
            console.log("links: " + links);
            console.log("container: " + container);
            // var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            //         filter: (i) => {
            //             return i.structureType == STRUCTURE_LINK  }});
            
            if(!container) {
                container = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (i) => {
                        return ((i.structureType == STRUCTURE_CONTAINER | i.structureType == STRUCTURE_STORAGE) &&
                                i.store[RESOURCE_ENERGY] > creep.carryCapacity)}});
            }
            
	        if(container) {
	           // console.log("container " + container + "amount " + (creep.carryCapacity - creep.carry.energy));
	            if( (creep.withdraw(container, RESOURCE_ENERGY, (creep.carryCapacity - creep.carry.energy))) == ERR_NOT_IN_RANGE) {
	                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
	            }
	        } else {
	           // console.log("source")
    	        var sources = creep.room.find(FIND_SOURCES);
                if(creep.harvest(sources[1]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(sources[1], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
	        }
        }
    }
};

module.exports = roleUpgrader;