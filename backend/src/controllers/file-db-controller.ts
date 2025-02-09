import fs from 'node:fs/promises';

import fsSync from 'fs';

// eslint-disable-next-line import/no-cycle
import { eventsStateController } from './events-state-controller';
import { getTimestamp, TimestampTypesEnum } from '../utils/get-timestamp';

export enum TaskTypesEnum {
	READ_FILE = 'read',
	WRITE_FILE = 'write',
	SAVE_BACKUP = 'backup'
}

type Task = {
	action: TaskTypesEnum;
	time: number;
};

export class FileDbController {
	constructor() {
		const registrationPath = 'assets/db/registrations.json';

		if (!fsSync.existsSync('assets/db')) {
			fsSync.mkdirSync('assets/db');
			fsSync.writeFileSync('assets/db/events.json', '[]', {});
			fsSync.writeFileSync(registrationPath, '[]', {});
		} else if (!fsSync.existsSync('assets/db/events.json')) {
			fsSync.writeFileSync('assets/db/events.json', '[]', {});
		} else if (!fsSync.existsSync(registrationPath)) {
			fsSync.writeFileSync(registrationPath, '[]', {});
		} else {
			this.addTask(TaskTypesEnum.READ_FILE);
		}
		this.addTask(
			TaskTypesEnum.SAVE_BACKUP,
			Date.now() + getTimestamp({ value: 1, type: TimestampTypesEnum.HOURS })
		);

		setInterval(
			this.checkTasks.bind(this),
			getTimestamp({ value: 1, type: TimestampTypesEnum.SECONDS })
		);
	}

	_tasks: Task[] = [];

	get tasks() {
		return this._tasks;
	}

	set tasks(value) {
		this._tasks = value;
	}

	private addTask(type: TaskTypesEnum, delay?: number) {
		this.tasks.push({ action: type, time: delay || 0 });
		this.tasks.sort((a, b) => a.time - b.time);
	}

	getTasks() {
		return this.tasks;
	}

	private checkTasks() {
		const tasks = this.getTasks();

		if (!tasks.length || tasks[0].time > Date.now()) return;

		const currentTask = tasks.shift();

		if (!currentTask) return;
		this.runTask(currentTask);
	}

	private async runTask(task: Task) {
		switch (task.action) {
			case TaskTypesEnum.READ_FILE:
				await this.loadFromDrive();
				break;

			case TaskTypesEnum.WRITE_FILE:
				await this.saveToDrive();
				break;

			case TaskTypesEnum.SAVE_BACKUP:
				await this.makeBackup();
				this.addTask(
					TaskTypesEnum.SAVE_BACKUP,
					Date.now() + getTimestamp({ value: 1, type: TimestampTypesEnum.HOURS })
				);
				break;

			default:
				break;
		}
	}

	updateDB() {
		this.addTask(TaskTypesEnum.WRITE_FILE);
	}

	private async saveToDrive() {
		const events = eventsStateController.getEvents();
		await fs.writeFile('assets/db/events.json', JSON.stringify(events), {
			encoding: 'utf-8',
			flag: 'w'
		});
	}

	private async makeBackup() {
		const dateString = new Date().toISOString().replaceAll(':', '_');
		await fs.copyFile('assets/db/events.json', `assets/db/backup-events-${dateString}.json`);
		await fs.copyFile(
			'assets/db/registrations.json',
			`assets/db/backup-registrations-${dateString}.json`
		);
	}

	private async loadFromDrive() {
		const json = await fs.readFile('assets/db/events.json', {
			encoding: 'utf-8'
		});
		if (json.trim() === '') return;
		const events = JSON.parse(json);
		eventsStateController.events = events;
	}
}

export const fileDBController = new FileDbController();
