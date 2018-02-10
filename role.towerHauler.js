var roleTowerHauler = {

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
            // console.log("dans towerhauler " + creep.memory.withdraw);
            // console.log("en train de withdraw");
            var container = creep.room.storage;
            
            if(!creep.room.storage) {
                containersWithEnergy = creep.room.find(FIND_STRUCTURES, {
                filter: (i) => {
                    return (i.structureType == STRUCTURE_CONTAINER &&
                            i.store[RESOURCE_ENERGY] > 0)}});
                container = creep.pos.findClosestByPath(containersWithEnergy);
            }
            if(container) {
                if(creep.withdraw(creep.room.storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.storage, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else if(!creep.memory.withdraw) {
            // console.log("commence ");
            var towers = creep.room.find(FIND_STRUCTURES, {
                filter: (i) => {
                    return (i.structureType == STRUCTURE_TOWER &&
                            i.energy < i.energyCapacity)}});
            tower = towers[0];
             for(var i in towers) {
                towerTmp = towers[i];
                // console.log(container);
                if(tower.energy > towerTmp.energy) {
                    tower = towerTmp;
                }
            }
            
            if(tower && creep.carry.energy > 0) {
                // console.log("dans depo tower");
                if(creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(tower, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else if(!tower) {
                console.log("link");
                link = creep.room.find(FIND_STRUCTURES, {
                filter: (i) => {
                    return (i.structureType == STRUCTURE_LINK &&
                            i.energy < i.energyCapacity)}});
                if(link) {
                    creep.transfer(link[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE
                }
            } else {
                creep.memory.withdraw = true;
            }
        }
    }
};

module.exports = roleTowerHauler;