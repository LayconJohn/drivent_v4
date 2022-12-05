import { prisma } from "@/config";
import { User, Room } from "@prisma/client";

export async function createBooking(user: User, room: Room) {
  return prisma.booking.create({
    data: {
      roomId: room.id,
      userId: user.id
    }
  });
}

export async function findBookingById(idBooking: number) {
  return prisma.booking.findFirst({
    where: {
      userId: idBooking
    }
  });
}
