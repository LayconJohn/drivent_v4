import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import hotelRepository from "@/repositories/hotel-repository";
import { notFoundError, requestError } from "@/errors";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";

async function checkEnrollmentAndTicket(userId: number) {
  //Tem enrollment?
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  //Tem ticket pago isOnline false e includesHotel true
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  
  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError();
  }
} 

async function getBooking(userId: number) {
  const booking = await bookingRepository.findBooking(userId);
  if (!booking) {
    throw notFoundError();
  }

  return booking;
}
 
async function createBooking(userId: number, roomId: number) {
  if (userId < 1 || roomId < 1) {
    throw notFoundError();
  }
  await checkEnrollmentAndTicket(userId);
    
  const room = await hotelRepository.findRoomById(roomId);
  if (!room) {
    throw notFoundError();
  }
  if (room.Booking.length >= room.capacity) {
    throw requestError(403, "FORBIDDEN");
  }

  const createdBooking = await bookingRepository.createBooking(userId, roomId);
  return createdBooking;
}

async function updateBooking(bookingId: number, roomId: number, userId: number) {
  if (bookingId < 1 || roomId < 1) {
    throw notFoundError();
  }
  await checkEnrollmentAndTicket(userId);

  const room = await hotelRepository.findRoomById(roomId);
  if (!room) {
    throw notFoundError();
  }
  if (room.Booking.length >= room.capacity) {
    throw requestError(403, "FORBIDDEN");
  }

  const bookingUpdated = await bookingRepository.updateBooking(bookingId, roomId);

  return bookingUpdated;
}

const bookingService = {
  getBooking,
  createBooking,
  updateBooking
};

export default bookingService;
