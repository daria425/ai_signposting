const {
  createNewFlow,
  getCurrentFlow,
  deleteFlowOnCompletion,
  deleteFlowOnErr,
  updateUserSelection,
} = require("../../helpers/firestore.helpers");

const {
  mockFirestore,
  mockCollection,
  mockWhere,
  mockGet,
  mockBatch,
  mockDelete,
} = require("../mocks/mockFirestore");

jest.mock("uuid", () => ({
  v4: jest.fn(() => "mocked-flow-id"),
}));

describe("createNewFlow", () => {
  let db;
  let flowData;

  beforeEach(() => {
    // Set up common mock configurations
    db = mockFirestore;
    flowData = {
      flowName: "signposting",
      flowStep: 1,
      userInfo: { WaId: "user-1" },
    };
  });

  it("searches for userId in flows firestore collection", async () => {
    mockGet.mockResolvedValueOnce({
      empty: true,
    });

    await createNewFlow(db, flowData);
    expect(mockWhere).toHaveBeenCalledWith(
      "userId",
      "==",
      flowData.userInfo.WaId
    );
  });

  it("deletes a flow before beginning a new one if one exists for a user", async () => {
    mockGet.mockResolvedValueOnce({
      empty: false,
      forEach: jest.fn((cb) => {
        cb({ ref: "mocked-existing-ref" });
      }),
    });

    await createNewFlow(db, flowData);
    expect(mockDelete).toHaveBeenCalledWith("mocked-existing-ref");
  });

  it("doesn't call firestore delete if there is no existing flow", async () => {
    mockGet.mockResolvedValueOnce({
      empty: true,
    });

    await createNewFlow(db, flowData);
    expect(mockBatch).not.toHaveBeenCalled();
    expect(db.batch().delete).not.toHaveBeenCalled();
  });

  it("creates a new flow with predefined properties", async () => {
    mockGet.mockResolvedValueOnce({
      empty: true,
    });

    await createNewFlow(db, flowData);
    const { flowName, userInfo, flowStep } = flowData;
    const userId = userInfo.WaId;
    const expectedData = {
      startTime: expect.any(String),
      flowName,
      userId,
      flowStep,
    };
    expect(
      db.collection("flows").doc("mocked-flow-id").set
    ).toHaveBeenCalledWith(expectedData);
  });

  it("throws an error if firestore get operation fails", async () => {
    mockGet.mockRejectedValueOnce(new Error("Firestore get failed"));

    await expect(createNewFlow(db, flowData)).rejects.toThrow(
      "Failed to create new flow"
    );
  });
});

describe("getCurrentFlow", () => {
  let db;
  let userData;
  let updateResult;
  beforeEach(async () => {
    db = mockFirestore;
    userData = {
      WaId: "user-1",
    };
    mockGet.mockResolvedValueOnce({
      empty: false,
      docs: [
        {
          id: "mocked-flow-id",
          data: () => ({ flowStep: 1 }),
        },
      ],
    });
    updateResult = await getCurrentFlow(db, userData);
  });
  it("fetches the current flow for the given userId", async () => {
    expect(mockWhere).toHaveBeenCalledWith("userId", "==", userData.WaId);
  });
  it("updates the flowStep", async () => {
    expect(
      db.collection("flows").doc("mocked-flow-id").update
    ).toHaveBeenCalledWith({ flowStep: 2 });
  });
  it("returns an updated result containing the updated document id", async () => {
    expect(updateResult).toHaveProperty("id", "mocked-flow-id");
  });
});

describe("deleteFlowOnCompletion", () => {
  it("calls delete method with flowId", async () => {
    const flowId = "flow-to-delete";
    await deleteFlowOnCompletion(mockFirestore, flowId);
    expect(mockFirestore.collection("flows").doc).toHaveBeenCalledWith(flowId);
    expect(mockDelete).toHaveBeenCalled();
  });
});

