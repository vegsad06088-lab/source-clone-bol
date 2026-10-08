import { format } from "date-fns";

export function buildRegistrationPayload({
  apartment,
  checkInDate,
  checkOutDate,
  datenschutz,
  userIp,
  userOrt,
  userLand,
}: {
  apartment: string | null;
  checkInDate: Date;
  checkOutDate: Date;
  datenschutz: boolean;
  userIp?: string;
  userOrt: string;
  userLand: string;
}) {
  return {
    apartment: apartment ?? "unknown",
    check_in: format(checkInDate, "yyyy-MM-dd"),
    check_out: format(checkOutDate, "yyyy-MM-dd"),
    datenschutz,
    ip_address: userIp || "unknown",
    ort: userOrt,
    land: userLand,
  };
}
