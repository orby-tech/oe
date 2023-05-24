import { EventOnPoster } from "@common/types/event";
import { FilterQuery } from "mongoose";
import { v4 as uuid } from "uuid";
import EventModel from "../models/event.model";

export type FindEventParams = {
  searchLine?: string;
  city?: string;
  country?: string;
};

class EventsStateController {
  async addEvent(event: EventOnPoster) {
    const id = uuid();
    const eventWithId = { ...event, id };
    const newEvent = new EventModel(eventWithId);
    await newEvent.save().catch((e) => {
      console.log(e);
    });
    return id;
  }

  async getEvents(
    query?: FindEventParams | undefined
  ): Promise<EventOnPoster[]> {
    const queryObject: FilterQuery<EventOnPoster> = {};
    if (query?.searchLine) {
      queryObject["$text"] = { $search: query.searchLine };
    }
    if (query?.country) {
      queryObject["location.country"] = query?.country;
    }
    if (query?.city) {
      queryObject["location.city"] = query?.city;
    }

    const events = await EventModel.find(queryObject);
    return events;
  }

  async getEvent(id: string) {
    const event = await EventModel.findOne({
      id,
    });
    return event;
  }

  async updateEvent(data: EventOnPoster) {
    const event = await EventModel.findOneAndUpdate(
      { id: data.id },
      {
        $set: data,
      }
    );

    return event;
  }

  async deleteEvent(id: string) {
    await EventModel.deleteOne({ id });
  }
}

export const eventsStateController = new EventsStateController();
