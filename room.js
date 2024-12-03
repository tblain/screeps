module.exports = {

    //TOWER CODE
    run: function(room) {
        var creeps = room.find(FIND_MY_CREEPS);

      room.memory.workers = {
        workers: [],
        basicWorkers: [],
        harvesters: [],
        haulers: [],
        upgraders: [],
        builders: [],
        towerHaulers: [],
        powerHaulers: [],
        mineHaulers: [],
        miners: [],
        fighters: [],
        claimers: [],
        LRHaulers: [],
        LRWorkers: [],
        LRHarvesters: [],
        LRDefMels: [],
      };
      
    /*----- On supprime de la mèmoire les creeps morts -----*/
    for(var name in Memory.creeps) {
      if(!Game.creeps[name]) {
          delete Memory.creeps[name];
          console.log('Clearing non-existing creep memory:', name);
      }
  }

    if (controlled_rooms.includes(room.name)) {

      var spawns = room.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_SPAWN,
      }); // on récupère le spawn associé à la room
      for (var i = 0; i < spawns.length; i++) {
        if (!spawns[i].spawning) spawn = spawns[i];
      }
      var spawn = spawns[0];

      var rcl = room.controller.level;

      /*
      BODYPART_COST: {
          "move": 50,
          "work": 100,
          "attack": 80,
          "carry": 50,
          "heal": 250,
          "ranged_attack": 150,
          "tough": 10,
          "claim": 600
      },
      */

      /*----- Récupération de la quantité de creep de chaque role -----*/
      var creeps = room.find(FIND_MY_CREEPS);

      var harvesters = room.memory.workers["harvesters"];
      var nbHarvesters = harvesters.length;

      var builders = room.memory.workers["builders"];
      var nbBuilders = builders.length;

      var upgraders = room.memory.workers["upgraders"];
      var nbUpgraders = upgraders.length;

      var haulers = room.memory.workers["haulers"];
      var nbHaulers = haulers.length;

      var towerHaulers = room.memory.workers["towerHaulers"];
      var nbTowerHaulers = towerHaulers.length;

      var basicWorkers = _.filter(
        creeps,
        (creep) => creep.memory.role == "basicWorker"
      );
      var nbBasicWorkers = Game.getObjectById(room.memory.nbBasicWorkers);
      if (!nbBasicWorkers) {
        nbBasicWorkers = basicWorkers.length;
        room.memory.nbBasicWorkers = nbBasicWorkers;
      }

      var basicWorkers = room.memory.workers["basicWorkers"];
      var nbBasicWorkers = basicWorkers.length;

      var mineHaulers = _.filter(
        creeps,
        (creep) => creep.memory.role == "mineHauler"
      );

      var workers = _.filter(creeps, (creep) => true);
      var nbWorkers = Game.getObjectById(room.memory.nbWorkers);
      if (!nbWorkers) {
        nbWorkers = workers.length;
        room.memory.nbWorkers = nbWorkers;
      };

      var workers = room.memory.workers["workers"];
      var nbWorkers = workers.length;

      var containers = room.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_CONTAINER,
      });

      /*----- spawn des creeps -----*/
      if (spawn) {
        if (false) {}
        else if ((workers.length < 2) || ((rcl < 5 || !room.storage) && workers.length < 7)) {
          console.log("test")
          var newName = "worker" + Game.time;
          var status = spawn_creep.spawn_creep(newName, room, [WORK, WORK, MOVE, CARRY], "basicWorker");
        } else if (haulers.length < room.find(FIND_SOURCES).length && haulers.length < containers.length && haulers.length < harvesters.length) {
          var newName = "Hauler" + Game.time;
          var body = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
          if (spawn_creep.spawn_creep({
              creepName: newName,
              room: room,
              role: "hauler",
              body: body
            }) == ERR_NOT_ENOUGH_ENERGY)
            spawn_creep.spawn_creep({
              creepName: newName,
              room: room,
              role: "hauler",
              body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE]
            });
        } else if (((rcl >= 3 && towerHaulers.length < 1) || (rcl == 8 && towerHaulers.length < 1)) && room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_TOWER,
          }).length > 0) {
          // TODO: adapter la taille du creep en fonction des besoins
          var newName = "TowerHauler" + Game.time;
          var body = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, ];
          if (rcl > 5) body.push(MOVE, CARRY, CARRY, CARRY);
          if (rcl > 6) body.push(MOVE, CARRY, CARRY, CARRY);

          // var status = spawn_creep.spawn_creep(newName,room,body,"towerHauler");
          var status = spawn_creep.spawn_creep({
            creepName: newName,
            room: room,
            role: "towerHauler",
            body: body
          });
        } else if (harvesters.length < room.find(FIND_SOURCES).length && harvesters.length < containers.length) {
          var newName = "Harvester" + Game.time;
          if (rcl > 4) {
            body = [MOVE, MOVE, WORK, WORK, WORK, WORK, WORK];
          } else if (rcl > 2) {
            body = [MOVE, WORK, WORK, WORK, WORK, WORK];
          } else {
            body = [MOVE, WORK, WORK];
          }

          var status = spawn_creep.spawn_creep({
            creepName: newName,
            room: room,
            role: "harvester",
            body: body
          });
          // var status = spawn_creep.spawn_creep(newName,room,body,"harvester");
        } else if (builders.length < 2 && room.find(FIND_CONSTRUCTION_SITES).length > 0) {
          // console.log("builder")
          var newName = "Builder" + Game.time;
          var status = spawn_creep.spawn_creep(newName, room, [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, ], "builder");
          if (status == ERR_NOT_ENOUGH_ENERGY) {
            spawn_creep.spawn_creep(
              newName,
              room,
              [MOVE, MOVE, MOVE, MOVE, WORK, CARRY, CARRY, CARRY],
              "builder"
            );
          }
        } else if (upgraders.length < 1 || (upgraders.length < 4 && rcl < 4) || (upgraders.length < 2 && rcl < 8)) {
          var newName = "Upgrader" + spawn + Game.time;
          var body = [MOVE, WORK, WORK, CARRY, CARRY, CARRY];

          if (room.storage) {
            var l = Math.floor(room.storage.store[RESOURCE_ENERGY] / 15000);
            var cost = 550;

            max = 15;
            if (rcl == 8 && l > max) l = max;

            if (l > 50) l = 50;

            // console.log("spawn " + spawn)
            for (var i = l; i > 0 && l > 6 && cost + 150 < room.energyAvailable; i--) {
              body.push(WORK);
              cost += 100;
              l--;
              if (i % 7 == 0 && l > 0) {
                body.push(MOVE);
                cost += 50;
                l--;
              } else if (i % 6 == 0 && l > 0) {
                body.push(CARRY);
                cost += 50;
                l--;
              }
            }
          }
          var status = spawn_creep.spawn_creep(newName, room, body, "upgrader");
          // }
        } else if (false) {
          // Ici on s'occupe de miner des salls adjacents

          for (var i = pipelines.length - 1; i >= 0; i--) {
            var pipeline = pipelines[i];
            var base = pipeline["base"];
            var target = pipeline["target"];
            var target_room = Game.rooms[target];
            var current_room = room;
            var spawn = spawns[0];

            if (room.name == base) {
              // si aucun spawn dispo
              if (true && spawn != -1) {
                // var LRDefMels = target_room.memory.workers["LRDefMels"];
                // var nbLRDefMels = 1;
                // if (nbLRDefMels < 1) {
                //     var status = spawn_creep.spawn_creep("LRDefMel" + Game.time, room,[TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK],"LRDefMel",target_room);
                //     console.log("status", status)
                // }

                // on regarde si le claimer existe, et il faut qu'y en ai tout le temps
                if (timer_spawn == undefined) {
                  timer_spawn = 0
                }
                timer_spawn = timer_spawn - 1
                if (target_room == undefined && timer_spawn <= 0) {
                  var body = [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK]
                  // console.log("defmels", target_room)
                  var status = spawn_creep.spawn_creep("LRDefMel" + Game.time, room, body, "LRDefMel", target);
                  var timer_spawn = 300;
                  console.log(status)


                } else {
                  var LRDefMels = target_room.memory.workers["LRDefMels"];
                  var nbLRDefMels = LRDefMels.length;
                  var hostiles = room.find(FIND_HOSTILE_CREEPS);

                  if (nbLRDefMels < hostiles.length || nbLRDefMels < 1) {
                    if (hostiles.length == 0) {
                      // on fait juste un spawn un petit creep pour tempo
                      body = [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK]
                      // console.log(body)
                    } else {
                      body = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ]
                    }
                    var status = spawn_creep.spawn_creep("LRDefMel" + Game.time, room, body, "LRDefMel", target);
                    // console.log("status", status)
                  }

                }

                if (target_room != undefined && (target_room.controller.reservation == undefined || target_room.controller.reservation == "Jausejoestar")) {
                  var claimer = Game.creeps["claimer" + target];
                  if (claimer == undefined) {
                    var status = spawn_creep.spawn_creep("claimer" + target, room, [MOVE, MOVE, MOVE, CLAIM, CLAIM, CLAIM], "claimer", target);
                    // console.log("status:", status)
                  } else if (!claimer.memory.reserving) {
                    // console.log(claimer)
                    current_room = claimer.room;

                    if (current_room.name != target) {
                      claimer.say("out");
                      const route = Game.map.findRoute(current_room.name, target);
                      const exit = claimer.pos.findClosestByRange(route[0].exit);
                      claimer.moveTo(exit);
                    } else {
                      claimer.say("in");
                      var controller = target_room.controller;

                      if (claimer.reserveController(controller) == ERR_NOT_IN_RANGE) {
                        claimer.moveTo(controller, {
                          visualizePathStyle: {
                            stroke: "#ffaa00",
                          },
                        });
                      } else {
                        claimer.memory.reserving = true;
                      }
                    }
                  } else {
                    // on continue a reserver la salle
                    var status = claimer.reserveController(target_room.controller);

                    // on fait spawner une escouade
                    // console.log("Gestion escouade")

                    // console.log(target)
                    // C'est la deche y a rien dans la salle ducoup on envoie des workers simples
                    var LRWorkers = target_room.memory.workers["LRWorkers"];
                    var nbLRWorkers = LRWorkers.length;

                    var LRHarvesters = target_room.memory.workers["LRHarvesters"];
                    var nbLRHarvesters = LRHarvesters.length;

                    var LRHaulers = target_room.memory.workers["LRHaulers"];
                    var nbLRHaulers = LRHaulers.length;
                    // console.log(nbLRHarvesters, nbLRWorkers)


                    var target_containers = target_room.find(FIND_STRUCTURES, {
                      filter: (s) => s.structureType == STRUCTURE_CONTAINER,
                    });
                    // console.log(nbLRWorkers, 2 - nbHarvesters, nbLRHarvesters)
                    if (false) {} else if (nbLRWorkers < 2 - nbLRHarvesters) {
                      // console.log("test")
                      var status = spawn_creep.spawn_creep("LRWorker" + Game.time, room, [MOVE, MOVE, MOVE, WORK, WORK, CARRY], "LRWorker", target);
                      // console.log(status)
                      // } else if (nbLRHarvesters < 1) {
                    } else if (nbLRHarvesters < target_room.find(FIND_SOURCES).length) {
                      var status = spawn_creep.spawn_creep("LRHarvester" + Game.time, room, [MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK], "LRHarvester", target);
                      // console.log(status)
                    } else if (nbLRHaulers < target_room.find(FIND_SOURCES).length * 2 && nbLRHaulers < target_containers.length) {
                      body = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
                      var status = spawn_creep.spawn_creep("LRHauler" + Game.time, room, body, "LRHauler", target);
                      // console.log(status)
                    }

                  }
                }
              }
            }
          }

          // var body = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY];
          // var newName = 'LRHauler_'+ room.name + "_" + Game.time;
          // // spawn.spawnCreep( body, newName, { memory: { role: 'longRangeHauler' ,  room: room.id } });
          // var status = spawn_creep.spawn_creep(newName, room, body, 'LRHauler', role);
        } else if (
          rcl >= 6 &&
          miners.length < 1 &&
          room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_EXTRACTOR,
          }).length > 0
        ) {
          var newName = "miner" + Game.time;
          // spawn.spawnCreep( [MOVE, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], newName, { memory: { role: 'miner' ,  room: room.id } });
        } else if (
          rcl >= 6 &&
          mineHaulers.length < 1 &&
          room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_EXTRACTOR,
          }).length > 0
        ) {
          var newName = "mineHauler" + Game.time;
          // spawn.spawnCreep( [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], newName, { memory: { role: 'mineHauler' ,  room: room.id } });
        }

        /*----- Affichage du creep en construction sur le spawn -----*/

        var spawns = room.find(FIND_STRUCTURES, {
          filter: (s) => s.structureType == STRUCTURE_SPAWN
        });
        for (let spawn of spawns) {
          if (spawn.spawning) {
            var spawningCreep = Game.creeps[spawn.spawning.name];
            // console.log(spawn.spawning.name);
            // console.log(spawningCreep);
            room.visual.text(
              '🛠️' + spawningCreep.memory.role,
              spawn.pos.x + 1,
              spawn.pos.y, {
                align: 'left',
                opacity: 0.8
              });
          }

        }

      }
    }

    /*----- Assignement des taches des creeps par rapport à leur role -----*/
    var creeps = room.find(FIND_MY_CREEPS);
    for (var name in creeps) {
      // console.log(name)
      var creep = creeps[name];
      var role = creep.memory.role;

      eval("role" + capitalize(role) + ".run(creep)");
    }
    }
};