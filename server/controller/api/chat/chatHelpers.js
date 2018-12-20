const replaceLineBreaksHtml = module.exports.replaceLineBreaksHtml = function replaceLineBreaksHtml(html)
{
    let new_html = html.replace(/\r\n|\n\r/g, '\n').replace(/\n\n/g, '\n').replace(/\n/g, '<br />');
    new_html = new_html.replace(/<(?!br\s*\/?)[^>]+>/g, '');

    return new_html;
};