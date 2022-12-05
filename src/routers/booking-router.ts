import { Router } from "express";
import { authenticateToken } from "@/middlewares";
import { getBooking, postBooking, changeBooking } from "@/controllers";

const bookingRouter = Router();

bookingRouter
  .all("/*", authenticateToken)
  .get("", getBooking)
  .post("/", postBooking)
  .put("/:bookingId", changeBooking);

export { bookingRouter };
