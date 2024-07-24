// place files you want to import through the `$lib` alias in this folder.

export function bytesToSize(bytes: number): string {
    if (bytes == 0 ){
        return '0 Bytes'
    }
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}