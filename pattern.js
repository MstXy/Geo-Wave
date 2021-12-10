class Pattern {
  constructor(width, height, margin, slowness) {
    this.width = width;
    this.height = height;
    this.margin = margin;
    this.slowness = slowness;
    this.updateRange = 0;
    this.updateSet = new Set();
    this.finish = true;

    // initialize geometry field
    this.field = Array(Math.floor(this.height/this.margin)+1);
    for (var i = 0; i < this.field.length; i++) {
      this.field[i] = Array(Math.floor(this.width/this.margin)+1);
      for (var j = 0; j < this.field[i].length; j++) {
        this.field[i][j] = new Geo(i, j, this.margin);
      }
    }
  }

  display(n) {
    for (var i = 0; i < this.field.length; i++) {
      for (var j = 0; j < this.field[i].length; j++) {
        this.field[i][j].display(n);
      }
    }
  }

  update(cx, cy, type) {
    if (this.updateRange == 0) {
      this.updateSet.add(this.field[cx][cy]);
    }
    if (!this.finish) {
      this.updateRange++;
      // update updateset
      if (this.updateRange%this.slowness == 0) {
        let newUpdateArray = [];
        this.updateSet.forEach(key => {
          let neighbor = this.findNeighbor(key.ix, key.iy);

          for (var i = 0; i < neighbor.length; i++) {
            if (neighbor[i]) { // if not undefined, i.e. out of range.
              newUpdateArray.push(neighbor[i]);
            }
          }
        })
        for (var i = 0; i < newUpdateArray.length; i++) {
          this.updateSet.add(newUpdateArray[i]);
        }
      }
      // for every element in update set, update.
      this.updateSet.forEach(key => {
        key.update(type);
      })

      // check whether all are finished.
      var allFinish = true;
      for (var i = 0; i < this.field.length; i++) {
        for (var j = 0; j < this.field[0].length; j++) {
          allFinish = allFinish && this.field[i][j].finish;
        }
      }
      this.finish = allFinish;
    }
  }

  findNeighbor(x, y) {
    let returnArray = [this.field[x][y-1],this.field[x][y+1]]; // this row

    if (x%2 == 0) { // even rows, no shift
      // upper row
      if (this.field[x-1]) {
        returnArray.push(this.field[x-1][y-1]);
        returnArray.push(this.field[x-1][y]);
      }
      // lower row
      if (this.field[x+1]) {
        returnArray.push(this.field[x+1][y-1]);
        returnArray.push(this.field[x+1][y]);
      }
    } else { // odd rows, shift
      // upper row
      if (this.field[x-1]) {
        returnArray.push(this.field[x-1][y+1]);
        returnArray.push(this.field[x-1][y]);
      }
      // lower row
      if (this.field[x+1]) {
        returnArray.push(this.field[x+1][y+1]);
        returnArray.push(this.field[x+1][y]);
      }
    }
    return returnArray;
  }

  test() {
    for (var i = 0; i < this.field.length; i++) { //rows
      for (var j = 0; j < this.field[i].length; j++) { //cols
        if (i % 2 == 0) { // even rows
          point(j*this.margin, i*this.margin);
        } else { // odd rows
          point(this.margin/2+j*this.margin, i*this.margin);
        }

      }
    }
  }
}

class Geo {
  constructor(ix, iy, margin) {
    this.ix = ix;
    this.iy = iy;
    this.x = (ix % 2 == 0) ? (iy*margin):(iy*margin+margin/2);
    this.y = ix*margin;
    this.size = margin*0.9;
    this.margin = margin;

    this.v1 = new Vertex(0, -this.size/2); // top most point
    this.v2 = new Vertex(-this.size/4*sqrt(3), -this.size/4); // top left point
    this.v3 = new Vertex(-this.size/4*sqrt(3), this.size/4); // bottom left point
    this.v4 = new Vertex(0, this.size/2); // bottom most point
    this.v5 = new Vertex(this.size/4*sqrt(3), this.size/4); // bottom right point
    this.v6 = new Vertex(this.size/4*sqrt(3), -this.size/4); // top right point

    this.v7 = new Vertex(-this.size/4*sqrt(3), 0); // spare points for higher poly
    this.v8 = new Vertex(this.size/4*sqrt(3), 0); // spare points for higher poly

    this.v9 = new Vertex(0, -this.size/2); // top most point dup

    this.r = 0; // radius for circle

    this.turnTimer = 0;
    this.swapped1 = false;
    this.swapped2 = false;

    this.finish = true;
  }

