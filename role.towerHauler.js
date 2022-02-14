var roletowerHaulers = {

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
            var container = creep.room.terminal;

            if(!container || container.store[RESOURCE_ENERGY] < 1) {
                container = creep.room.storage;
            }

            if(!container) {
                containersWithEnergy = creep.room.find(FIND_STRUCTURES, {filter: (i) => {return (i.structureType == STRUCTURE_CONTAINER && i.store[RESOURCE_ENERGY] > 0)}});
                container = creep.pos.findClosestByPath(containersWithEnergy);
            }


            if(container) {
                if(creep.withdraw(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(container, {visualizePathStyle: {stroke: '#faffaa'}});
                }
            }
        } else if(!creep.memory.withdraw) {
            var towers = creep.room.find(FIND_STRUCTURES, {filter: (i) => {return (i.structureType == STRUCTURE_TOWER &&i.energy < i.energyCapacity - 200)}});
            tower = towers[0];
             for(let towerTmp of towers) {
                if(tower.energy > towerTmp.energy) {
                    tower = towerTmp;
                }
            }

            if(tower && creep.carry.energy > 0) {
                if(creep.transfer(tower, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(tower, {visualizePathStyle: {stroke: '#ffffff'}});
                }

            } else if(!tower) {
                var links = creep.room.find(FIND_STRUCTURES, {
                    filter: (i) => {
                        return (i.structureType == STRUCTURE_LINK)}});


                if(links.length > 0) {
                    var linkClose = creep.room.controller.pos.findClosestByRange(links);
                    var linkFar = creep.room.find(FIND_STRUCTURES, {filter: (i) => {return i.structureType == STRUCTURE_LINK && i.id != linkClose.id && i.energy < 800}});
                    container = creep.pos.findClosestByRange(linkFar);
                }

                if (creep.room.storage && !container) {
                    var room = creep.room;
                    var terminal = room.terminal;
                    var storage = room.storage;
                    if(room.controller.level < 8) {
                        container = storage;
                    } else if(terminal && _.sum(storage.store) < storage.storeCapacity) {
                        container = terminal;
                    }
                }

                if(container) {
                    if(creep.transfer(container, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
                }

            } else {
                creep.memory.withdraw = true;
            }
        }
    },

    //code pour initialiser de facon personnelle la memoire
    initMemory: function(room, argus) {
        var creepName = argus["creepName"]

        //init de la memoire
        room.memory.workers["towerHaulers"].push(creepName);
        room.memory.workers["workers"].push(creepName);

        // creation du dicMem
        return {room:argus["room"], roomName:argus["roomName"], role:argus["role"]};
    },

    // code pour clean la memoire
    cleanMem: function(creep, name) {
        var creep_role = creep.role;
        console.log("Death of a:", creep.role, ", named:", name, ", in room:", creep.room);
        try {
            var creep_room = Game.rooms[creep.roomName];
            if (creep_room.memory.workers["towerHaulers"].includes(name)) {
                creep_room.memory.workers["towerHaulers"].splice(creep_room.memory.workers["towerHaulers"].indexOf(name),1);
                creep_room.memory.workers["workers"].splice(creep_room.memory.workers["workers"].indexOf(name),1);
            }
        } catch(e) {
            console.log(e, "creeproom", creep_room, "creeprole", creep_role, "cleanMem")
        }

        delete Memory.creeps[name];
    }
};

module.exports = roletowerHaulers;
