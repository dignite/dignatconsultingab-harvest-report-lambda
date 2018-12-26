const { hoursMeta } = require("./");
const mockTimeSummary = require("./time-summary");
const mockCostSummary = require("./cost-summary");
const mockServerlessAbsolutePath = require("./serverless-absolute-path");

jest.mock("./time-summary", () => ({
  totalSum: jest.fn(),
  perWeek: jest.fn()
}));
jest.mock("./cost-summary", () => ({
  totalSum: jest.fn()
}));
jest.mock("./serverless-absolute-path", () => ({
  resolve: jest.fn()
}));

describe(hoursMeta, () => {
  const relevantTimeEntries = ["fake-time-entry-1", "fake-time-entry-2"];

  const event = {
    path: "/my-path"
  };

  test("should return status code, endpoint description and csv url", () => {
    mockServerlessAbsolutePath.resolve.mockImplementation(
      (event, relativePath) => ({
        "mockServerlessAbsolutePath.resolve() of": {
          event,
          relativePath
        }
      })
    );

    const result = hoursMeta(relevantTimeEntries, event);

    expect(result).toEqual({
      description:
        "*All* unbilled billable hours, and any non-billable hours logged for the current month.",
      csvFile: mockServerlessAbsolutePath.resolve(event, event.path + ".csv")
    });
  });

  test("should return total unbilled billable hours", () => {
    mockTimeSummary.totalSum.mockImplementation(input => ({
      "mockTimeSummary.totalSum() of": input
    }));

    const result = hoursMeta(relevantTimeEntries, event);

    expect(result).toEqual(
      expect.objectContaining({
        totalUnbilledHours: mockTimeSummary.totalSum(relevantTimeEntries)
      })
    );
  });

  test("should return total unbilled billable hours per week", () => {
    mockTimeSummary.totalSum.mockImplementation(input => ({
      "mockTimeSummary.totalSum() of": input
    }));

    const result = hoursMeta(relevantTimeEntries, event);

    expect(result).toEqual(
      expect.objectContaining({
        totalUnbilledHoursPerWeek: mockTimeSummary.perWeek(relevantTimeEntries)
      })
    );
  });

  test("should return total unbilled invoice size", () => {
    mockCostSummary.totalSum.mockImplementation(input => ({
      "mockCostSummary.totalSum() of": input
    }));

    const result = hoursMeta(relevantTimeEntries, event);

    expect(result).toEqual(
      expect.objectContaining({
        unbilledInvoice: mockCostSummary.totalSum(relevantTimeEntries)
      })
    );
  });
});
