import { getDbConnection } from "./db";

export async function getSummaries(userId: string) {
    const sql = await getDbConnection();
    const summaries = await sql`
        select * from pdf_summaries where user_id = ${userId} order by created_at desc
    `;
    return summaries;
}

export async function getSummaryById(id:string){
    try{
        const sql = await getDbConnection();
        const [summary] = await sql`select id,user_id,title,original_file_url,summary_text,created_at,updated_at,status,file_name,length(summary_text) -length(replace(summary_text,' ','')) + 1 as word_count from pdf_summaries where id=${id}`;
        return summary;
        
    }catch(err){
        console.error('Error fetching summary by id', err);
        return null;
    }
}

/*export async function getUserUploadCount(userId:string){
    const sql = await getDbConnection();
    try{
        const [result] = await sql`select count(*) as count from pdf_summaries where user_id=${userId}`;
        return result?.count || 0;
    }catch(err){
        console.error('Error fetching user upload count', err);
        return 0;
    }
}*/