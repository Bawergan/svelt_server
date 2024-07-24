import { json } from '@sveltejs/kit';
import * as fs from 'fs/promises';
import path from 'path';

export async function POST (request) {
    try {
        const data = await request.request.formData();   
        const file = data.get('file') as File;
        const id = data.get('index');

        if (!file || !id) {
            return json({ status: 400, error: 'Invalid request' });    
        }
      
        const uploadDir = './uploads';
        await fs.mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, file.name);
        await fs.writeFile(filePath, Buffer.from(await file.arrayBuffer()));
        
        return json({ status:201, body: id});
    } catch (error) {
        console.error('Error uploading file:', error);
        return json({ status: 500, error: 'Internal Server Error' });
    }
}