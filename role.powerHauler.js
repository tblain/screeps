var rolePowerHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if(!creep.memory.withdraw && creep.carry.power == 0) {
            creep.memory.withdraw = true;
            creep.say("Withdraw");
        } else if (creep.memory.withdraw && creep.carry.power == creep.carryCapacity) {
            creep.memory.withdraw = false;
            creep.say("Deposit");
        }

        if(creep.memory.withdraw) {
            var terminal = creep.room.terminal;
            if(terminal.store[RESOURCE_POWER] > 0) {
                if(creep.withdraw(terminal, RESOURCE_POWER) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(terminal, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else { 
                creep.moveTo(Game.spawns[creep.room]);
            }
        } else if(!creep.memory.withdraw) {
            // console.log("commence ");
            var spawn = creep.room.find(FIND_STRUCTURES, {
                filter: (i) => {
                    return (i.structureType == STRUCTURE_POWER_SPAWN && i.power < i.powerCapacity)}})[0];
            // console.log(spawn);
            spawn = creep.room.storage;
            if(spawn && creep.carry.power > 0) {
                if(creep.transfer(spawn, RESOURCE_POWER) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                creep.memory.withdraw = true;
            }
        }
    }
};


module.exports = rolePowerHauler;
