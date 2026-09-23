import { moment as hostMoment } from "obsidian";
import type momentFactory from "moment";

export const moment = hostMoment as unknown as typeof momentFactory;
