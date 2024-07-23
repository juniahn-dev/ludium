import { FailedAxiosData } from '../functions';

export type AxiosData<T> = T | FailedAxiosData;
