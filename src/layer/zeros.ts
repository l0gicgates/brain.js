const zeros2D = require('../utilities/zeros-2d');
const { Model } = require('./types');

export class Zeros extends Model {
  constructor(settings: any) {
    super(settings);
    this.validate();
    this.weights = zeros2D(this.width, this.height);
    this.deltas = zeros2D(this.width, this.height);
  }

  predict() {
    // throw new Error(`${this.constructor.name}-predict is not yet implemented`)
  }

  compare() {
    // throw new Error(`${this.constructor.name}-compare is not yet implemented`)
  }
}

export function zeros(settings: any) {
  return new Zeros(settings);
}

