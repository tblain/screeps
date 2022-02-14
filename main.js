var roleHarvester = require("role.harvester");
var roleUpgrader = require("role.upgrader");
var roleBuilder = require("role.builder");
var roleHauler = require("role.hauler");
var roleTowerHauler = require("role.towerHauler");
var roleLRHauler = require("role.LRHauler");
var roleLRBasicWorker = require("role.LRBasicWorker");
var roleLRHarvester = require("role.LRHarvester");
var roleLRDefMel = require("role.LRDefMel");
var roleLRClaimer = require("role.LRClaimer");
var roleBasicWorker = require("role.basicWorker");
var roleFighter = require("role.fighter");
var roleMiner = require("role.miner");
var roleMineHauler = require("role.mineHauler");
var rolePowerHauler = require("role.powerHauler");
var roleSmallMele = require("role.small_mele");
var roleClaimer = require("role.claimer");
var roleRHBasicWorker = require("role.RHBasicWorker");
var roleRHHarvester = require("role.RHHarvester");
var roleRHUpgrader = require("role.RHUpgrader");
var tower = require("tower");
var link = require("link");
var terminal = require("terminal");
var spawn_creep = require("spawn_creep");
var remoteMining = require("./remoteMining");

/*----- Début du main -----*/
const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

var print_visual = function(room) {
  var creeps = room.find(FIND_MY_CREEPS);
  var controller = room.controller;
  var progressPerTick = (controller.progress - room.memory.previousProgress);
  var ticksToNextLevel = controller.progress / progressPerTick;
  var text = "Ticks to next level: " + ticksToNextLevel + " | progressPerTick: " + progressPerTick;

  var y = 0
  var i = 0
  room.visual.text(text, 0, y+i*0.6, { align: 'left',opacity: 0.8,size: 0.4}); i++;
  text = "Energy:"+room.energyAvailable+"/"+room.energyCapacityAvailable;
  room.visual.text(text, 0, y+i*0.6, { align: 'left',opacity: 0.8,size: 0.4}); i++;

  var roles = {};
  var allWorkers = []
  for(let creep of creeps) {
    role = creep.memory.role;
    if(!roles[role]) {
      roles[role] = [creep.name];
      allWorkers.push(creep.name);
    } else {
      roles[role].push(creep.name);
      allWorkers.push(creep.name);
    }
  }
  text = "Nb all workers:"+allWorkers.length;
  room.visual.text(text, 0, y+i*0.6, { align: 'left',opacity: 0.8,size: 0.4}); i++;
  Object.entries(roles).forEach(([key, value]) => {
    text = "Nb " + key+":"+value.length;
    room.visual.text(text, 0, y+i*0.6, { align: 'left',opacity: 0.8,size: 0.4}); i++;
  });

  // text = Game.find;

}

