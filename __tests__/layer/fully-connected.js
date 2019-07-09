const gpuMock = require('gpu-mock.js');
const fc = require('../../src/layer/fully-connected');
const predict = fc.predict;
const predict3D = fc.predict3D;
const compareBiases = fc.compareBiases;
const compareFilterDeltas = fc.compareFilterDeltas;
const compareFilterDeltas3D = fc.compareFilterDeltas3D;
const compareInputDeltas = fc.compareInputDeltas;
const compareInputDeltas3D = fc.compareInputDeltas3D;
const utils = require('../test-utils');
const onePlusPlus2D = utils.onePlusPlus2D;
const zero2D = utils.zero2D;

describe('FullyConnected Layer', () => {
  describe('.predict (forward propagation)', () => {
    test('can predict a simple matrix', () => {
      const weights = [[1, 2], [3, 4]];
      const filters = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ];
      const biases = [0.2, 0.2, 0.2, 0.2];
      const kernel = gpuMock(predict, {
        output: [4],
        constants: {
          inputDepth: 1,
          inputHeight: 2,
          inputWidth: 2,
        },
      });

      expect(kernel(weights, filters, biases)).toEqual([
        30.2,
        70.2,
        110.2,
        150.2,
      ]);
    });

    test('can predict a matrix', () => {
      const results = gpuMock(predict, {
        output: [9],
        constants: {
          inputDepth: 1,
          inputHeight: 1,
          inputWidth: 9,
        },
      })(
        [[0, 1, 2, 3, 4, 5, 6, 7, 8]],
        [
          [0, 1, 2, 3, 4, 5, 6, 7, 8],
          [0, 1, 2, 3, 4, 5, 6, 7, 8],
          [0, 1, 2, 3, 4, 5, 6, 7, 8],
          [0, 1, 2, 3, 4, 5, 6, 7, 8],
          [0, 1, 2, 3, 4, 5, 6, 7, 8],
          [0, 1, 2, 3, 4, 5, 6, 7, 8],
          [0, 1, 2, 3, 4, 5, 6, 7, 8],
          [0, 1, 2, 3, 4, 5, 6, 7, 8],
          [0, 1, 2, 3, 4, 5, 6, 7, 8],
        ],
        [0, 1, 2, 3, 4, 5, 6, 7, 8]
      );

      expect(results).toEqual([204, 205, 206, 207, 208, 209, 210, 211, 212]);
    });
  });

  describe('.predict3D (forward propagation)', () => {
    test('can predict a simple matrix', () => {
      const weights = [[[1, 2], [3, 4]]];
      const filters = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ];
      const biases = [0.2, 0.2, 0.2, 0.2];
      const kernel = gpuMock(predict3D, {
        output: [4, 1],
        constants: {
          inputDepth: 1,
          inputHeight: 2,
          inputWidth: 2,
        },
      });

      expect(kernel(weights, filters, biases)).toEqual([
        [30.2, 70.2, 110.2, 150.2],
      ]);
    });

    test('can predict a matrix', () => {
      const results = gpuMock(predict3D, {
        output: [9, 1],
        constants: {
          inputDepth: 1,
          inputHeight: 1,
          inputWidth: 9,
        },
      })(
        [[[0, 1, 2, 3, 4, 5, 6, 7, 8]]],
        [
          [0, 1, 2, 3, 4, 5, 6, 7, 8],
          [0, 1, 2, 3, 4, 5, 6, 7, 8],
          [0, 1, 2, 3, 4, 5, 6, 7, 8],
          [0, 1, 2, 3, 4, 5, 6, 7, 8],
          [0, 1, 2, 3, 4, 5, 6, 7, 8],
          [0, 1, 2, 3, 4, 5, 6, 7, 8],
          [0, 1, 2, 3, 4, 5, 6, 7, 8],
          [0, 1, 2, 3, 4, 5, 6, 7, 8],
          [0, 1, 2, 3, 4, 5, 6, 7, 8],
        ],
        [0, 1, 2, 3, 4, 5, 6, 7, 8]
      );

      expect(results).toEqual([[204, 205, 206, 207, 208, 209, 210, 211, 212]]);
    });
  });

  describe('.compareBiases (back propagation)', () => {
    test('can compare a simple matrix', () => {
      const biases = [0, 0, 0, 0];
      const deltas = [[1, 2, 3, 4]];
      const kernel = gpuMock(compareBiases, {
        output: [4],
        constants: {
          connectionCount: 4,
        },
      });

      expect(kernel(biases, deltas)).toEqual([1, 2, 3, 4]);
    });

    test('can add a simple matrix', () => {
      const biases = [1, 2, 3, 4];
      const deltas = [[1, 2, 3, 4]];
      const kernel = gpuMock(compareBiases, {
        output: [4],
        constants: {
          connectionCount: 4,
        },
      });

      expect(kernel(biases, deltas)).toEqual([2, 4, 6, 8]);
    });
  });

  describe('.compareFilterDeltas (back propagation)', () => {
    test('can compare a simple matrix', () => {
      const inputWeights = onePlusPlus2D(4, 4);
      const deltas = onePlusPlus2D(1, 16);
      const filterDeltas = zero2D(4, 4);
      const kernel = gpuMock(compareFilterDeltas, {
        output: [4, 4],
        constants: {
          deltaX: 0,
          deltaY: 0,
          deltaWidth: 4,
          deltaHeight: 4
        },
      });

      expect(kernel(filterDeltas, inputWeights, deltas)).toEqual([
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16]
      ]);
    });

    test('can add a simple matrix', () => {
      const inputWeights = onePlusPlus2D(4, 4);
      const deltas = onePlusPlus2D(1, 16);
      const filterDeltas = onePlusPlus2D(4, 4);
      const kernel = gpuMock(compareFilterDeltas, {
        output: [4, 4],
        constants: {
          deltaX: 0,
          deltaY: 0,
          deltaWidth: 4,
          deltaHeight: 4
        },
      });

      expect(kernel(filterDeltas, inputWeights, deltas)).toEqual([
        [2, 4, 6, 8],
        [10, 12, 14, 16],
        [18, 20, 22, 24],
        [26, 28, 30, 32]
      ]);
    });
  });

  describe('.compareFilterDeltas3D (back propagation)', () => {
    test('can compare a simplge matrix', () => {
      const inputWeights = [[[1, 2], [3, 4]]];
      const deltas = [[1, 2, 3, 4]];
      const filterDeltas = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      const kernel = gpuMock(compareFilterDeltas3D, {
        output: [4, 4],
        constants: {
          inputWidth: 2,
          inputHeight: 2,
        },
      });

      expect(kernel(filterDeltas, inputWeights, deltas)).toEqual([
        [1, 2, 3, 4],
        [2, 4, 6, 8],
        [3, 6, 9, 12],
        [4, 8, 12, 16],
      ]);
    });

    test('can add a simplge matrix', () => {
      const inputWeights = [[[1, 2], [3, 4]]];
      const deltas = [[1, 2, 3, 4]];
      const filterDeltas = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ];
      const kernel = gpuMock(compareFilterDeltas3D, {
        output: [4, 4],
        constants: {
          inputWidth: 2,
          inputHeight: 2,
        },
      });

      expect(kernel(filterDeltas, inputWeights, deltas)).toEqual([
        [2, 4, 6, 8],
        [7, 10, 13, 16],
        [12, 16, 20, 24],
        [17, 22, 27, 32],
      ]);
    });
  });
  describe('.compareInputDeltas (back propagation)', () => {
    test('can compare a simple matrix', () => {
      const inputDeltas = [[0, 0], [0, 0]];
      const deltas = [[1, 2, 3, 4]];
      const filters = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ];
      const kernel = gpuMock(compareInputDeltas, {
        output: [2, 2],
        constants: {
          filterCount: 4,
        },
      });

      expect(kernel(inputDeltas, deltas, filters)).toEqual([
        [90, 100],
        [110, 120],
      ]);
    });

    test('can add a simple matrix', () => {
      const inputDeltas = [[1, 2], [3, 4]];
      const deltas = [[1, 2, 3, 4]];
      const filters = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ];
      const kernel = gpuMock(compareInputDeltas, {
        output: [2, 2],
        constants: {
          filterCount: 4,
        },
      });

      expect(kernel(inputDeltas, deltas, filters)).toEqual([
        [91, 102],
        [113, 124],
      ]);
    });
  });
  describe('.compareInputDeltas3D (back propagation)', () => {
    test('can compare a simple matrix', () => {
      const inputDeltas = [[[0, 0], [0, 0]]];
      const deltas = [[1, 2, 3, 4]];
      const filters = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ];
      const kernel = gpuMock(compareInputDeltas3D, {
        output: [2, 2, 1],
        constants: {
          filterCount: 4,
        },
      });

      expect(kernel(inputDeltas, deltas, filters)).toEqual([
        [[90, 100], [110, 120]],
      ]);
    });
    test('can add a simple matrix', () => {
      const inputDeltas = [[[1, 2], [3, 4]]];
      const deltas = [[1, 2, 3, 4]];
      const filters = [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
        [9, 10, 11, 12],
        [13, 14, 15, 16],
      ];
      const kernel = gpuMock(compareInputDeltas3D, {
        output: [2, 2, 1],
        constants: {
          filterCount: 4,
        },
      });

      expect(kernel(inputDeltas, deltas, filters)).toEqual([
        [[91, 102], [113, 124]],
      ]);
    });
  });
});
