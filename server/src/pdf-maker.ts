// import './style.css';
import pdf from 'pdfjs/';

export async function render() {
  const lorem =
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cum id fugiunt, re eadem quae Peripatetici, verba. Tenesne igitur, inquam, Hieronymus Rhodius quid dicat esse summum bonum, quo putet omnia referri oportere? Quia nec honesto quic quam honestius nec turpi turpius.';

  const doc = new pdf.Document({ font: fonts.Helvetica });

  const header = doc
    .header()
    .table({ widths: [null, null], paddingBottom: 1 * pdf.cm })
    .row();
  // header.cell().image(logo, { height: 2 * pdf.cm });
  header
    .cell()
    .text({ textAlign: 'right' })
    .add(
      'A Portable Document Format (PDF) generation library targeting both the server- and client-side.'
    )
    .add('https://github.com/rkusa/pdfjs', {
      link: 'https://github.com/rkusa/pdfjs',
      underline: true,
      color: 0x569cd6,
    });

  doc.footer().pageNumber(
    function (curr, total) {
      return curr + ' / ' + total;
    },
    { textAlign: 'center' }
  );

  const cell = doc.cell({ paddingBottom: 0.5 * pdf.cm });
  cell.text('Features:', { fontSize: 16, font: fonts.HelveticaBold });
  cell
    .text({ fontSize: 14, lineHeight: 1.35 })
    .add('-')
    .add('different', { color: 0xf8dc3f })
    .add('font', { font: fonts.TimesRoman })
    .add('styling', { underline: true })
    .add('options', { fontSize: 9 });
  cell.text('- Images (JPEGs, other PDFs)');
  cell.text('- Tables (fixed layout, header row)');
  cell.text('- AFM fonts and');
  cell.text(
    '- OTF font embedding (as CID fonts, i.e., support for fonts with large character sets)',
    // {
    //   font: fonts.OpenSans,
    // }
  );
  cell.text('- Add existing PDFs (merge them or add them as page templates)');

  doc
    .cell({ paddingBottom: 0.5 * pdf.cm })
    .text()
    .add('For more information visit the')
    .add('Documentation', {
      link: 'https://github.com/rkusa/pdfjs/tree/master/docs',
      underline: true,
      color: 0x569cd6,
    });

  const table = doc.table({
    widths: [1.5 * pdf.cm, 1.5 * pdf.cm, null, 2 * pdf.cm, 2.5 * pdf.cm],
    borderHorizontalWidths: function (i) {
      return i < 2 ? 1 : 0.1;
    },
    padding: 5,
  });

  const tr = table.header({
    font: fonts.HelveticaBold,
    borderBottomWidth: 1.5,
  });
  tr.cell('#');
  tr.cell('Unit');
  tr.cell('Subject');
  tr.cell('Price', { textAlign: 'right' });
  tr.cell('Total', { textAlign: 'right' });

  function addRow(qty, name, desc, price) {
    const tr = table.row();
    tr.cell(qty.toString());
    tr.cell('pc.');

    const article = tr.cell().text();
    article
      .add(name, { font: fonts.HelveticaBold })
      .br()
      .add(desc, { fontSize: 11, textAlign: 'justify' });

    tr.cell(price.toFixed(2) + ' €', { textAlign: 'right' });
    tr.cell((price * qty).toFixed(2) + ' €', { textAlign: 'right' });
  }

  addRow(2, 'Article A', lorem, 500);
  addRow(1, 'Article B', lorem, 250);
  addRow(2, 'Article C', lorem, 330);
  addRow(3, 'Article D', lorem, 1220);
  addRow(2, 'Article E', lorem, 120);
  addRow(5, 'Article F', lorem, 50);

  const buf = await doc.asBuffer();
  // const blob = new Blob([buf], { type: 'application/pdf' });
  return buf;
  // const url = URL.createObjectURL(blob);

  // const previewEl = document.getElementById('preview');
  // previewEl.data = url;
}

import CourierBold from 'pdfjs/font/Courier-Bold';
import CourierBoldOblique from 'pdfjs/font/Courier-BoldOblique';
import CourierOblique from 'pdfjs/font/Courier-Oblique';
import Courier from 'pdfjs/font/Courier';
import HelveticaBold from 'pdfjs/font/Helvetica-Bold';
import HelveticaBoldOblique from 'pdfjs/font/Helvetica-BoldOblique';
import HelveticaOblique from 'pdfjs/font/Helvetica-Oblique';
import Helvetica from 'pdfjs/font/Helvetica';
import Symbol from 'pdfjs/font/Symbol';
import TimesBold from 'pdfjs/font/Times-Bold';
import TimesBoldItalic from 'pdfjs/font/Times-BoldItalic';
import TimesItalic from 'pdfjs/font/Times-Italic';
import TimesRoman from 'pdfjs/font/Times-Roman';
import ZapfDingbats from 'pdfjs/font/ZapfDingbats';

const fonts = {
  CourierBold,
  CourierBoldOblique,
  CourierOblique,
  Courier,
  HelveticaBold,
  HelveticaBoldOblique,
  HelveticaOblique,
  Helvetica,
  Symbol,
  TimesBold,
  TimesBoldItalic,
  TimesItalic,
  TimesRoman,
  ZapfDingbats,
  // OpenSans,
};

