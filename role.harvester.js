

var find_source = function(creep, containers) {
    var harvestersToAvoid = _.filter(creep.room.find(FIND_MY_CREEPS), (harvester) => harvester.memory.role == 'harvester' && harvester.id != creep.id);
    var sources = creep.room.find(FIND_SOURCES_ACTIVE);
    var source = undefined

    // on regarde si il y a un autre harvester
    if(harvestersToAvoid[0]) {
        for (var i = sources.length - 1; i >= 0; i--) {
            let sourcePotentielle = sources[i];
            let container = sourcePotentielle.pos.findClosestByRange(containers);
            // console.log("container: " + container.pos + " harvest : " + harvestersToAvoid[0].pos);
            if(!container.pos.isEqualTo(harvestersToAvoid[0].pos))
                source = sourcePotentielle;
                if (source != undefined) {
                    // console.log("on prend la source libre : " + source.pos);
                    creep.memory.sourceId = source.id

                }


        }

    } else {
        source = creep.pos.findClosestByPath(sources);
    }

    return source
}

var roleHarvester = {

  /** @param {Creep} creep **/
  run: function(creep) {
      /*-----  -----*/
      var source = Game.getObjectById(creep.memory.sourceId); // on récupère dans la mémoire la source associé au creep s'il elle existe
      var containers = creep.room.find(FIND_STRUCTURES, {filter: (i) => { return i.structureType == STRUCTURE_CONTAINER}});
      creep.say("Deposit");
      if(!source) {
          // console.log
          // s'il n'a pas de source on lui en fournit une
          var source = find_source(creep, containers);
      }

      if(source != undefined){
          // console.log(source)
          // creep.moveTo(source.pos.findClosestByRange(containers), {visualizePathStyle: {stroke: '#ffaa00'}});
          // console.log(source.pos.findClosestByRange(containers).pos.lookFor(LOOK_CREEPS)[0].name == creep.name)
          if (source.pos.findClosestByRange(containers).pos.lookFor(LOOK_CREEPS).length > 0) {
              if (source.pos.findClosestByRange(containers).pos.lookFor(LOOK_CREEPS)[0].name != creep.name) {
                  // console.log("deja pris")
                  var source = find_source(creep, containers)
              }
          }
          if(creep.pos.isEqualTo(source.pos.findClosestByRange(containers).pos)) { // si le creep n'est pas à porté de la source il avance vers elle
              creep.harvest(source);
          } else {
              creep.moveTo(source.pos.findClosestByRange(containers), {visualizePathStyle: {stroke: '#ffaa00'}});
          }
      }
  },
  //code pour initialiser de facon personnelle la memoire
  initMemory: function(room, argus) {
      var creepName = argus["creepName"]

      //init de la memoire
      room.memory.workers["harvesters"].push(creepName);
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
        if (creep_room.memory.workers["harvesters"].includes(name)) {
            creep_room.memory.workers["harvesters"].splice(creep_room.memory.workers["harvesters"].indexOf(name),1);
            creep_room.memory.workers["workers"].splice(creep_room.memory.workers["workers"].indexOf(name),1);
        }
    } catch(e) {
        console.log(e, "creeproom", creep_room, "creeprole", creep_role, "cleanMem")
    }
  }
};

module.exports = roleHarvester;


// var roleHarvester = {
//     /** @param {Creep} creep **/
//     run: function(creep) {
//         // if(!creep.memory.harvest && creep.carry.energy == 0) {
//         //     creep.memory.harvest = true;
//         //     creep.say("Harvest");
//         // } else if (creep.memory.harvest && creep.carry.energy == creep.carryCapacity) {
//         //     creep.memory.harvest = false;
//         //     creep.say("Transfere");
//         // }

//         // if(true | creep.memory.harvest) {
//             // console.log("creep " + creep.name);
//             /*----- spawn des creeps -----*/
//             var source = Game.getObjectById(creep.memory.sourceId);

//             if(!source) {
//                 source = creep.pos.findClosestByPath(FIND_SOURCES);
//                 // console.log(source);
//                 creep.memory.sourceId = source.id;
//             }
//                 //console.log("creep " + creep.name + "source " + source);

//             if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
//                 creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
//             }
//         // } else if(false && !creep.memory.harvest) {
//         //     var containerNotFull = creep.pos.findClosestByPath(FIND_STRUCTURES, {
//         //         filter: (i) => {
//         //             return (i.structureType == STRUCTURE_CONTAINER &&
//         //                     i.store[RESOURCE_ENERGY] < i.storeCapacity)}});
//         //     if(containerNotFull && creep.carry.energy > 0) {
//         //         if(creep.transfer(containerNotFull, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
//         //             creep.moveTo(containerNotFull, {visualizePathStyle: {stroke: '#ffffff'}});
//         //         }
//         //     }
//         // }
//     }
// };

// module.exports = roleHarvester;
