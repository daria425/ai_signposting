const mockSet = jest.fn();
const mockDelete = jest.fn();
const mockCommit = jest.fn();
const mockUpdate = jest.fn();
const mockBatch = jest.fn(() => ({
  delete: mockDelete,
  commit: mockCommit,
}));

const mockGet = jest.fn();

const mockWhere = jest.fn(() => ({
  get: mockGet,
}));

const mockDoc = jest.fn(() => ({
  set: mockSet,
  update: mockUpdate,
  delete: mockDelete,
}));

const mockCollection = jest.fn(() => ({
  where: mockWhere,
  doc: mockDoc,
}));

const mockFirestore = {
  collection: mockCollection,
  batch: mockBatch,
};

// Exporting individual mocks and the entire mockFirestore object
module.exports = {
  mockSet,
  mockDelete,
  mockCommit,
  mockBatch,
  mockGet,
  mockWhere,
  mockDoc,
  mockCollection,
  mockFirestore,
};
