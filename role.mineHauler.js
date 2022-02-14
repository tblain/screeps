var roleMineHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(!creep.memory.withdraw && _.sum(creep.carry) == 0) {
            creep.memory.withdraw = true;
            creep.say('⚡ withdraw');
        }
        if(creep.memory.withdraw && creep.carry[RESOURCE_UTRIUM] == creep.carryCapacity) {
            creep.memory.withdraw = false;
            creep.say('🔄 deposit');
        }

        if(creep.memory.withdraw) {
            var container = Game.getObjectById(creep.memory.containerId);
            // console.log(container);
            var mineralType = creep.room.mineralType;
            console.log(mineralType);
            if(!container) {
                var containers = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_CONTAINER && structure.store[mineralType] > 0;
                    }
                });
                container = containers[0];
                if(container) {
                    creep.memory.containerId = container.id;
                }
            }

            if(creep.withdraw(container, mineralType) == ERR_NOT_IN_RANGE) {
                creep.moveTo(container, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            // console.log("je rentre");
            var storage = creep.room.storage;
            if(creep.transfer(storage, mineralType) == ERR_NOT_IN_RANGE) {
                creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    }
};

module.exports = roleMineHauler;