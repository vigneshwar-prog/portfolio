import { clsx, type ClassValue } from "clsx";
export const cn = (...inputs: ClassValue[]) => clsx(inputs);

export const accentText = { green: "text-green", cyan: "text-cyan", violet: "text-violet" } as const;
