import { EventOnPoster } from "@common/types/event";
import { v4 as uuid } from "uuid";
import { fileDBController } from "./file-db-controller";
import fs from "fs";
import { countriesAndCitiesController } from "./countries-and-cities.controller";
import { vars } from "../const/vars";

export type FindEventParams = {
  searchLine?: string;
  city?: string;
  country?: string;
};
class EventsStateController {
  _events: EventOnPoster[] = [];

  autogenEventsBase: { title: string; description: string; image: string }[] =
    [];

  autogeneratedEvents: EventOnPoster[] = [];

  get events() {
    return this._events;
  }
  set events(value) {
    this._events = value;
  }

  constructor() {
    this.events =
      JSON.parse(fs.readFileSync("./assets/db/events.json", "utf-8")) || [];
    this.autogenEventsBase = JSON.parse(
      fs.readFileSync("./assets/presets/autogen-base.json", "utf-8")
    );
  }

  addEvent(event: EventOnPoster) {
    const id = uuid();
    this.events.push({ ...event, id });
    fileDBController.updateDB();
    return id;
  }

  getEvents(query?: FindEventParams | undefined): EventOnPoster[] {
    const events = query ? this.findEvents(query) : this.events;

    if (!events) {
      return this.getAutogenEvents({ autoGeneratedEventsCount: 10, ...query });
    }

    if (events.length > 10) {
      return events;
    }
    let autoGeneratedEventsCount = 10 - events.length;

    return [
      ...this.events,
      ...this.getAutogenEvents({ autoGeneratedEventsCount, ...query }),
    ].sort((a, b) => {
      return b.date - a.date;
    });
  }

  getAutogenEvents({
    autoGeneratedEventsCount = 10,
    country,
    city,
  }: {
    autoGeneratedEventsCount: number;
    country?: string;
    city?: string;
  }) {
    if (vars.env === "prod") return [];
    const autoGeneratedEvents: EventOnPoster[] =
      this.autogeneratedEvents.filter((e) => {
        if (country && city) {
          return e.location.country === country && e.location.city === city;
        }
        if (country) {
          return e.location.country === country;
        }
        return true;
      });

    const newAutoGeneratedEventsCount =
      autoGeneratedEventsCount - autoGeneratedEvents.length;

    if (newAutoGeneratedEventsCount <= 0) {
      return autoGeneratedEvents;
    }

    for (let i = 0; i < newAutoGeneratedEventsCount; i++) {
      const randomEventBase = this.getRandomAutogenEventBase();
      const randomPair = countriesAndCitiesController.getRandomPair({
        city,
        country,
      });
      autoGeneratedEvents.push({
        id: "autogen_" + uuid(),
        title: randomEventBase.title,
        description: randomEventBase.description,
        date: Date.now() - 1000 * 60 * 60 * 24 * Math.random() * 10,
        durationInSeconds: 60 * 60,
        image: randomEventBase.image,
        location: {
          country: randomPair.country,
          city: randomPair.city,
        },
        price: 1,
        timezone: {
          //# TODO: add timezone
          timezoneName: "Europe/Moscow",
          timezoneOffset: "+03:00",
        },
        url: "",
      });
    }

    this.autogeneratedEvents = [
      ...this.autogeneratedEvents,
      ...autoGeneratedEvents,
    ];

    return autoGeneratedEvents;
  }

  getEvent(id: string) {
    return (
      this.events.find((event) => event.id === id) ||
      this.autogeneratedEvents.find((event) => event.id === id)
    );
  }

  updateEvent(data: EventOnPoster) {
    const event = this.getEvent(data.id);
    if (!event) {
      throw new Error("Event not found");
    }

    Object.assign(event, data);

    fileDBController.updateDB();
  }

  findEvents(query: FindEventParams) {
    let events = this.events;
    if (query.searchLine) {
      const lowerCaseSearchLine = query.searchLine.toLowerCase();
      events = events.filter((event) => {
        return [
          event.title,
          event.description,
          event.location.country,
          event.location.city,
        ]
          .join(" ")
          .toLowerCase()
          .includes(lowerCaseSearchLine);
      });
    }
    if (query.country) {
      const lowerCaseCountry = query.country.toLowerCase();
      events = events.filter(
        (event) => event.location.country.toLowerCase() === lowerCaseCountry
      );
    }
    if (query.city) {
      const lowerCaseCity = query.city.toLowerCase();
      events = events.filter(
        (event) => event.location.city.toLowerCase() === lowerCaseCity
      );
    }
    return events;
  }

  deleteEvent(id: string) {
    const index = this.events.findIndex((event) => event.id === id);
    this.events.splice(index, 1);
    fileDBController.updateDB();
  }

  getRandomAutogenEventBase() {
    const index = Math.floor(Math.random() * this.autogenEventsBase.length);
    return this.autogenEventsBase[index];
  }
}

export const eventsStateController = new EventsStateController();
