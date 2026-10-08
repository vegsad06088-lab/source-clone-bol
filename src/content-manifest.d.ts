declare module "virtual:content-manifest" {
  export const contentFiles: string[];
}

declare module "virtual:active-project" {
  export const projectName: string;
  export const projectDir: string;
}
