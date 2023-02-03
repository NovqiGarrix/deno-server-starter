import createServer from "@app";
import type { RouteParams, RouterContext } from "@deps";

export interface FormError {
    field: string;
    message: string;
}

type ApplicationWithStateType = ReturnType<typeof createServer>;

// Get the state type from the application
type ApplicationState = ApplicationWithStateType["state"];

export type OakContext<R extends string> = RouterContext<
    R,
    RouteParams<R>,
    ApplicationState
>;

export type NextFunction<T> = () => Promise<T>;

export type MyError = Error | null;

export type ServiceReturn<T> = [T, MyError, number];
