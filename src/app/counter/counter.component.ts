import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent {
  @Input() public tileSize!: number;

  public pyramid: number[] = [];
  public maxNumber: number = 24;
  public currentNumber: number = 24;
  public potatoes: string[] = [];
  public rotations: number[] = [];
  public dropShadows: string[] = [];

  private defaultShadowCords = { x: 2, y: 2 };

  constructor() {
    this.pyramid = findClosestFittingPyramid(this.maxNumber);
    this.potatoes = new Array<boolean>(this.maxNumber)
      .fill(false)
      .map(() => `assets/russet/${ Math.floor(Math.random() * 5) }.png`)
      .reverse();
    this.rotations = new Array<boolean>(this.maxNumber)
      .fill(false)
      .map(() => Math.random() * 360);
    this.dropShadows = new Array<boolean>(this.maxNumber)
      .fill(false)
      .map((v, i) => {
        let cords = this.rotatePoint(-this.rotations[i], this.defaultShadowCords);
        return `drop-shadow(${ cords.x.toFixed(2) }px ${ cords.y.toFixed(2) }px 5px #222)`;
      });

    console.log(this.dropShadows);
  }

  public get height(): number {
    return this.pyramid.length * this.tileSize;
  }

  public get currentNumberArray(): { top: number, left: number }[] {
    return new Array<number>(this.currentNumber)
      .fill(0)
      .map((v, i) => this.calcPosition(i));
  }

  public getLevel(index: number): number {
    let restCurrentNumber = index;

    let levelIndex = 0;
    for (const { v, i } of this.pyramid.map((v, i) => ({ v, i }))) {
      if ((restCurrentNumber - v) < 0) {
        levelIndex = i;
        break;
      }

      restCurrentNumber -= v;
    }

    return levelIndex;
  }

  public calcPosition(index: number): { top: number, left: number } {
    let restCurrentNumber = index;

    let levelIndex = 0;
    for (const { v, i } of this.pyramid.map((v, i) => ({ v, i }))) {
      if ((restCurrentNumber - v) < 0) {
        levelIndex = i;
        break;
      }

      restCurrentNumber -= v;
    }

    let result = {
      top: levelIndex / this.pyramid.length,
      left: (restCurrentNumber / this.pyramid[levelIndex]) * (this.pyramid[levelIndex] / this.pyramid[0]) + (((this.pyramid[0] - this.pyramid[levelIndex]) / this.pyramid[0]) / 2),
    };

    return {
      top: result.top * 100,
      left: result.left * 100,
    }
  }

  public rotatePoint(angle: number, p: { x: number, y: number }): { x: number, y: number } {
    let s = Math.sin(angle);
    let c = Math.cos(angle);

    let newP = { ...p };

    let xnew = p.x * c - p.y * s;
    let ynew = p.x * s + p.y * c;

    // translate point back:
    newP.x = xnew;
    newP.y = ynew;
    return newP;
  }
}

export function findClosestFittingPyramid(totalNumber: number): number[] {
  let factorial = 1;
  let i = 0;

  while (true) {
    if ((factorial += ++i) >= totalNumber)
      break;
  }

  return new Array<number>(i).fill(0).map((v, i) => i + 1).reverse();
}
