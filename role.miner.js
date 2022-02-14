var roleMiner = {

    /** @param {Creep} creep **/
    run: function(creep) {
        
        if(creep.memory.working && creep.carry[RESOURCE_UTRIUM] == 0) {
            creep.memory.working = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.working && creep.carry[RESOURCE_UTRIUM] == creep.carryCapacity) {
            creep.memory.working = true;
            creep.say('⚡ working');
        }

        if(!creep.memory.working) {
            var mineral = Game.getObjectById(creep.memory.mineralId);
            
            if(!mineral) {
                minerals = creep.room.find(FIND_MINERALS);
                mineral = minerals[0];
                // console.log(nb);
                creep.memory.mineralId = mineral.id;
            }
            if(creep.harvest(mineral, RESOURCE_UTRIUM) == ERR_NOT_IN_RANGE) {
                creep.moveTo(mineral, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            //console.log("mineral " + creep.carry[RESOURCE_UTRIUM]);
            var containers = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return structure.structureType == STRUCTURE_CONTAINER;
                }
            });
            
            if(containers.length > 0) {
                container = creep.pos.findClosestByPath(containers);
                if(creep.transfer(container, RESOURCE_UTRIUM) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleMiner;