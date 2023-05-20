import { api } from '@/plugins/axios'
import { type EventOnPoster } from '@common/types'

export const getEvents = async (): Promise<EventOnPoster[]> => {
  const { data } = await api.get('/events')
  return data
}

export const getEventsByParams = async ({
  searchLine,
  country,
  city
}: {
  searchLine?: string
  country?: string
  city?: string
}): Promise<EventOnPoster[]> => {
  const { data } = await api.post('/events/find', { searchLine, country, city })
  return data
}
export const getEvent = async (id: string): Promise<EventOnPoster> => {
  const { data } = await api.get(`/events/${id}`)
  return data
}

export const postEvent = async (data: any) => {
  await api.post('/events/add', data)
}

export const deleteEvent = async (id: string) => {
  await api.post('/events/delete', { id })
}
