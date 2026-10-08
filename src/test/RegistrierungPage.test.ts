import { describe, expect, it } from "vitest";
import { buildRegistrationPayload } from "@/lib/registrationPayload";

describe("buildRegistrationPayload", () => {
  it("defaults apartment and ip address to unknown while keeping datenschutz explicit", () => {
    expect(
      buildRegistrationPayload({
        apartment: null,
        checkInDate: new Date("2026-04-10T00:00:00.000Z"),
        checkOutDate: new Date("2026-04-12T00:00:00.000Z"),
        datenschutz: false,
        userOrt: "Wien",
        userLand: "Österreich",
      })
    ).toEqual({
      apartment: "unknown",
      check_in: "2026-04-10",
      check_out: "2026-04-12",
      datenschutz: false,
      ip_address: "unknown",
      ort: "Wien",
      land: "Österreich",
    });
  });
});
