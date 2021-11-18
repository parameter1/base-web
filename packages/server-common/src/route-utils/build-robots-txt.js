module.exports = ({ conf } = {}) => {
  const lines = [];
  if (!conf.get('robots.enabled')) return lines;
  conf.getAsMap('robots.directives').forEach((values, userAgent) => {
    lines.push(`User-agent: ${userAgent}`);
    values.forEach((value) => lines.push(value));
  });

  return [
    ...(conf.get('robots.disallowAll')
      ? [
        'User-agent: *',
        'Disallow: /',
        '',
        '# WHEN NOT IN DISALLOW ALL MODE',
        ...lines.map((l) => `# ${l}`),
      ]
      : lines
    ),
  ].join('\n');
};