describe("deleteFlowOnErr", () => {
  let db;
  let userId;
  let error;
  beforeEach(() => {
    db = mockFirestore;
    userId = "user-1";
    error = "Error occured";
  });
  it("deletes a document with id retrieved from firestore get operation", async () => {
    mockGet.mockResolvedValueOnce({
      empty: false,
      docs: [{ id: "doc-1" }],
    });
    await deleteFlowOnErr(db, userId, error);
    expect(db.collection("flows").doc).toHaveBeenCalledWith("doc-1");
  });
  it("deletes all documents", async () => {
    mockGet.mockResolvedValueOnce({
      empty: false,
      docs: [{ id: "doc-1" }, { id: "doc-2" }, { id: "doc-3" }],
    });
    await deleteFlowOnErr(db, userId, error);
    expect(mockDelete).toHaveBeenCalledTimes(3);
    expect(db.collection("flows").doc).toHaveBeenCalledWith("doc-1");
    expect(db.collection("flows").doc).toHaveBeenCalledWith("doc-2");
    expect(db.collection("flows").doc).toHaveBeenCalledWith("doc-3");
  });
});

describe("updateUserSelection", () => {
  let db;
  let seeMoreOptionMessages;
  let flowId;
  beforeEach(() => {
    seeMoreOptionMessages = ["See More Options", "That's great, thanks"];
    db = mockFirestore;
    flowId = "mocked-flow-id";
    mockGet.mockResolvedValue({
      empty: false,
      docs: [
        {
          id: "mocked-flow-id",
          data: () => ({ flowStep: 1 }),
          exists: true,
        },
      ],
    });
    db.collection("flows").doc("mocked-flow-id").get = jest
      .fn()
      .mockResolvedValue({
        exists: true,
        data: () => ({ data: "mock-value" }),
      });
  });
  it("increments userSelection.page if selection value is See More", async () => {
    selectionValue = seeMoreOptionMessages[0];
    const flowStep = 2;
    await updateUserSelection(
      db,
      flowId,
      flowStep,
      selectionValue,
      seeMoreOptionMessages
    );
    expect(
      db.collection("flows").doc("mocked-flow-id").update
    ).toHaveBeenCalledWith({ "userSelection.page": expect.any(Object) });
  });
  it("updates userSelection to endFlow if selection Value is That's great, thanks", async () => {
    selectionValue = seeMoreOptionMessages[1];
    const flowStep = 2;
    await updateUserSelection(
      db,
      flowId,
      flowStep,
      selectionValue,
      seeMoreOptionMessages
    );
    expect(
      db.collection("flows").doc("mocked-flow-id").update
    ).toHaveBeenCalledWith({ "userSelection.endFlow": true });
  });
  it("matches flowStep to key in selectionNames object", async () => {
    selectionValue = "";
    let flowStep = 2;
    await updateUserSelection(
      db,
      flowId,
      flowStep,
      selectionValue,
      seeMoreOptionMessages
    );
    expect(
      db.collection("flows").doc("mocked-flow-id").update
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        "userSelection.category": "",
      })
    );
    flowStep = 3;
    await updateUserSelection(
      db,
      flowId,
      flowStep,
      selectionValue,
      seeMoreOptionMessages
    );
    expect(
      db.collection("flows").doc("mocked-flow-id").update
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        "userSelection.location": "",
      })
    );
  });
  // it("returns data of updated document if updated document exists", async () => {
  //   selectionValue = "";
  //   const flowStep = 2;
  //   const updateResult = await updateUserSelection(
  //     db,
  //     flowId,
  //     flowStep,
  //     selectionValue,
  //     seeMoreOptionMessages
  //   );

  //   expect(db.collection("flows").doc("mocked-flow-id").get).toHaveBeenCalled();
  //   expect(updateResult).toEqual(
  //     expect.objectContaining({
  //       data: "mock-value",
  //     })
  //   );
  // });
});