  display(n) {
    // initial hexagon
    push();
      noFill();
      strokeWeight(3);
      translate(this.x, this.y);
      if (n == "inf") { // circle
        circle(0,0,this.r);
        beginShape();
          vertex(this.v1.x, this.v1.y); // top most point
          vertex(this.v2.x, this.v2.y); // top left point
          vertex(this.v7.x, this.v7.y); // additional point
          vertex(this.v3.x, this.v3.y); // bottom left point
          vertex(this.v4.x, this.v4.y); // bottom most point
          vertex(this.v5.x, this.v5.y); // bottom right point
          vertex(this.v8.x, this.v8.y); // additional point
          vertex(this.v6.x, this.v6.y); // top right point
          vertex(this.v9.x, this.v9.y); // top most point dup
        endShape();
      } else {
        beginShape();
          if (n == 6) {
            vertex(this.v1.x, this.v1.y); // top most point
            vertex(this.v2.x, this.v2.y); // top left point
            vertex(this.v3.x, this.v3.y); // bottom left point
            vertex(this.v4.x, this.v4.y); // bottom most point
            vertex(this.v5.x, this.v5.y); // bottom right point
            vertex(this.v6.x, this.v6.y); // top right point
            vertex(this.v9.x, this.v9.y); // top most point dup
          } else if (n == 8) {
            vertex(this.v1.x, this.v1.y); // top most point
            vertex(this.v2.x, this.v2.y); // top left point
            vertex(this.v7.x, this.v7.y); // additional point
            vertex(this.v3.x, this.v3.y); // bottom left point
            vertex(this.v4.x, this.v4.y); // bottom most point
            vertex(this.v5.x, this.v5.y); // bottom right point
            vertex(this.v8.x, this.v8.y); // additional point
            vertex(this.v6.x, this.v6.y); // top right point
            vertex(this.v9.x, this.v9.y); // top most point dup
          }
        endShape();
      }
    pop();
  }

