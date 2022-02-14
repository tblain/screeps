var roleLRDefMel = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var room = creep.room;
        if (!creep.memory.base_room) {
            creep.memory.base_room = room;
            creep.memory.reptimer = 0;
            creep.memory.harvesting = true;
        }

        creep.memory.reptimer = creep.memory.reptimer-1;

        var base_room = creep.memory.base_room;
        var target = creep.memory.target;

        if (room.name != target) {
            creep.say("out");
            try {
            const route = Game.map.findRoute(room.name, target)
            const exit = creep.pos.findClosestByPath(route[0].exit);
            creep.moveTo(exit, {visualizePathStyle: {stroke: '#ffffff'}});

            } catch (e) {console.log(e)}
        } else {

            let hostile = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
            if(!hostile) {
                hostile = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
            }
            if(hostile) {
                if(creep.attack(hostile) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(hostile, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
              creep.moveTo(room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        }
    },

    //code pour initialiser de facon personnelle la memoire
    initMemory: function(room, argus) {
        var creepName = argus["creepName"]
        var target = argus["target"]

        //init de la memoire
        room.memory.pipelines[target].workers["LRDefMels"].push(creepName);
        room.memory.pipelines[target].workers["LRWorkers"].push(creepName);

        // creation du dicMem
        return {room:argus["room"], roomName:argus["roomName"], role:argus["role"], target:target};
    },

    // code pour clean la memoire
    cleanMem: function(creep, name) {
        var creep_role = creep.role;
        var target = creep.target
        console.log("Death of a:", creep.role, ", named:", name, ", in room:", creep.room)
        try {
            var creep_room = Game.rooms[creep.roomName];
            if (creep_room.memory.pipelines[target].workers["LRDefMels"].includes(name)) {
              creep_room.memory.pipelines[target].workers["LRDefMels"].splice(creep_room.memory.pipelines[target].workers["LRDefMels"].indexOf(name),1);
              creep_room.memory.pipelines[target].workers["LRWorkers"].splice(creep_room.memory.pipelines[target].workers["LRWorkers"].indexOf(name),1);
            }
        } catch(e) {
            console.log(e, "creeproom", creep_room, "creeprole", creep_role, "cleanMem")
        }
    }
};

module.exports = roleLRDefMel;
