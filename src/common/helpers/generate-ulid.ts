import { monotonicFactory } from 'ulid';

export const generateUlid: () => string = monotonicFactory();
