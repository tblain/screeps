var roleHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(!creep.memory.withdraw && creep.carry.energy == 0) {
            creep.memory.withdraw = true;
            creep.say("Withdraw");
        } else if (creep.memory.withdraw && creep.carry.energy == creep.carryCapacity) {
            creep.memory.withdraw = false;
            creep.say("Deposit");
        }
        
        if(creep.memory.withdraw) {
            // console.log("en train de withdraw");
            var containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
                filter: (i) => {
                    return (i.structureType == STRUCTURE_CONTAINER &&
                            i.store[RESOURCE_ENERGY] > 0)}});
            
            var containerWithEnergy = containersWithEnergy[0];
            for(var i in containersWithEnergy) {
                container = containersWithEnergy[i];
                // console.log(container);
                if(container.store[RESOURCE_ENERGY] > containerWithEnergy.store[RESOURCE_ENERGY]) {
                    containerWithEnergy = container;
                }
            }
            if(containerWithEnergy) {
                if(creep.withdraw(containerWithEnergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(containerWithEnergy, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                var storage = creep.room.storage;
                if(false) {
                    if(creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(storage, {visualizePathStyle: {stroke: '#ffffff'}});
                        
                    }
                } else{ 
                    creep.moveTo(Game.spawns[creep.room]);
                }
            }
        } else if(!creep.memory.withdraw) {
            // console.log("commence ");
            var structureToRefill = creep.pos.findClosestByPath(creep.room.find(FIND_STRUCTURES, {
                filter: (i) => {
                    return ((i.structureType == STRUCTURE_EXTENSION | i.structureType == STRUCTURE_SPAWN) &&
                            i.energy < i.energyCapacity)}}));                      

            if(!structureToRefill) {
                structureToRefill = creep.pos.findClosestByPath(creep.room.find(FIND_STRUCTURES, {
                filter: (i) => {
                    return (i.structureType == STRUCTURE_STORAGE && i.store[RESOURCE_ENERGY] < i.storeCapacity)}}));     
                // console.log('test ' + structureToRefill);
            }

            if(structureToRefill && creep.carry.energy > 0) {
                if(creep.transfer(structureToRefill, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(structureToRefill, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                creep.memory.withdraw = true;
            }
        }
    }
};


module.exports = roleHauler;