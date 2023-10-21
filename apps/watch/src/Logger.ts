import chalk from "chalk";

export enum LogLevel {
    VERBOSE,
    DEBUG,
    INFO,
    WARN,
    ERROR,
    FATAL
}

const levelStringMap: {[key in LogLevel]: string} = {
    [LogLevel.VERBOSE]: "VERBOSE",
    [LogLevel.DEBUG]: "DEBUG",
    [LogLevel.INFO]: "INFO",
    [LogLevel.WARN]: "WARN",
    [LogLevel.ERROR]: "ERROR",
    [LogLevel.FATAL]: "FATAL"
}

const stringLevelMap: {[key in string]: LogLevel} = {
    "VERBOSE": LogLevel.VERBOSE,
    "DEBUG": LogLevel.DEBUG,
    "INFO": LogLevel.INFO,
    "WARN": LogLevel.WARN,
    "ERROR": LogLevel.ERROR,
    "FATAL": LogLevel.FATAL
}

const coloredLevelStringMap: {[key in LogLevel]: string} = {
    [LogLevel.VERBOSE]: chalk.gray("VERBOSE"),
    [LogLevel.DEBUG]: chalk.cyan("DEBUG"),
    [LogLevel.INFO]: chalk.green("INFO"),
    [LogLevel.WARN]: chalk.yellow("WARN"),
    [LogLevel.ERROR]: chalk.redBright("ERROR"),
    [LogLevel.FATAL]: chalk.red("FATAL")
}

export abstract class Logger<T = string> {
    public level: LogLevel = LogLevel.INFO;

    public abstract write(level: LogLevel, message: T): void;

    public log(level: LogLevel, message: T): void {
        if(level < this.level) {
            return;
        }
        this.write(level, message);
    };

    public verbose(message: T): void {
        this.log(LogLevel.VERBOSE, message);
    }
    public debug(message: T): void {
        this.log(LogLevel.DEBUG, message);
    }
    public info(message: T): void {
        this.log(LogLevel.INFO, message);
    }
    public warn(message: T): void {
        this.log(LogLevel.WARN, message);
    }
    public error(message: T): void {
        this.log(LogLevel.ERROR, message);
    }
    public fatal(message: T): void {
        this.log(LogLevel.FATAL, message);
    }

    public levelFromString(level: string): LogLevel | null {
        return stringLevelMap[level] ?? null;
    }

    public levelToString(level: LogLevel, colored = false): string {
        if(colored) {
            return coloredLevelStringMap[level] ?? chalk.gray("UNKNOWN"); // "UNKNOWN" should never happen
        } else {
            return levelStringMap[level] ?? "UNKNOWN"; // "UNKNOWN" should never happen
        }
    }

}
