module.exports = {

    //LINK CODE
    run: function(room) {
        var links = room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_LINK}});
        // console.log("links " + links.length);
        if(links.length > 0){
            // console.log("link existe");
            var linkClose = room.storage.pos.findClosestByRange(links);
            var linkFar = room.find(FIND_STRUCTURES, {
                filter: (i) => {
                    return i.structureType == STRUCTURE_LINK && i.id != linkClose.id }});
            if (linkClose.energy > 10 && linkFar[0].energy < 500) {
                // console.log("link a nrg " + linkFar);
                linkClose.transferEnergy(linkFar[0]);
            }
        }
        
    }
};