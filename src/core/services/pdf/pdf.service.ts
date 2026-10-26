import { Injectable } from '@nestjs/common';

const MARGIN = 40;
const FONT_SIZE = 14;
const LINE_HEIGHT = 20;
const FIRST_LINE_Y = 760;
const MAX_CHARS = 70;

@Injectable()
export class PdfService {
  buildFromLines(lines: string[]): Buffer {
    const wrapped = lines.flatMap((line) => this.wrapLine(line));
    const content = wrapped
      .map((line, index) => {
        const y = FIRST_LINE_Y - index * LINE_HEIGHT;
        return `BT /F1 ${FONT_SIZE} Tf ${MARGIN} ${y} Td (${this.escapePdf(line)}) Tj ET`;
      })
      .join('\n');

    const objects = [
      '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n',
      '2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj\n',
      '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >> endobj\n',
      `4 0 obj << /Length ${Buffer.byteLength(content, 'utf8')} >> stream\n${content}\nendstream\nendobj\n`,
      '5 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n',
    ];

    let offset = '%PDF-1.4\n'.length;
    const offsets = objects.map((object) => {
      const current = offset;
      offset += Buffer.byteLength(object, 'utf8');
      return current;
    });

    const xrefStart = offset;
    const xref = [
      'xref\n0 6\n',
      '0000000000 65535 f \n',
      ...offsets.map(
        (value) => `${String(value).padStart(10, '0')} 00000 n \n`,
      ),
    ].join('');

    const trailer = `trailer << /Size 6 /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
    return Buffer.from(
      `%PDF-1.4\n${objects.join('')}${xref}${trailer}`,
      'utf8',
    );
  }

  private wrapLine(value: string): string[] {
    const text = this.ascii(value);
    if (text.length <= MAX_CHARS) return [text];

    const lines: string[] = [];
    let rest = text;
    while (rest.length > MAX_CHARS) {
      const space = rest.lastIndexOf(' ', MAX_CHARS);
      const cut = space > 0 ? space : MAX_CHARS;
      lines.push(rest.slice(0, cut));
      rest = rest.slice(cut).trimStart();
    }
    if (rest) lines.push(rest);
    return lines;
  }

  private ascii(value: string): string {
    return value.normalize('NFD').replace(/\p{M}/gu, '');
  }

  private escapePdf(value: string): string {
    return value
      .replace(/\\/g, '\\\\')
      .replace(/\(/g, '\\(')
      .replace(/\)/g, '\\)');
  }
}
