var roleLRHauler = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var room = creep.room;
        if (!creep.memory.base_room) {
            creep.memory.base_room = room;
            creep.memory.temps = 0
        }
        var base_room = creep.memory.base_room;
        var target = creep.memory.target;


        if (creep.memory.returning) {
            if(creep.carry.energy == 0) {
                creep.memory.returning = false;
                creep.say('🔄 Going');
                console.log("temps:", creep.memory.temps, "energyReturning:", creep.memory.energyReturning, creep.memory.energyReturning/creep.memory.temps, "target:", target)
                creep.memory.temps = 0;
            }
            creep.memory.temps++;
            creep.say("returning")
            // console.log(creep.memory.returning)
            if (room.name != base_room.name) {
                creep.say("out");
                const route = Game.map.findRoute(room.name, base_room.name)
                const exit = creep.pos.findClosestByPath(route[0].exit);
                // console.log(route[0].exit, exit)
                creep.moveTo(exit, {visualizePathStyle: {stroke: '#ffffff'}});
            } else {
                var targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION ||
                            structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
                    }
                });
                targets = undefined

                if(!targets) {
                    targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (i) => {
                        return (i.structureType == STRUCTURE_STORAGE && i.store[RESOURCE_ENERGY] < i.storeCapacity && (false && creep.room.controller.level < 8 || i.store[RESOURCE_ENERGY] < 300000))}});
                    // console.log('test ' + targets);
                }

                if(targets.length == 0) {
                    targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity;
                    }
                });
                }

                if(targets.length > 0) {
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        } else {
            creep.memory.temps++;

            if (room.name != target) {
                creep.say("out");
                // console.log(room.name, target)
                const route = Game.map.findRoute(room.name, target)
                const exit = creep.pos.findClosestByPath(route[0].exit);
                // console.log(route[0].exit, exit)
                creep.moveTo(exit, {visualizePathStyle: {stroke: '#ffffff'}});
                creep.memory.timer = 0; // timer pour dire au creep de retourner a la base si attend trop
            } else {
                creep.say("in");

                if(creep.carry.energy == creep.carryCapacity || creep.memory.timer > 200) {
                    creep.say('⚡ returning');
                    creep.memory.returning = true
                    creep.memory.energyReturning = creep.carryCapacity
                } else {
                  var dropped_energy = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES)
                  if(dropped_energy) {
                    if(creep.pickup(dropped_energy) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(dropped_energy, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                  } else {
                    var containerWithEnergy = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (i) => {
                            return (i.structureType == STRUCTURE_CONTAINER &&
                                    i.store[RESOURCE_ENERGY] > 0)}});
                    if(containerWithEnergy) {
                        if(creep.withdraw(containerWithEnergy, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(containerWithEnergy, {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    } else {
                      var container = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                          filter: (i) => {
                              return (i.structureType == STRUCTURE_CONTAINER)}});
                      if(container) {
                        creep.moveTo(container, {visualizePathStyle: {stroke: '#ffffff'}});
                      }
                    }
                  }


                }
            }

        }
    },

    //code pour initialiser de facon personnelle la memoire
    initMemory: function(room, argus) {
        var creepName = argus["creepName"]
        var target = argus["target"]

        //init de la memoire
        room.memory.pipelines[target].workers["LRHaulers"].push(creepName);
        room.memory.pipelines[target].workers["LRWorkers"].push(creepName);

        // creation du dicMem
        return {room:argus["room"], roomName:argus["roomName"], role:argus["role"], target:target};
    },

    // code pour clean la memoire
    cleanMem: function(creep, name) {
        var creep_role = creep.role;
        var target = creep.target
        console.log("Death of a:", creep.role, ", named:", name, ", in room:", creep.room);
        try {
            var creep_room = Game.rooms[creep.roomName];
            creep_room.memory.pipelines[target].workers["LRHaulers"].splice(creep_room.memory.pipelines[target].workers["LRHaulers"].indexOf(name),1);
            creep_room.memory.pipelines[target].workers["LRWorkers"].splice(creep_room.memory.pipelines[target].workers["LRWorkers"].indexOf(name),1);
        } catch(e) {
            console.log(e, "creeproom", creep_room, "creeprole", creep_role, "cleanMem")
        }
    }
};

module.exports = roleLRHauler;
