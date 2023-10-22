import {Logger, LogLevel} from "./Logger";


export class ConsoleLogger extends Logger {
    public write(level: LogLevel, message: string): void {
        let str = this.levelToString(level, true);
        str += "\t> ";
        str += message;

        switch(level) {
            case LogLevel.VERBOSE:
                console.debug(str);
                break;
            case LogLevel.DEBUG:
                console.debug(str);
                break;
            default:
            case LogLevel.INFO:
                console.log(str);
                break;
            case LogLevel.WARN:
                console.warn(str);
                break;
            case LogLevel.ERROR:
            case LogLevel.FATAL:
                console.error(str);
                break;
        }
    }
}
