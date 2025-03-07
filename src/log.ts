import exhaust from '@/exhaust';

export default function log(type: 'INFO' | 'WARN' | 'ERROR', message: string): void {
    let color = '';

    switch (type) {
        case 'INFO':
            color = 'cyan';
            break;
        case 'WARN':
            color = 'orange';
            break;
        case 'ERROR':
            color = 'red';
            break;
        default:
            exhaust(type);
    }

    const date = new Date().toISOString();
    console.log(`%c[${date}] %c[${type}]%c ${message.replace(/\n/g, `\n>${' '.repeat(date.length + 3 + type.length + 2)}`)}`, `color: ${color}; font-weight: normal;`, `color: ${color}; font-weight: bold;`, `color: ${color}; font-weight: normal;`);
}
