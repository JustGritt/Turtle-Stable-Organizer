import { promises as fs } from 'fs';
import path from 'path';

export async function get(req, res) {
    const outputDirectory = import.meta.env.PUBLIC_OUTPUT_PATH;
    const files = await fs.readdir(outputDirectory);
    const images = files.filter(file => path.extname(file) === '.png');
    res.writeHead(200, {
        'Content-Type': 'application/json'
    });
    res.end(JSON.stringify(images));
}