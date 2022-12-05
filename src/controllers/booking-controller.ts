import { Response } from "express";
import { AuthenticatedRequest } from "@/middlewares";
import httpStatus from "http-status";
import bookingService from "@/services/booking-service";

export async function getBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
    
  try {
    const booking = await bookingService.getBooking(Number(userId));
    return res.status(httpStatus.OK).send({
      id: booking.id,
      Room: booking.Room
    });     
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
  }
}

export async function postBooking(req: AuthenticatedRequest, res: Response) {
  const userId = Number(req.userId);
  const roomId = Number(req.body.roomId);

  try {
    const createdBooking = await bookingService.createBooking(userId, roomId);
    return res.status(httpStatus.OK).send({ bookingId: createdBooking.id });
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name == "CannotListHotelsError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    if (error.statusText === "BAD_REQUEST") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    return res.sendStatus(httpStatus.FORBIDDEN);
  }
} 

export async function changeBooking(req: AuthenticatedRequest, res: Response) {
  const roomId = Number(req.body.roomId);
  const bookingId = Number(req.params.bookingId);
  const userId = Number(req.userId);

  try {
    const updatedBooking = await bookingService.updateBooking(bookingId, roomId, userId);
    return res.status(httpStatus.OK).send({ bookingId: updatedBooking.id });
  } catch (error) {
    if (error.name === "NotFoundError") {
      return res.sendStatus(httpStatus.NOT_FOUND);
    }
    if (error.name == "CannotListHotelsError") {
      return res.sendStatus(httpStatus.PAYMENT_REQUIRED);
    }
    if (error.statusText === "BAD_REQUEST") {
      return res.sendStatus(httpStatus.BAD_REQUEST);
    }
    return res.sendStatus(httpStatus.FORBIDDEN);
  }
}