  update(type) {
    switch (type) {
      case "-4":
        this.v1.update(0, -this.size); // top most point
        this.v2.update(-this.size/2*sqrt(3), -this.size/2); // top left point
        this.v7.update(-this.size/2*sqrt(3), 0); // additional point
        this.v3.update(-this.size/2*sqrt(3), this.size/2); // bottom left point
        this.v4.update(0, this.size); // bottom most point
        this.v5.update(this.size/2*sqrt(3), this.size/2); // bottom right point
        this.v8.update(this.size/2*sqrt(3), 0); // additional point
        this.v6.update(this.size/2*sqrt(3), -this.size/2); // top right point
        this.finish = this.v9.update(0, -this.size); // top most point dup
        // this.r = this.size/2;
        this.updateRadius(0);
        break;
      case "-3":
        this.v1.update(0,0); // top most point
        this.v2.update(0,0); // top left point
        this.v7.update(0,0); // additional point
        this.v3.update(0,0); // bottom left point
        this.v4.update(0,0); // bottom most point
        this.v5.update(0,0); // bottom right point
        this.v8.update(0,0); // additional point
        this.v6.update(0,0); // top right point
        this.v9.update(0,0); // top most point dup
        this.finish = this.updateRadius(this.size);
        break;
      case "-2":
        this.v1.update(0,0); // top most point
        this.v2.update(0,0); // top left point
        this.v7.update(0,0); // additional point
        this.v3.update(0,0); // bottom left point
        this.v4.update(0,0); // bottom most point
        this.v5.update(0,0); // bottom right point
        this.v8.update(0,0); // additional point
        this.v6.update(0,0); // top right point
        this.v9.update(0,0); // top most point dup
        // this.r = this.size/2;
        this.finish = this.updateRadius(this.size/2);
        break;
      case "-1":
        this.v1.update(-this.size/2*sin(22.5), -this.size/2*cos(22.5)); // top most point
        this.v2.update(-this.size/2*cos(22.5), -this.size/2*sin(22.5)); // top left point
        this.v7.update(-this.size/2*cos(22.5), this.size/2*sin(22.5)); // additional point
        this.v3.update(-this.size/2*sin(22.5), this.size/2*cos(22.5)); // bottom left point
        this.v4.update(this.size/2*sin(22.5), this.size/2*cos(22.5)); // bottom most point
        this.v5.update(this.size/2*cos(22.5), this.size/2*sin(22.5)); // bottom right point
        this.v8.update(this.size/2*cos(22.5), -this.size/2*sin(22.5)); // additional point
        this.v6.update(this.size/2*sin(22.5), -this.size/2*cos(22.5)); // top right point
        this.finish = this.v9.update(-this.size/2*sin(22.5), -this.size/2*cos(22.5)); // top most point dup
        this.updateRadius(0);
        break;
      case "0": // to original
        this.v1.update(0, -this.size/2); // top most point
        this.v2.update(-this.size/4*sqrt(3), -this.size/4); // top left point
        this.v7.update(-this.size/4*sqrt(3), 0); // additional point
        this.v3.update(-this.size/4*sqrt(3), this.size/4); // bottom left point
        this.v4.update(0, this.size/2); // bottom most point
        this.v5.update(this.size/4*sqrt(3), this.size/4); // bottom right point
        this.v8.update(this.size/4*sqrt(3), 0); // additional point
        this.v6.update(this.size/4*sqrt(3), -this.size/4); // top right point
        this.finish = this.v9.update(0, -this.size/2); // top most point dup
        this.swapped1 = false;
        this.swapped2 = false;
        break;
      case "1":
        // to flick
        if (!this.swapped1) {
          this.v1.update(0, this.size/2); // top most point
          this.v2.update(this.size/4*sqrt(3), this.size/4); // top left point
          this.v3.update(this.size/4*sqrt(3), -this.size/4); // bottom left point
          this.v4.update(0, -this.size/2); // bottom most point
          this.v5.update(-this.size/4*sqrt(3), -this.size/4); // bottom right point
          this.v6.update(-this.size/4*sqrt(3), this.size/4); // top right point
          this.finish = this.v9.update(0, this.size/2); // top most point dup
          this.swapped2 = false;
        }
        if (this.finish && !this.swapped1) {
          this.swapped1 = true;
          // cross swap vertexes;
          let tempV1 = this.v1.vec;
          let tempV2 = this.v2.vec;
          let tempV3 = this.v3.vec;
          this.v1.vec = this.v4.vec;
          this.v9.vec = createVector(this.v4.vec.x, this.v4.vec.y); // deepcopy
          this.v2.vec = this.v5.vec;
          this.v3.vec = this.v6.vec;
          this.v4.vec = tempV1;
          this.v5.vec = tempV2;
          this.v6.vec = tempV3;
        }
        break;
      case "2":
        // to turn
        if (!this.swapped2) {
          this.turnTimer++;
          this.finish = false;
          this.v1.update(0, this.size/2); // top most point
          if (this.turnTimer >= 10) {
            this.v2.update(this.size/4*sqrt(3), this.size/4); // top left point
          }
          if (this.turnTimer >= 20) {
            this.v3.update(this.size/4*sqrt(3), -this.size/4); // bottom left point
          }
          if (this.turnTimer >= 30) {
            this.v4.update(0, -this.size/2); // bottom most point
          }
          if (this.turnTimer >= 40) {
            this.v5.update(-this.size/4*sqrt(3), -this.size/4); // bottom right point
          }
          if (this.turnTimer >= 50) {
            this.v6.update(-this.size/4*sqrt(3), this.size/4); // top right point
          }
          if (this.turnTimer >= 60) {
            this.finish = this.v9.update(0, this.size/2); // top right point dup
          }
          this.swapped1 = false;
        }
        if (this.finish) {
          this.turnTimer = 0;
          if (!this.swapped2) {
            this.swapped2 = true;
            // cross swap vertexes;
            let tempV1 = this.v1.vec;
            let tempV2 = this.v2.vec;
            let tempV3 = this.v3.vec;
            this.v1.vec = this.v4.vec;
            this.v9.vec = createVector(this.v4.vec.x, this.v4.vec.y); // deepcopy
            this.v2.vec = this.v5.vec;
            this.v3.vec = this.v6.vec;
            this.v4.vec = tempV1;
            this.v5.vec = tempV2;
            this.v6.vec = tempV3;
          }
        }
        break;
      case "3":
        // to triangle
        this.v2.update(-this.size/4, -this.size/8);
        this.v7.update(-this.size/4, -this.size/8); // v7 same to v2
        this.v4.update(0, this.size/4);
        this.v8.update(this.size/4, -this.size/8); // v8 same to v6
        this.finish = this.v6.update(this.size/4, -this.size/8);
        // keep same
        this.v1.update(0, -this.size/2);
        this.v3.update(-this.size/4*sqrt(3), this.size/4);
        this.v5.update(this.size/4*sqrt(3), this.size/4);
        this.v9.update(0, -this.size/2);
        this.swapped1 = false;
        this.swapped2 = false;
        break;
      case "4":
        // to bigger hex
        this.v2.update(0, 0);
        this.v7.update(0, 0); // v7 same to v2
        this.v4.update(0, 0);
        this.v8.update(0, 0); // v8 same to v6
        this.finish = this.v6.update(0, 0);
        // other points extend a little
        this.v1.update(0, -this.size/2*1.2);
        this.v3.update(-this.size/4*sqrt(3)*1.2, this.size/4*1.2);
        this.v5.update(this.size/4*sqrt(3)*1.2, this.size/4*1.2);
        this.v9.update(0, -this.size/2*1.2);
        break;

    }

  }
  
  updateRadius(desSize) {
    let dif = desSize - this.r;
    if (abs(dif) > 0.01) {
      this.r += dif*speed;
      return false;
    } else {
      return true;
    }
  }
}

class Vertex {
  constructor(x,y) {
    this.vec = createVector(x, y);
  }

  update(desX, desY) {
    let des = createVector(desX, desY);
    if (abs(this.vec.x - des.x) > 0.01 ||
        abs(this.vec.y - des.y) > 0.01) { // check equivalence at the 0.01 decimals
      this.vec.add(des.sub(this.vec).mult(speed));
      return false;
    } else {
      return true;
    }
  }
  get x() {
    return this.vec.x
  }
  get y() {
    return this.vec.y
  }
}
