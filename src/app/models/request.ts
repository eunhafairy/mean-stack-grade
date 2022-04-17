export interface Request{

    request_id: string;
    subject: string;
    user_id: string;
    faculty_id: string;
    status: string;
    creator: string;
    desc: string,
    dateRequested: Date,
    dateAccepted: Date, 
    semester : string,
    year: string, 
    note: string,
    cys: string,
    verdict: string, 
    request_form: string

}