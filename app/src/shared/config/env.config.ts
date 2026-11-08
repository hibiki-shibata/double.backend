export const isDevMode: boolean = ['dev', 'development'].includes(process.env.NODE_ENV ?? '')
export const isStageMode: boolean = ['stage'].includes(process.env.NODE_ENV ?? '')
export const isProdMode: boolean = ['prod', 'production'].includes(process.env.NODE_ENV ?? '')