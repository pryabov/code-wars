var DIRECTIONS = Object.freeze({
    TOP: 0,
    RIGHT: 90,
    BOTTOM: 180,
    LEFT: 270
});

var COMMANDS = Object.freeze({
    TURN_RIGHT: 'r',
    TURN_LEFT: 'l',
    MOVE_FORWARDS: 'f'
});

function Queue(){
    var self = this;

    this.queue = [];

    this.push = function(value){
        self.queue.unshift(value);

        self.queue.sort(function(cellA, cellB) {
            return cellB.path.length - cellA.path.length;
        });
    };

    this.pop = function(){
        return self.queue.pop();
    };
}


function CellNeighbor(neighboar, direction){
    this.direction = direction;
    this.cell = neighboar;
}

function Cell(value){
    this.cellValue = value;
    this.direction = undefined;
    this.path = [];
    this.iteration = undefined;

    this.neighbors = [];
}

function Field(initialStr){
    var self = this;

    this.capacity = Math.sqrt(initialStr.length);
    this.cells = new Array(this.capacity);

    this.startCell = undefined;
    this.finishCell = undefined;

    for(var i = 0; i < this.capacity; i++){
        var newLine = new Array(this.capacity);

        for(var j = 0; j < this.capacity; j++){
            var currentCellValue = initialStr[i * this.capacity + j];
            newLine[j] = new Cell(initialStr[i * this.capacity + j]);

            if(currentCellValue === 'S'){
                self.startCell = newLine[j];
            } else if(currentCellValue === 'T') {
                self.finishCell = newLine[j];
            }

            if(currentCellValue !== '#') {
                if (j > 0 && newLine[j - 1].cellValue !== '#') {
                    newLine[j].neighbors.push(new CellNeighbor(newLine[j - 1], DIRECTIONS.LEFT));
                    newLine[j - 1].neighbors.push(new CellNeighbor(newLine[j], DIRECTIONS.RIGHT));
                }
                if (i > 0 && this.cells[i - 1][j].cellValue !== '#') {
                    newLine[j].neighbors.push(new CellNeighbor(this.cells[i - 1][j], DIRECTIONS.TOP));
                    this.cells[i - 1][j].neighbors.push(new CellNeighbor(newLine[j], DIRECTIONS.BOTTOM));
                }
            }
        }

        this.cells[i] = newLine;
    }
}

function Processor(fieldForCalcs, power){
    var self = this;

    this.field = new Field(fieldForCalcs);
    this.power = power;

    this.queue = new Queue();

    this.calculate = function(){
        self.field.startCell.iteration = 0;
        self.queue.push(self.field.startCell);

        var currentCell = self.queue.pop();

        while(currentCell && currentCell.iteration <= self.power)
        {
            var currentDirection = currentCell.direction || DIRECTIONS.TOP;
            currentCell.neighbors.forEach(function(neighbor){
                var resultedPath = self.calculateRotation(currentDirection, neighbor.direction);
                resultedPath.push(COMMANDS.MOVE_FORWARDS);
                resultedPath = currentCell.path.concat(resultedPath);

                var neighborCell = neighbor.cell;
                if(neighborCell.path.length === 0 ||neighborCell.path.length > resultedPath.length){
                    neighborCell.path = resultedPath.slice();
                    neighborCell.iteration = currentCell.iteration + 1;
                    neighborCell.direction = neighbor.direction;

                    self.queue.push(neighborCell);
                }
            });

            currentCell = self.queue.pop();
        }

        if(self.field.finishCell.path && self.field.finishCell.path.length <= self.power) {
            return self.field.finishCell.path;
        }
        return [];
    };

    this.calculateRotation = function(currentDirection, targetDirection){
        var resultedDegrees = Math.abs(targetDirection - currentDirection);
        if(360 - resultedDegrees < resultedDegrees)
        {
            resultedDegrees = - (360 - resultedDegrees);
        }

        var rotationDirection = COMMANDS.TURN_RIGHT;
        if(resultedDegrees < 0){
            rotationDirection = COMMANDS.TURN_LEFT;
        }

        var countOrRotations = resultedDegrees / 90;
        var result = [];
        for(var i = 0; i < countOrRotations; i++){
            result.push(rotationDirection);
        }
        return result;
    };
}

function getCommands(field, power) {
    var processor = new Processor(field, power);
    var result = processor.calculate();
    return result;
}


//getCommands('T.S.', 10).join('') == 'f';
getCommands('S.......T', 10).join('') == 'rffrff';
getCommands('S.......T', 5).join('') == '';
getCommands('S#.##...T', 20).join('') == '';
