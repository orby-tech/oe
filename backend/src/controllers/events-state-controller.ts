import fs from 'node:fs/promises';
import { EventOnPoster } from "@common/types/event";
import { v4 as uuid } from "uuid";

export class EventsStateController {
  _events: EventOnPoster[] = [];

  get events() {
    return this._events;
  }
  set events(value) {
    this._events = value;
  }

  constructor() {
    [1, 2, 3, 4, 5, 6, 7]
      .map((i) => {
        return {
          id: i.toString(),
          title: "title " + i.toString(),
          description: "description " + i.toString(),
          date: Date.now() + 1000 * 60 * 60 * 24,
          durationInSeconds: 60 * 60,
          image: "https://picsum.photos/200/300",
          location: {
            country: "country " + i.toString(),
            city: "city " + i.toString(),
          },
          price: 1,
        };
      })
      .forEach((event) => {
        this.addEvent(event);
      });
    this.saveToDrive()
  }

  async saveToDrive() {
    const events = this.getEvents();
    await fs.writeFile('assets/db/events.json', JSON.stringify(events), {encoding: 'utf-8',flag:'w'});
  }

  async loadFromDrive() {
    const json = await fs.readFile('assets/db/events.json', {encoding: 'utf-8'});
    const events = JSON.parse(json);
    this.events = events;
  }

  addEvent(event: EventOnPoster) {
    this.events.push({ ...event, id: uuid() });
    this.saveToDrive();
  }

  getEvents() {
    return this.events;
  }

  getEvent(id: string) {
    return this.events.find((event) => event.id === id);
  }

  updateEvent(data: EventOnPoster) {
    const event = this.getEvent(data.id);
    if (!event) {
      throw new Error("Event not found");
    }

    Object.assign(event, data);

    this.saveToDrive();
  }

  deleteEvent(id: string) {
    const index = this.events.findIndex((event) => event.id === id);
    this.events.splice(index, 1);
    this.saveToDrive();
  }
}