module.exports.loop = function() {
  /*----- Def des longs range mining  -----*/

  var pipelines = [
    {base: "W2N5",target: "W2N4"},
    { base: "W2N5", target: "W3N5" },
    {base: "W2N5",target: "W2N6"},
    // { base: "W2N5", target: "W2N3" }
  ];

  roomsToClaim = [
    // {base: "W3N7",target: "W2N8"},
  ]
  roomsToUpgrade = [
    // {base: "W3N7",target: "W2N8"},
  ]

  roomsToAttack = [
    // "W4N5"
  ];

  var controlled_rooms = ["W2N5", "W3N7", "W2N8"];

  for (var i in Game.rooms) {
    // on lance le script pour chaque room
    var room = Game.rooms[i]; // on recupère la room

    if (false || !room.memory.attackers) {
      room.memory.attackers = {}
    }

    if (false || !room.memory.workers) {
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
      if (false) {
        Game.rooms["W2N5"].memory.workers = {
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
        Game.rooms["W3N5"].memory.workers["LRDefMels"] = []

      }
    }

    /*----- On supprime de la mèmoire les creeps morts -----*/
    for (var name in Memory.creeps) {
      if (!Game.creeps[name]) {
        // il faut aussi delete le creep de la memoire de la room
        var creep = Memory.creeps[name];
        var creep_role = creep.role + "s";
        // if (["harvesters", "haulers", "towerHaulers", "builders", "upgraders", "basicWorkers"].includes(creep_role)) {
        eval("role" + capitalize(creep.role) + ".cleanMem(creep, name)");
        // }
         // else {
         //  if (creep != undefined) {
         //    // console.log("role", creep.role)
         //    if (["small_meles"].includes(creep_role)) {
         //      try {
         //        for (var i = roomsToAttack.length - 1; i >= 0; i--) {
         //          var roomToAttack_name = roomsToAttack[i];
         //          if (room == creep.base_room.name) {
         //            if (room.memory.attackers[roomToAttack_name][creep_role].includes(name)) {
         //              room.memory.attackers[roomToAttack_name][creep_role].splice(room.memory.attackers[roomToAttack_name][creep_role].indexOf(name), 1);
         //            }
         //
         //          }
         //        }
         //      } catch (e) {
         //        console.log(e, "attacking")
         //      }
         //    } else {
         //      try {
         //        console.log("room:", creep.room)
         //        var creep_room = Game.rooms[creep.room];
         //        if (creep_room.memory.workers[creep_role].includes(name)) {
         //          creep_room.memory.workers[creep_role].splice(creep_room.memory.workers[creep_role].indexOf(name), 1);
         //          creep_room.memory.workers["workers"].splice(creep_room.memory.workers["workers"].indexOf(name), 1);
         //        }
         //      } catch (e) {
         //        console.log(e, creep_room, creep_role)
         //      }
         //
         //    }
        delete Memory.creeps[name];
        // console.log("Death of ", name);
         //  }

        // }
      }
    }


    if (controlled_rooms.includes(room.name)) {
      var rcl = room.controller.level;
      var controller = room.controller;

      if (!room.memory.previousProgress)
       room.memory.previousProgress = 0;

      print_visual(room);
      room.memory.previousProgress = controller.progress;

      var spawns = room.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_SPAWN,
      }); // on récupère le spawn associé à la room
      for (var i = 0; i < spawns.length; i++) {
        if (!spawns[i].spawning) spawn = spawns[i];
      }
      var spawn = spawns[0];

      if (room.find(STRUCTURE_TOWER) && rcl >= 3) {
        tower.run(room);
      }

      if (room.terminal) {
        terminal.run(room);
      }
      link.run(room);

      var hostiles = room.find(FIND_HOSTILE_CREEPS);
      if (hostiles.length > 0) {
        var fighters = _.filter(
          Game.creeps,
          (creep) => creep.memory.role == "fighter"
        );
        if (fighters.length < hostiles.length * 2) {
          var newName = "fighter" + Game.time;
          spawn_creep.sspawn_creep({
            creepName: newName,
            room: room,
            role: "fighter",
            body: [TOUGH,TOUGH,MOVE,MOVE,MOVE,ATTACK,ATTACK]
          });
          // if((spawn.spawnCreep( [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK], newName, { memory: { role: 'fighter' } }))  == ERR_NOT_ENOUGH_ENERGY) {
          //     spawn.spawnCreep( [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK], newName, { memory: { role: 'fighter' } });
          // }
        }
      }

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
      var builders = room.memory.workers["builders"];
      var upgraders = room.memory.workers["upgraders"];
      var haulers = room.memory.workers["haulers"];
      var towerHaulers = room.memory.workers["towerHaulers"];
      var basicWorkers = room.memory.workers["basicWorkers"];
      var fighters = room.memory.workers["fighters"];
      var workers = room.memory.workers["workers"];
      var RHHarvesters = []
      for (let i = 0; i < roomsToUpgrade.length; i++) {
        var base = roomsToUpgrade[i]["base"];
        var target = roomsToUpgrade[i]["target"];
        if (room.name == target) {
          // console.log(room)
          var base_room = Game.rooms[base];
          RHHarvesters.push(base_room.memory.roomHelping[target].workers["RHHarvesters"]);

        }
      }

      var containers = room.find(FIND_STRUCTURES, {
        filter: (s) => s.structureType == STRUCTURE_CONTAINER,
      });
      // console.log(basicWorkers)

      /*----- spawn des creeps -----*/
      if (spawn) {
        if (false) {} else if ((workers.length < 4) || ((rcl < 5 || !room.storage) && workers.length < 7)) {
          var newName = "basicWorker" + Game.time;
          var status = spawn_creep.sspawn_creep({
            creepName: newName,
            room: room,
            role: "basicWorker",
            body: [WORK, WORK, MOVE, CARRY]
          });
        } else if (haulers.length < room.find(FIND_SOURCES).length && haulers.length < containers.length && haulers.length < harvesters.length) {
          var newName = "Hauler" + Game.time;
          var body = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
          if (spawn_creep.sspawn_creep({
              creepName: newName,
              room: room,
              role: "hauler",
              body: body
            }) == ERR_NOT_ENOUGH_ENERGY)
            spawn_creep.sspawn_creep({
              creepName: newName,
              room: room,
              role: "hauler",
              body: [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE]
            });
          // if (spawn_creep.spawn_creep(newName,room,[MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,],"hauler") == ERR_NOT_ENOUGH_ENERGY) {
          //     spawn_creep.spawn_creep(newName,room,[CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],"hauler");
          // }
        } else if (((rcl >= 3 && towerHaulers.length < 1) || (rcl == 8 && towerHaulers.length < 1)) && room.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_TOWER,
          }).length > 0) {
          // TODO: adapter la taille du creep en fonction des besoins
          var newName = "TowerHauler" + Game.time;
          var body = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, ];
          if (rcl > 5) body.push(MOVE, CARRY, CARRY, CARRY);
          if (rcl > 6) body.push(MOVE, CARRY, CARRY, CARRY);

          // var status = spawn_creep.spawn_creep(newName,room,body,"towerHauler");
          var status = spawn_creep.sspawn_creep({
            creepName: newName,
            room: room,
            role: "towerHauler",
            body: body
          });
        } else if (harvesters.length + RHHarvesters.length < room.find(FIND_SOURCES).length && harvesters.length < containers.length) {
          var newName = "Harvester" + Game.time;
          if (rcl > 4) {
            body = [MOVE, MOVE, WORK, WORK, WORK, WORK, WORK];
          } else if (rcl > 2) {
            body = [MOVE, WORK, WORK, WORK, WORK, WORK];
          } else {
            body = [MOVE, WORK, WORK];
          }

          var status = spawn_creep.sspawn_creep({
            creepName: newName,
            room: room,
            role: "harvester",
            body: body
          });
          // var status = spawn_creep.spawn_creep(newName,room,body,"harvester");
        } else if (builders.length < 2 && room.find(FIND_CONSTRUCTION_SITES).length > 0) {
          // console.log("builder")
          var newName = "Builder" + Game.time;
          var status = spawn_creep.sspawn_creep({
            creepName: newName,
            room: room,
            role: "builder",
            body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, ]
          });
          // var status = spawn_creep.spawn_creep(newName, room, [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, ], "builder");
          if (status == ERR_NOT_ENOUGH_ENERGY) {
            var status = spawn_creep.sspawn_creep({
              creepName: newName,
              room: room,
              role: "builder",
              body: [MOVE, MOVE, MOVE, MOVE, WORK, CARRY, CARRY, CARRY],
            });
            if (status == ERR_NOT_ENOUGH_ENERGY) {
              var status = spawn_creep.sspawn_creep({
                creepName: newName,
                room: room,
                role: "builder",
                body: [MOVE, MOVE, MOVE, MOVE, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, WORK],
              });
            }
          }
        } else if (upgraders.length < 1 || (upgraders.length < 8 && rcl < 5) || (upgraders.length < 2 && rcl < 8)) {
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
          } else {
            if (rcl > 3) {
              body.push([MOVE, WORK, WORK, CARRY, CARRY, CARRY])
            }
          }
          // var status = spawn_creep.spawn_creep(newName, room, body, "upgrader");
          var status = spawn_creep.sspawn_creep({
            creepName: newName,
            room: room,
            role: "upgrader",
            body: body
          });
          // }
        } else if (true) {
          // gestion des claimers
          for (let i = 0; i < roomsToClaim.length; i++) {
            var base = roomsToClaim[i]["base"];
            var target = roomsToClaim[i]["target"];

            if (!room.memory.workers["claimers"].includes("claimer"+base+target)) {
              var status = spawn_creep.sspawn_creep({creepName: "claimer"+base+target,roomName: base,role: "claimer",body:[MOVE, MOVE, CLAIM], target:target})
            } else {
            }
          }

          // on envoie des creeps pour aider a upgrade
          for (let i = 0; i < roomsToUpgrade.length; i++) {
            var base = roomsToUpgrade[i]["base"];
            var target = roomsToUpgrade[i]["target"];
            var base_room = Game.rooms[base];
            var target_room = Game.rooms[target];

            if(base_room.memory.roomHelping == undefined) {
              base_room.memory.roomHelping = {}
            }
            if (base_room.memory.roomHelping[target] == undefined) {
              base_room.memory.roomHelping[target] = {
                workers:{
                  RHHaulers:[],
                  RHHarvesters:[],
                  RHBasicWorkers:[],
                  RHUpgraders:[],
                  RHWorkers:[]
                },
                safe:false
              };
            }
            if (base_room.memory.roomHelping[target].workers["RHBasicWorkers"].length < 4 && target_room.controller.rcl < 2) {
              var status = spawn_creep.sspawn_creep({creepName: "RHBasicWorker" + target + Game.time,room: base_room,role: "RHBasicWorker",body:[MOVE, MOVE, MOVE, WORK, WORK, CARRY], target:target})
            } else if (base_room.memory.roomHelping[target].workers["RHHarvesters"].length < target_room.find(FIND_SOURCES).length) {
              var status = spawn_creep.sspawn_creep({creepName: "RHHarvester" + target + Game.time,room: base_room,role: "RHHarvester",body:[MOVE, MOVE, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK], target:target})
            } else if (base_room.memory.roomHelping[target].workers["RHUpgraders"].length < 4) {
              var body = [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY]
              var status = spawn_creep.sspawn_creep({creepName: "RHUpgrader" + target + Game.time,room: base_room,role: "RHUpgrader",body:body, target:target})
            }

          }

        }

        /*----- Affichage du creep en construction sur le spawn -----*/

        for (let spawn of room.find(FIND_STRUCTURES, { filter: (s) => s.structureType == STRUCTURE_SPAWN })) {
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
      var creep = creeps[name];
      var role = creep.memory.role;

      eval("role" + capitalize(role) + ".run(creep)")
    }

  }



  for (let pipeline of pipelines) {
    // console.log(pipeline["base"], pipeline["target"]);
    var base = pipeline["base"];
    var target = pipeline["target"];
    var target_room = Game.rooms[target];
    var base_room = Game.rooms[base];

    if(base_room.memory.pipelines == undefined) {
      base_room.memory.pipelines = {}
    }
    if (base_room.memory.pipelines[target] == undefined) {
      // console.log("un", target)
      base_room.memory.pipelines[target] = {
        workers:{
          LRClaimers:[],
          LRHaulers:[],
          LRHarvesters:[],
          LRBasicWorkers:[],
          LRDefMels:[],
          LRWorkers:[]
        },
        safe:false
      };
    }
    // console.log(base_room.memory.pipelines[target].workers)
    remoteMining.remoteMine(pipeline)
  }
};
