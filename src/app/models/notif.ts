export interface Notif{
    user_id: string;
    faculty_id: string;
    subject: string;
    type: string;
    desc: string;
    isRead: boolean;
    dateCreated: Date;
}