export interface SendMailRequestMetaData {
    reciver:{
        email: string | string[],
        name:string,
        subject:string
    }[],
}
