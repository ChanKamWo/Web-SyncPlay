import Redis from "ioredis-mock"
import { RoomState } from "./types"

const client = new Redis()

export const getRoom = async (roomId: string) => {
  const data = await client.get("room:" + roomId)
  if (data === null) {
    return data
  }

  return JSON.parse(data) as RoomState
}

export const roomExists = async (roomId: string) => {
  return await client.exists("room:" + roomId)
}

export const setRoom = async (roomId: string, data: RoomState) => {
  if (!(await client.sismember("rooms", roomId))) {
    await client.sadd("rooms", roomId)
  }
  return await client.set("room:" + roomId, JSON.stringify(data))
}

export const deleteRoom = async (roomId: string) => {
  await client.srem("rooms", roomId)
  return await client.del("room:" + roomId)
}

export const listRooms = async () => {
  return await client.smembers("rooms")
}

export const countRooms = async () => {
  return await client.scard("rooms")
}

export const countUsers = async () => {
  const count = await client.get("userCount")
  if (count === null) {
    return 0
  }
  return parseInt(count)
}

export const incUsers = async () => {
  return await client.incr("userCount")
}

export const decUsers = async () => {
  return await client.decr("userCount")
}

export const wipeCache = async () => {
  return await client.flushall()
}
