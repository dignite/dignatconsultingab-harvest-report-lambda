import { startOfMonth } from "./date";
import MockDate from "mockdate";

describe("date", () => {
  describe(startOfMonth, () => {
    it("should find October 1st", () => {
      expect.assertions(1);
      MockDate.set(new Date("2018-10-17"));

      expect(startOfMonth()).toStrictEqual(
        new Date("2018-10-01T00:00:00.000Z")
      );
    });
    it("should find November 1st", () => {
      expect.assertions(1);
      MockDate.set(new Date("2018-11-01"));

      expect(startOfMonth()).toStrictEqual(
        new Date("2018-11-01T00:00:00.000Z")
      );
    });
  });

  afterEach(MockDate.reset);
});
