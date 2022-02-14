var roleFighter = {

    /** @param {Creep} creep **/
    run: function(creep) {
        let target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        if(!target) {
            target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
        }
            // console.log(target);
        if(target) {
            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            creep.moveTo(Game.flags["Invasion1"], {visualizePathStyle: {stroke: '#ffffff'}});
        }

    },

    //code pour initialiser de facon personnelle la memoire
    initMemory: function(room, argus) {
        var creepName = argus["creepName"]

        //init de la memoire
        room.memory.workers["fighters"].push(creepName);

        // creation du dicMem
        return {room:argus["room"], roomName:argus["roomName"], role:argus["role"]};
    },

    // code pour clean la memoire
    cleanMem: function(creep, name) {
        var creep_role = creep.role;
        try {
          console.log("Death of a:", creep.role, ", named:", name, ", in room:", creep.room);
            var creep_room = Game.rooms[creep.roomName];
            if (creep_room.memory.workers["fighters"].includes(name)) {
                creep_room.memory.workers["fighters"].splice(creep_room.memory.workers["fighters"].indexOf(name),1);
            }
        } catch(e) {
            console.log(e, creep_room, creep_role, "cleanMem")
        }

        delete Memory.creeps[name];
        console.log("Death of ", name);
    }
};

module.exports = roleFighter;
