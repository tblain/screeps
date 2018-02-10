var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        // if(!creep.memory.harvest && creep.carry.energy == 0) {
        //     creep.memory.harvest = true;
        //     creep.say("Harvest");
        // } else if (creep.memory.harvest && creep.carry.energy == creep.carryCapacity) {
        //     creep.memory.harvest = false;
        //     creep.say("Transfere");
        // }
        
        // if(true | creep.memory.harvest) {
            // console.log("creep " + creep.name);
            var source = Game.getObjectById(creep.memory.sourceId);
            
            if(!source) {
                source = creep.pos.findClosestByPath(FIND_SOURCES);
                // console.log(source);
                creep.memory.sourceId = source.id;
            }
                //console.log("creep " + creep.name + "source " + source);
            
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        // } else if(false && !creep.memory.harvest) {
        //     var containerNotFull = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        //         filter: (i) => {
        //             return (i.structureType == STRUCTURE_CONTAINER &&
        //                     i.store[RESOURCE_ENERGY] < i.storeCapacity)}});
        //     if(containerNotFull && creep.carry.energy > 0) {
        //         if(creep.transfer(containerNotFull, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        //             creep.moveTo(containerNotFull, {visualizePathStyle: {stroke: '#ffffff'}});
        //         }
        //     }
        // }
    }
};

module.exports = roleHarvester;